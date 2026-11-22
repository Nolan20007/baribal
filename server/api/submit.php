<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

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
    return mb_substr($value, 0, $maxLength, 'UTF-8');
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
    // Silently accept honeypot submissions without sending mail.
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
$methods = $_POST['contact_method'] ?? [];
if (!is_array($methods)) {
    $methods = [$methods];
}
$allowedMethods = ['phone', 'max', 'telegram', 'other'];
$methods = array_values(array_unique(array_filter(
    array_map(static fn($item) => is_string($item) ? $item : '', $methods),
    static fn($item) => in_array($item, $allowedMethods, true)
)));
if (!$methods) {
    leadResponse(422, ['success' => false, 'message' => 'Выберите способ связи.']);
}
if (in_array('other', $methods, true) && $contactOther === '') {
    leadResponse(422, ['success' => false, 'message' => 'Укажите удобный способ связи.']);
}

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

$configPath = __DIR__ . '/private/config.php';
$autoloadPath = dirname(__DIR__) . '/vendor/autoload.php';
if (!is_file($configPath) || !is_file($autoloadPath)) {
    error_log('BARIBAL lead delivery is not configured.');
    leadResponse(503, ['success' => false, 'message' => 'Отправка заявок временно недоступна. Позвоните нам, пожалуйста.']);
}

$config = require $configPath;
if (!is_array($config) || empty($config['smtp_username']) || empty($config['smtp_password']) || empty($config['recipient'])) {
    error_log('BARIBAL lead delivery configuration is incomplete.');
    leadResponse(503, ['success' => false, 'message' => 'Отправка заявок временно недоступна. Позвоните нам, пожалуйста.']);
}

require $autoloadPath;

$methodLabels = [
    'phone' => 'Телефон',
    'max' => 'MAX',
    'telegram' => 'Telegram',
    'other' => 'Другой способ',
];
$methodText = array_map(static fn($method) => $methodLabels[$method], $methods);
$refererPath = '';
if (!empty($_SERVER['HTTP_REFERER'])) {
    $refererPath = (string)(parse_url((string)$_SERVER['HTTP_REFERER'], PHP_URL_PATH) ?? '');
}
$refererPath = leadText($refererPath, 200);

$lines = [
    'Новая заявка с сайта BARIBAL',
    '',
    'Имя: ' . ($name !== '' ? $name : 'не указано'),
    'Телефон: ' . $phone,
    'Способ связи: ' . implode(', ', $methodText),
    'Другой способ связи: ' . ($contactOther !== '' ? $contactOther : 'не указан'),
    'Автомобиль: ' . ($car !== '' ? $car : 'не указан'),
    'Услуга: ' . ($service !== '' ? $service : 'не указана'),
    'Выбранные услуги: ' . ($selectedServices !== '' ? $selectedServices : 'не указаны'),
    'Страница: ' . ($refererPath !== '' ? $refererPath : 'не определена'),
];
$plainBody = implode("\n", $lines);
$htmlBody = '<h2>Новая заявка с сайта BARIBAL</h2><dl>';
foreach ([
    'Имя' => $name !== '' ? $name : 'не указано',
    'Телефон' => $phone,
    'Способ связи' => implode(', ', $methodText),
    'Другой способ связи' => $contactOther !== '' ? $contactOther : 'не указан',
    'Автомобиль' => $car !== '' ? $car : 'не указан',
    'Услуга' => $service !== '' ? $service : 'не указана',
    'Выбранные услуги' => $selectedServices !== '' ? $selectedServices : 'не указаны',
    'Страница' => $refererPath !== '' ? $refererPath : 'не определена',
] as $label => $value) {
    $htmlBody .= '<dt><strong>' . htmlspecialchars($label, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
        . '</strong></dt><dd>' . nl2br(htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')) . '</dd>';
}
$htmlBody .= '</dl>';

$mail = new PHPMailer(true);
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
    $mail->Subject = 'Новая заявка с сайта BARIBAL';
    $mail->isHTML(true);
    $mail->Body = $htmlBody;
    $mail->AltBody = $plainBody;
    $mail->send();
    leadResponse(200, ['success' => true, 'message' => 'Заявка отправлена. Мы свяжемся с вами.']);
} catch (Throwable $error) {
    error_log('BARIBAL lead delivery failed (' . get_class($error) . ').');
    leadResponse(500, ['success' => false, 'message' => 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.']);
}
