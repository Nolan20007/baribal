<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

$configPath = dirname(__DIR__, 2) . '/baribal-private/baribal-mail.php';
$autoloadPath = dirname(__DIR__) . '/vendor/autoload.php';
$configFound = @is_file($configPath);
$autoloadFound = @is_file($autoloadPath);
$configReadable = $configFound && @is_readable($configPath);
$configValid = false;

if ($configReadable && $autoloadFound) {
    try {
        $mailConfig = require $configPath;
        $configValid = is_array($mailConfig)
            && !empty($mailConfig['smtp_username'])
            && !empty($mailConfig['smtp_password'])
            && !empty($mailConfig['recipient']);
    } catch (Throwable $error) {
        $configValid = false;
    }
}

$configReady = $configFound && $autoloadFound && $configReadable && $configValid;
http_response_code($configReady ? 200 : 503);
echo json_encode([
    'ok' => $configReady,
    'php' => PHP_VERSION,
    'mail_configured' => $configReady,
    'diagnostics' => [
        'private_config_found' => $configFound,
        'private_config_readable' => $configReadable,
        'mailer_autoload_found' => $autoloadFound,
        'private_config_valid' => $configValid,
        'open_basedir_enabled' => (string)ini_get('open_basedir') !== '',
    ],
], JSON_UNESCAPED_SLASHES);
