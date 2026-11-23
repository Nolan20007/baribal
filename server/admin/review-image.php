<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Cache-Control: no-store, max-age=0');
header('X-Robots-Tag: noindex, nofollow, noarchive');

$configPath = dirname(__DIR__, 2) . '/baribal-private/baribal-mail.json';
$storePath = dirname(__DIR__) . '/lib/lead-store.php';
if (!is_file($configPath) || !is_readable($configPath)) { http_response_code(503); exit; }
$config = json_decode((string)file_get_contents($configPath), true);
$user = (string)($_SERVER['PHP_AUTH_USER'] ?? '');
$password = (string)($_SERVER['PHP_AUTH_PW'] ?? '');
if ($user === '' && isset($_SERVER['HTTP_AUTHORIZATION']) && preg_match('/^Basic\\s+(.+)$/i', (string)$_SERVER['HTTP_AUTHORIZATION'], $match)) {
    $decoded = base64_decode($match[1], true);
    if (is_string($decoded) && str_contains($decoded, ':')) [$user, $password] = explode(':', $decoded, 2);
}
if (!is_array($config) || $user !== 'baribal' || !password_verify($password, (string)($config['admin_password_hash'] ?? ''))) {
    header('WWW-Authenticate: Basic realm="BARIBAL — модерация отзывов"');
    http_response_code(401);
    exit('Требуется авторизация.');
}
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$index = filter_input(INPUT_GET, 'photo', FILTER_VALIDATE_INT);
if (!$id || $id < 1 || $index === false || $index === null || $index < 0 || $index > 2) { http_response_code(404); exit; }
try {
    require_once $storePath;
    $pdo = baribalLeadDatabase($config);
    $query = $pdo->prepare('SELECT photo_files FROM baribal_reviews WHERE id = :id LIMIT 1');
    $query->execute(['id' => $id]);
    $row = $query->fetch();
    $files = $row ? json_decode((string)$row['photo_files'], true) : [];
    $filename = is_array($files) && isset($files[$index]) && is_string($files[$index]) ? $files[$index] : '';
    if (!preg_match('/^[a-f0-9]{40}\.(jpg|png|webp)$/', $filename)) { http_response_code(404); exit; }
    $path = dirname(__DIR__, 2) . '/baribal-review-storage/' . $filename;
    if (!is_file($path) || !is_readable($path)) { http_response_code(404); exit; }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($path);
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], true)) { http_response_code(404); exit; }
    header('Content-Type: ' . $mime);
    header('Content-Length: ' . (string)filesize($path));
    readfile($path);
} catch (Throwable $error) {
    error_log('BARIBAL private review image failed (' . get_class($error) . ').');
    http_response_code(404);
}
