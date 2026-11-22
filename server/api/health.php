<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

$configPath = dirname(__DIR__, 2) . '/baribal-private/baribal-mail.php';
$autoloadPath = dirname(__DIR__) . '/vendor/autoload.php';
$configReady = false;
if (is_file($configPath) && is_file($autoloadPath)) {
    try {
        $mailConfig = require $configPath;
        $configReady = is_array($mailConfig)
            && !empty($mailConfig['smtp_username'])
            && !empty($mailConfig['smtp_password'])
            && !empty($mailConfig['recipient']);
    } catch (Throwable $error) {
        $configReady = false;
    }
}

http_response_code($configReady ? 200 : 503);
echo json_encode([
    'ok' => $configReady,
    'php' => PHP_VERSION,
    'mail_configured' => $configReady,
], JSON_UNESCAPED_SLASHES);
