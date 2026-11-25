<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit("Not found\n");
}

date_default_timezone_set('Europe/Moscow');
$now = new DateTimeImmutable('now', new DateTimeZone('Europe/Moscow'));
$reportEnd = $now->format('Y-m-d H:i:s');

$privateDir = __DIR__;
$publicRoot = dirname(__DIR__) . '/public_html';
$configPath = $privateDir . '/baribal-mail.json';
$autoloadPath = $publicRoot . '/vendor/autoload.php';
$storePath = $publicRoot . '/lib/lead-store.php';
if (!is_file($configPath) || !is_readable($configPath) || !is_file($autoloadPath) || !is_file($storePath)) {
    error_log('BARIBAL daily report: configuration or dependencies are missing.');
    exit(1);
}

try {
    $config = json_decode((string)file_get_contents($configPath), true, 512, JSON_THROW_ON_ERROR);
    require_once $storePath;
    require_once $autoloadPath;
    $pdo = baribalLeadDatabase($config);
    $lock = (int)$pdo->query("SELECT GET_LOCK('baribal_daily_report', 0)")->fetchColumn();
    if ($lock !== 1) exit(0);

    try {
        $reportDate = $now->format('Y-m-d');
        $lastSuccessfulSend = $pdo->query(
            'SELECT MAX(sent_at) FROM baribal_daily_reports WHERE sent_at IS NOT NULL'
        )->fetchColumn();
        $periodStart = ($lastSuccessfulSend !== false && $lastSuccessfulSend !== null)
            ? (string)$lastSuccessfulSend
            : $now->setTime(0, 0)->format('Y-m-d H:i:s');
        $periodEnd = $reportEnd;
        $daily = ['new' => 0, 'in_progress' => 0, 'booked' => 0, 'completed' => 0];
        $dailyQuery = $pdo->prepare(
            'SELECT status, COUNT(*) AS amount FROM baribal_leads
             WHERE created_at > :start AND created_at <= :finish GROUP BY status'
        );
        $dailyQuery->execute(['start' => $periodStart, 'finish' => $periodEnd]);
        foreach ($dailyQuery->fetchAll() as $row) {
            if (array_key_exists((string)$row['status'], $daily)) $daily[(string)$row['status']] = (int)$row['amount'];
        }
        $todayTotal = array_sum($daily);

        $cumulative = $pdo->query(
            "SELECT
                SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS new_count,
                SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_count
             FROM baribal_leads"
        )->fetch() ?: [];
        $newCount = (int)($cumulative['new_count'] ?? 0);
        $inProgressCount = (int)($cumulative['in_progress_count'] ?? 0);
        $pendingReviews = (int)$pdo->query("SELECT COUNT(*) FROM baribal_reviews WHERE status = 'pending'")->fetchColumn();

        $dateLabel = $now->format('d.m.Y');
        $periodLabel = (new DateTimeImmutable($periodStart, new DateTimeZone('Europe/Moscow')))->format('d.m.Y H:i')
            . ' — ' . $now->format('d.m.Y H:i');
        $statusLabels = [
            'new' => 'Новые',
            'in_progress' => 'В работе',
            'booked' => 'Записаны',
            'completed' => 'Завершены',
        ];
        $html = '<div style="font-family:Arial,sans-serif;background:#f2f3f4;padding:24px;color:#202326"><div style="max-width:620px;margin:auto;background:#fff;border:1px solid #e4e6e8;border-radius:14px;overflow:hidden">'
            . '<div style="background:#222629;color:#fff;padding:22px 26px"><div style="color:#d8a05b;font-size:11px;letter-spacing:2px;font-weight:bold">BARIBAL · ПЕРМЬ</div><h2 style="margin:8px 0 0;font-size:23px">Отчёт по заявкам</h2><div style="color:#d4d8da;font-size:13px;margin-top:5px">' . htmlspecialchars($periodLabel, ENT_QUOTES, 'UTF-8') . '</div></div>'
            . '<div style="padding:22px 26px"><h3 style="font-size:15px;margin:0 0 12px">Новые заявки за период</h3>'
            . '<div style="font-size:28px;font-weight:bold;margin-bottom:8px">' . $todayTotal . ' <span style="font-size:13px;font-weight:normal;color:#687078">поступило заявок</span></div>'
            . '<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">';
        foreach ($statusLabels as $key => $label) {
            $html .= '<tr><td style="padding:8px 0;border-bottom:1px solid #edf0f1;color:#596168">' . $label . '</td><td align="right" style="padding:8px 0;border-bottom:1px solid #edf0f1;font-weight:bold">' . $daily[$key] . '</td></tr>';
        }
        $html .= '</table><h3 style="font-size:15px;margin:24px 0 12px">Накопительные результаты</h3>'
            . '<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">'
            . '<tr><td style="padding:8px 0;border-bottom:1px solid #edf0f1;color:#596168">Новые, ожидают обработки</td><td align="right" style="font-weight:bold">' . $newCount . '</td></tr>'
            . '<tr><td style="padding:8px 0;border-bottom:1px solid #edf0f1;color:#596168">В работе</td><td align="right" style="font-weight:bold">' . $inProgressCount . '</td></tr>'
            . '<tr><td style="padding:12px 0;color:#202326;font-weight:bold">Всего требуют внимания</td><td align="right" style="font-size:22px;font-weight:bold;color:#b53c3c">' . ($newCount + $inProgressCount) . '</td></tr>'
            . '</table><div style="margin-top:20px;padding:13px 15px;background:#fff5f5;border-radius:9px;color:#7b3434">Отзывы на модерации: <strong>' . $pendingReviews . '</strong></div>'
            . '<div style="margin-top:22px"><a href="https://baribal-studio.ru/admin/leads.php" style="display:inline-block;padding:12px 17px;background:#25292c;border-radius:8px;color:#fff;text-decoration:none;font-size:13px;font-weight:bold">Открыть админку</a></div></div>'
            . '<div style="padding:14px 26px;background:#f7f8f8;color:#8a9298;font-size:11px">Отчёт формируется автоматически по данным базы BARIBAL.</div></div></div>';

        $plain = "BARIBAL — отчёт по заявкам {$dateLabel}\nПериод: {$periodLabel}\n\n"
            . "Новые заявки за период: {$todayTotal}\n"
            . "Новые: {$daily['new']}\nВ работе: {$daily['in_progress']}\nЗаписаны: {$daily['booked']}\nЗавершены: {$daily['completed']}\n\n"
            . "Накопительные результаты:\nНовые: {$newCount}\nВ работе: {$inProgressCount}\nВсего требуют внимания: " . ($newCount + $inProgressCount) . "\n"
            . "Отзывы на модерации: {$pendingReviews}\n\nАдминка: https://baribal-studio.ru/admin/leads.php";

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = (string)($config['smtp_host'] ?? 'smtp.timeweb.ru');
        $mail->SMTPAuth = true;
        $mail->Username = (string)$config['smtp_username'];
        $mail->Password = (string)$config['smtp_password'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;
        $mail->CharSet = PHPMailer::CHARSET_UTF8;
        $mail->setFrom($mail->Username, 'BARIBAL — ежедневный отчёт');
        $mail->addAddress((string)$config['recipient']);
        $mail->Subject = 'BARIBAL · отчёт по заявкам · ' . $dateLabel;
        $mail->isHTML(true);
        $mail->Body = $html;
        $mail->AltBody = $plain;
        $mail->send();

        $save = $pdo->prepare(
            "INSERT INTO baribal_daily_reports (report_date, sent_at, attempts, last_error)
             VALUES (:date, :sent_at, 1, '')
             ON DUPLICATE KEY UPDATE sent_at = VALUES(sent_at), attempts = attempts + 1, last_error = ''"
        );
        $save->execute(['date' => $reportDate, 'sent_at' => $periodEnd]);
    } catch (Throwable $error) {
        $saveFailure = $pdo->prepare(
            "INSERT INTO baribal_daily_reports (report_date, sent_at, attempts, last_error)
             VALUES (:date, NULL, 1, :error)
             ON DUPLICATE KEY UPDATE attempts = attempts + 1, last_error = VALUES(last_error)"
        );
        $saveFailure->execute([
            'date' => $now->format('Y-m-d'),
            'error' => substr(get_class($error) . ': ' . $error->getMessage(), 0, 255),
        ]);
        error_log('BARIBAL daily report failed (' . get_class($error) . ').');
        exit(1);
    } finally {
        $pdo->query("SELECT RELEASE_LOCK('baribal_daily_report')");
    }
} catch (Throwable $error) {
    error_log('BARIBAL daily report bootstrap failed (' . get_class($error) . ').');
    exit(1);
}
