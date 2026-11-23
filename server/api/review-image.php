<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=3600');
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$index = filter_input(INPUT_GET, 'photo', FILTER_VALIDATE_INT);
if (!$id || $id < 1 || $index === false || $index === null || $index < 0 || $index > 2) {
    http_response_code(404);
    exit;
}
$configPath = dirname(__DIR__, 2) . '/baribal-private/baribal-mail.json';
$storePath = dirname(__DIR__) . '/lib/lead-store.php';
try {
    $config = json_decode((string)file_get_contents($configPath), true, 512, JSON_THROW_ON_ERROR);
    require_once $storePath;
    $pdo = baribalLeadDatabase($config);
    $query = $pdo->prepare("SELECT photo_files FROM baribal_reviews WHERE id = :id AND status = 'approved' LIMIT 1");
    $query->execute(['id' => $id]);
    $row = $query->fetch();
    $files = $row ? json_decode((string)$row['photo_files'], true) : [];
    $filename = is_array($files) && isset($files[$index]) && is_string($files[$index]) ? $files[$index] : '';
    if (!preg_match('/^[a-f0-9]{40}\.(jpg|png|webp)$/', $filename)) {
        http_response_code(404);
        exit;
    }
    $path = dirname(__DIR__, 2) . '/baribal-review-storage/' . $filename;
    if (!is_file($path) || !is_readable($path)) {
        http_response_code(404);
        exit;
    }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($path);
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], true)) {
        http_response_code(404);
        exit;
    }
    header('Content-Type: ' . $mime);
    header('Content-Length: ' . (string)filesize($path));
    readfile($path);
} catch (Throwable $error) {
    error_log('BARIBAL review image request failed (' . get_class($error) . ').');
    http_response_code(404);
}
