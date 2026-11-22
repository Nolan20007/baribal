<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

$configReady = is_file(__DIR__ . '/private/config.php')
    && is_file(dirname(__DIR__) . '/vendor/autoload.php');

http_response_code($configReady ? 200 : 503);
echo json_encode([
    'ok' => $configReady,
    'php' => PHP_VERSION,
    'mail_configured' => $configReady,
], JSON_UNESCAPED_SLASHES);
