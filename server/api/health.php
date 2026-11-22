<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

$configPath = dirname(__DIR__, 2) . '/baribal-private/baribal-mail.php';
$autoloadPath = dirname(__DIR__) . '/vendor/autoload.php';
$configFound = @is_file($configPath);
$autoloadFound = @is_file($autoloadPath);
$configReadable = $configFound && @is_readable($configPath);
$configLoaded = false;
$configIsArray = false;
$configKeys = [];
$fieldStatus = [
    'smtp_username_nonempty' => false,
    'smtp_password_nonempty' => false,
    'recipient_nonempty' => false,
];
$loadError = null;

if ($configReadable && $autoloadFound) {
    try {
        $mailConfig = require $configPath;
        $configLoaded = true;
        $configIsArray = is_array($mailConfig);
        if ($configIsArray) {
            $configKeys = array_values(array_filter(array_map(
                static fn($key) => is_string($key) ? $key : gettype($key),
                array_keys($mailConfig)
            ), static fn($key) => $key !== ''));
            foreach ($fieldStatus as $key => $_) {
                $configKey = substr($key, 0, -9);
                $fieldStatus[$key] = isset($mailConfig[$configKey])
                    && is_scalar($mailConfig[$configKey])
                    && trim((string)$mailConfig[$configKey]) !== '';
            }
        }
    } catch (Throwable $error) {
        $loadError = get_class($error);
    }
}

$configValid = $configLoaded && $configIsArray
    && $fieldStatus['smtp_username_nonempty']
    && $fieldStatus['smtp_password_nonempty']
    && $fieldStatus['recipient_nonempty'];
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
        'config_loaded' => $configLoaded,
        'config_is_array' => $configIsArray,
        'config_keys' => $configKeys,
        'required_fields' => $fieldStatus,
        'load_error' => $loadError,
        'open_basedir_enabled' => (string)ini_get('open_basedir') !== '',
    ],
], JSON_UNESCAPED_SLASHES);
