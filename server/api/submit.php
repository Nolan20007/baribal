<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

function leadResponse(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function leadText($value, int $maxLength): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '');
    return function_exists('mb_substr') ? mb_substr($value, 0, $maxLength, 'UTF-8') : substr($value, 0, $maxLength);
}

function leadPageUrl(string $candidate, string $host): string
{
    $candidate = leadText($candidate, 1200);
    if ($candidate === '') {
        return '';
    }
    $parts = parse_url($candidate);
    $candidateHost = strtolower((string)($parts['host'] ?? ''));
    $requestHost = strtolower(preg_replace('/:\\d+$/', '', $host) ?? $host);
    if (!in_array((string)($parts['scheme'] ?? ''), ['http', 'https'], true)
        || $candidateHost === ''
        || $candidateHost !== $requestHost) {
        return '';
    }
    return $candidate;
}

if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 8192) {
    leadResponse(413, ['success' => false, 'message' => 'Слишком большой объём данных.']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    leadResponse(405, ['success' => false, 'message' => 'Метод не поддерживается.']);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
if ($origin !== '') {
    $originHost = strtolower((string)parse_url($origin, PHP_URL_HOST));
    if ($originHost === '' || $originHost !== preg_replace('/:\\d+$/', '', $host)) {
        leadResponse(403, ['success' => false, 'message' => 'Запрос отклонён.']);
    }
}
if (strtolower((string)($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '')) === 'cross-site') {
    leadResponse(403, ['success' => false, 'message' => 'Запрос отклонён.']);
}

if (!empty($_POST['website'])) {
    leadResponse(200, ['success' => true]);
}

$phone = leadText($_POST['phone'] ?? '', 40);
$phoneDigits = preg_replace('/\D+/', '', $phone) ?? '';
if (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 15) {
    leadResponse(422, ['success' => false, 'message' => 'Проверьте номер телефона.']);
}

$name = leadText($_POST['name'] ?? '', 100);
$car = leadText($_POST['car'] ?? '', 150);
$service = leadText($_POST['service'] ?? '', 180);
$selectedServices = leadText($_POST['selected_services'] ?? '', 1500);
$contactOther = leadText($_POST['contact_other'] ?? '', 180);
$methods = $_POST['contact_method'] ?? ($_POST['contact_method[]'] ?? []);
if (!is_array($methods)) {
    $methods = [$methods];
}
$allowedMethods = ['phone', 'max', 'telegram', 'other'];
$methods = array_values(array_unique(array_filter(
    array_map(static fn($item) => is_string($item) ? $item : '', $methods),
    static fn($item) => in_array($item, $allowedMethods, true)
)));
$contactMethods = array_values(array_filter($methods, static fn($method) => $method !== 'other'));
if (!$contactMethods) {
    leadResponse(422, ['success' => false, 'message' => 'Выберите способ связи: телефон, MAX или Telegram.']);
}

$methodLabels = [
    'phone' => 'Телефон',
    'max' => 'MAX',
    'telegram' => 'Telegram',
];
$methodText = array_map(static fn($method) => $methodLabels[$method], $contactMethods);

$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR
    . 'baribal-lead-' . hash('sha256', $ip) . '.txt';
$rateHandle = @fopen($rateFile, 'c+');
if ($rateHandle !== false) {
    if (flock($rateHandle, LOCK_EX)) {
        $lastSent = (int)trim((string)stream_get_contents($rateHandle));
        if ($lastSent > 0 && time() - $lastSent < 20) {
            flock($rateHandle, LOCK_UN);
            fclose($rateHandle);
            leadResponse(429, ['success' => false, 'message' => 'Подождите немного перед следующей отправкой.']);
        }
        ftruncate($rateHandle, 0);
        rewind($rateHandle);
        fwrite($rateHandle, (string)time());
        fflush($rateHandle);
        flock($rateHandle, LOCK_UN);
    }
    fclose($rateHandle);
}

$configPath = dirname(__DIR__, 2) . '/baribal-private/baribal-mail.json';
$autoloadPath = dirname(__DIR__) . '/vendor/autoload.php';
$storePath = dirname(__DIR__) . '/lib/lead-store.php';
if (!is_file($configPath) || !is_readable($configPath) || !is_file($autoloadPath)) {
    error_log('BARIBAL lead delivery configuration or mailer is unavailable.');
    leadResponse(503, ['success' => false, 'message' => 'Отправка заявок временно недоступна. Позвоните нам, пожалуйста.']);
}

try {
    $configJson = file_get_contents($configPath);
    if ($configJson === false) {
        throw new RuntimeException('Private mail configuration could not be read.');
    }
    $config = json_decode($configJson, true, 512, JSON_THROW_ON_ERROR);
} catch (Throwable $error) {
    error_log('BARIBAL private mail configuration could not be decoded (' . get_class($error) . ').');
    leadResponse(503, ['success' => false, 'message' => 'Отправка заявок временно недоступна. Позвоните нам, пожалуйста.']);
}

if (!is_array($config) || empty($config['smtp_username']) || empty($config['smtp_password']) || empty($config['recipient'])) {
    error_log('BARIBAL lead delivery configuration is incomplete.');
    leadResponse(503, ['success' => false, 'message' => 'Отправка заявок временно недоступна. Позвоните нам, пожалуйста.']);
}

require $autoloadPath;

$pageUrl = leadPageUrl(leadText($_POST['page_url'] ?? '', 1200), $host);
if ($pageUrl === '' && !empty($_SERVER['HTTP_REFERER'])) {
    $pageUrl = leadPageUrl((string)$_SERVER['HTTP_REFERER'], $host);
}
$pageParts = $pageUrl !== '' ? parse_url($pageUrl) : [];
$pagePath = leadText((string)($pageParts['path'] ?? ''), 255);
$pageDisplayPath = $pagePath === '/' ? 'index.html' : $pagePath;
$pageTitle = leadText($_POST['page_title'] ?? '', 255);
$sourceBlock = leadText($_POST['source_block'] ?? '', 255);
$sourceButton = leadText($_POST['source_button'] ?? '', 180);
$referrer = leadText($_POST['referrer'] ?? ($_SERVER['HTTP_REFERER'] ?? ''), 1200);
$utm = [];
foreach (['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as $key) {
    $utm[$key] = leadText($_POST[$key] ?? '', 255);
}

$lead = [
    'name' => $name,
    'phone' => $phone,
    'phone_normalized' => preg_replace('/\D+/', '', $phone) ?? '',
    'car' => $car,
    'service' => $service,
    'selected_services' => $selectedServices,
    'contact_methods' => implode(', ', $methodText),
    'contact_other' => $contactOther,
    'page_url' => $pageUrl,
    'page_path' => $pagePath,
    'page_title' => $pageTitle,
    'source_block' => $sourceBlock,
    'source_button' => $sourceButton,
    'referrer' => $referrer,
    'utm_source' => $utm['utm_source'],
    'utm_medium' => $utm['utm_medium'],
    'utm_campaign' => $utm['utm_campaign'],
    'utm_term' => $utm['utm_term'],
    'utm_content' => $utm['utm_content'],
];

$database = null;
$storedLead = null;
$dbError = '';
if (is_file($storePath)) {
    try {
        require_once $storePath;
        $database = baribalLeadDatabase($config);
        $storedLead = baribalSaveLead($database, array_merge($lead, [
            'phone_normalized' => baribalNormalizePhone($phone),
        ]));
    } catch (Throwable $error) {
        $dbError = get_class($error);
        error_log('BARIBAL lead database save failed (' . $dbError . ').');
        $database = null;
        $storedLead = null;
    }
} else {
    $dbError = 'LeadStoreUnavailable';
    error_log('BARIBAL lead storage library is unavailable.');
}

$leadNumber = is_array($storedLead) ? $storedLead['number'] : '';
$repeat = is_array($storedLead) && $storedLead['is_repeat'];
$previousNumber = $repeat ? (string)$storedLead['previous_number'] : '';

$e = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$display = [
    'Имя' => $name !== '' ? $name : 'Не указано',
    'Телефон' => $phone,
    'Способ связи' => implode(', ', $methodText),
];
if ($contactOther !== '') {
    $display['Комментарий'] = $contactOther;
}
if ($car !== '') {
    $display['Автомобиль'] = $car;
}
if ($service !== '') {
    $display['Услуга'] = $service;
}
if ($selectedServices !== '') {
    $display['Выбранные услуги'] = $selectedServices;
}
$sourceDisplay = [
    'Страница' => $pageTitle !== '' ? $pageTitle : ($pagePath !== '' ? $pagePath : 'Не определена'),
    'Адрес страницы' => $pageUrl !== '' ? ($pageDisplayPath !== '' ? $pageDisplayPath : 'index.html') : 'Не определён',
    'Блок' => $sourceBlock !== '' ? $sourceBlock : 'Не определён',
    'Кнопка' => $sourceButton !== '' ? $sourceButton : 'Не определена',
    'Предыдущая страница' => $referrer !== '' ? $referrer : 'Не определена',
];
$adminUrl = 'https://' . preg_replace('/[^a-z0-9.:-]/i', '', $host) . '/admin/leads.php';
if ($leadNumber !== '') {
    $adminUrl .= '?q=' . rawurlencode($leadNumber);
}

$plainLines = [
    $leadNumber !== '' ? 'Заявка ' . $leadNumber : 'Новая заявка BARIBAL (номер временно не присвоен)',
    $repeat ? 'ВНИМАНИЕ: возможное повторное обращение. Предыдущая заявка: ' . $previousNumber : 'Первое обращение с этого номера.',
    '',
];
foreach ($display as $label => $value) {
    $plainLines[] = $label . ': ' . $value;
}
$plainLines[] = '';
$plainLines[] = 'Источник обращения:';
foreach ($sourceDisplay as $label => $value) {
    $plainLines[] = $label . ': ' . $value;
}
foreach ($utm as $key => $value) {
    if ($value !== '') {
        $plainLines[] = strtoupper($key) . ': ' . $value;
    }
}
if ($dbError !== '') {
    $plainLines[] = '';
    $plainLines[] = 'ВНИМАНИЕ: заявка отправлена по почте, но не сохранена в базе. Ошибка: ' . $dbError;
}
$plainBody = implode("\n", $plainLines);

$htmlBody = '<div style="margin:0;padding:28px 12px;background:#f2f3f4;font-family:Arial,Helvetica,sans-serif;color:#202326">'
    . '<div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e4e6e8;border-radius:16px;overflow:hidden">'
    . '<div style="padding:24px 28px;background:#222629;color:#ffffff"><div style="font-size:11px;letter-spacing:2px;color:#d8a05b;font-weight:bold">BARIBAL · ПЕРМЬ</div>'
    . '<div style="font-size:24px;font-weight:bold;margin-top:8px">Новая заявка</div>'
    . '<div style="font-size:14px;color:#d4d8da;margin-top:5px">' . ($leadNumber !== '' ? $e($leadNumber) : 'Номер временно не присвоен') . '</div></div>'
    . '<div style="padding:24px 28px">';
if ($repeat) {
    $htmlBody .= '<div style="padding:12px 14px;margin:0 0 20px;background:#fff3df;border:1px solid #f0d7ad;border-radius:9px;color:#80551f;font-size:14px"><strong>Возможное повторное обращение</strong><br>Ранее с этого номера поступала заявка ' . $e($previousNumber) . '. Новое обращение сохранено отдельно.</div>';
}
if ($dbError !== '') {
    $htmlBody .= '<div style="padding:12px 14px;margin:0 0 20px;background:#fff3df;border-radius:9px;color:#80551f;font-size:13px">Заявка доставлена по почте, но не попала в базу. Требуется проверить подключение базы данных.</div>';
}
$htmlBody .= '<div style="font-size:11px;letter-spacing:1.3px;color:#9a713f;font-weight:bold;margin:0 0 10px">КОНТАКТ И ЗАПРОС</div>'
    . '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">';
foreach ($display as $label => $value) {
    $htmlBody .= '<tr><td style="width:38%;padding:9px 8px 9px 0;border-bottom:1px solid #edf0f1;color:#697177;font-size:13px;vertical-align:top">' . $e($label) . '</td>'
        . '<td style="padding:9px 0;border-bottom:1px solid #edf0f1;color:#202326;font-size:14px;font-weight:600;vertical-align:top">' . nl2br($e($value)) . '</td></tr>';
}
$htmlBody .= '</table><div style="font-size:11px;letter-spacing:1.3px;color:#9a713f;font-weight:bold;margin:24px 0 10px">ИСТОЧНИК ОБРАЩЕНИЯ</div>'
    . '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">';
foreach ($sourceDisplay as $label => $value) {
    $safeValue = $e($value);
    if ($label === 'Адрес страницы' && $pageUrl !== '') {
        $safeValue = '<a href="' . $e($pageUrl) . '" style="color:#94652d;text-decoration:none">' . $e($pageDisplayPath !== '' ? $pageDisplayPath : 'index.html') . '</a>';
    }
    $htmlBody .= '<tr><td style="width:38%;padding:8px 8px 8px 0;border-bottom:1px solid #edf0f1;color:#697177;font-size:13px;vertical-align:top">' . $e($label) . '</td>'
        . '<td style="padding:8px 0;border-bottom:1px solid #edf0f1;color:#202326;font-size:13px;vertical-align:top">' . $safeValue . '</td></tr>';
}
$htmlBody .= '</table>';
$utmValues = array_filter($utm, static fn($value) => $value !== '');
if ($utmValues) {
    $htmlBody .= '<div style="margin-top:18px;padding:12px 14px;background:#f6f7f7;border-radius:9px;font-size:12px;color:#596168">';
    foreach ($utmValues as $key => $value) {
        $htmlBody .= '<div style="margin:3px 0"><strong>' . $e(strtoupper($key)) . ':</strong> ' . $e($value) . '</div>';
    }
    $htmlBody .= '</div>';
}
$htmlBody .= '<div style="margin-top:24px"><a href="' . $e($adminUrl) . '" style="display:inline-block;padding:12px 18px;background:#25292c;border-radius:8px;color:#ffffff;text-decoration:none;font-size:13px;font-weight:bold">Открыть журнал заявок</a></div>'
    . '</div><div style="padding:14px 28px;background:#f7f8f8;color:#8a9298;font-size:11px">BARIBAL · Автоматическое уведомление с сайта</div></div></div>';

$mail = new PHPMailer(true);
$mailSent = false;
$mailError = '';
try {
    $mail->isSMTP();
    $mail->Host = (string)($config['smtp_host'] ?? 'smtp.timeweb.ru');
    $mail->SMTPAuth = true;
    $mail->Username = (string)$config['smtp_username'];
    $mail->Password = (string)$config['smtp_password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->setFrom($mail->Username, 'BARIBAL — заявки с сайта');
    $mail->addAddress((string)$config['recipient']);
    $mail->Subject = $leadNumber !== '' ? 'Заявка ' . $leadNumber . ' · BARIBAL' : 'Новая заявка BARIBAL · требуется проверить базу';
    $mail->isHTML(true);
    $mail->Body = $htmlBody;
    $mail->AltBody = $plainBody;
    $mail->send();
    $mailSent = true;
} catch (Throwable $error) {
    $mailError = get_class($error);
    error_log('BARIBAL lead delivery failed (' . $mailError . ').');
}

if ($database instanceof PDO && is_array($storedLead)) {
    try {
        baribalSetLeadEmailStatus($database, (int)$storedLead['id'], $mailSent ? 'sent' : 'failed', $mailError);
    } catch (Throwable $error) {
        error_log('BARIBAL lead email status update failed (' . get_class($error) . ').');
    }
}

if (!$mailSent && !is_array($storedLead)) {
    leadResponse(500, ['success' => false, 'message' => 'Не удалось принять заявку. Попробуйте ещё раз или позвоните нам.']);
}

leadResponse(200, [
    'success' => true,
    'message' => 'Спасибо! Заявка принята. Мы свяжемся с вами.',
]);
