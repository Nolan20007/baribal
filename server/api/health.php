<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

$configPath = dirname(__DIR__, 2) . '/baribal-private/baribal-mail.json';
$autoloadPath = dirname(__DIR__) . '/vendor/autoload.php';
$storePath = dirname(__DIR__) . '/lib/lead-store.php';
$configFound = @is_file($configPath);
$configReadable = $configFound && @is_readable($configPath);
$autoloadFound = @is_file($autoloadPath);
$configLoaded = false;
$configIsArray = false;
$configKeys = [];
$fieldStatus = [
    'smtp_username_nonempty' => false,
    'smtp_password_nonempty' => false,
    'recipient_nonempty' => false,
];
$loadError = null;
$mailConfig = [];

if ($configReadable) {
    try {
        $configJson = @file_get_contents($configPath);
        if ($configJson === false) {
            throw new RuntimeException('Private JSON configuration could not be read.');
        }
        $mailConfig = json_decode($configJson, true, 512, JSON_THROW_ON_ERROR);
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
                    && is_string($mailConfig[$configKey])
                    && trim($mailConfig[$configKey]) !== '';
            }
        }
    } catch (Throwable $error) {
        $loadError = get_class($error) . ': ' . substr(preg_replace('/[\r\n\t]+/', ' ', $error->getMessage()) ?? '', 0, 240);
    }
}

$mailConfigured = $configLoaded && $configIsArray
    && $fieldStatus['smtp_username_nonempty']
    && $fieldStatus['smtp_password_nonempty']
    && $fieldStatus['recipient_nonempty']
    && $autoloadFound;

$dbFields = ['db_host', 'db_name', 'db_username', 'db_password'];
$dbConfigured = $configIsArray;
foreach ($dbFields as $key) {
    $dbConfigured = $dbConfigured && isset($mailConfig[$key])
        && is_string($mailConfig[$key]) && trim($mailConfig[$key]) !== '';
}
$pdoMysqlAvailable = extension_loaded('pdo_mysql');
$databaseConnected = false;
$databaseError = null;
if ($dbConfigured && $pdoMysqlAvailable && is_file($storePath)) {
    try {
        require_once $storePath;
        $pdo = baribalLeadDatabase($mailConfig);
        $databaseConnected = true;
    } catch (Throwable $error) {
        $databaseError = get_class($error);
        error_log('BARIBAL health database check failed (' . $databaseError . ').');
    }
}

$adminConfigured = $configIsArray && isset($mailConfig['admin_password_hash'])
    && is_string($mailConfig['admin_password_hash'])
    && trim($mailConfig['admin_password_hash']) !== '';

$ready = $mailConfigured && $dbConfigured && $pdoMysqlAvailable && $databaseConnected && $adminConfigured;
http_response_code($ready ? 200 : 503);
echo json_encode([
    'ok' => $ready,
    'php' => PHP_VERSION,
    'mail_configured' => $mailConfigured,
    'leads_database_configured' => $dbConfigured,
    'leads_database_connected' => $databaseConnected,
    'admin_configured' => $adminConfigured,
    'diagnostics' => [
        'private_config_found' => $configFound,
        'private_config_readable' => $configReadable,
        'private_config_format' => 'json',
        'mailer_autoload_found' => $autoloadFound,
        'config_loaded' => $configLoaded,
        'config_is_array' => $configIsArray,
        'config_keys' => $configKeys,
        'required_mail_fields' => $fieldStatus,
        'pdo_mysql_available' => $pdoMysqlAvailable,
        'database_error_type' => $databaseError,
        'load_error' => $loadError,
        'open_basedir_enabled' => (string)ini_get('open_basedir') !== '',
    ],
], JSON_UNESCAPED_SLASHES);
