<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');

function reviewResponse(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function reviewCleanup(array $paths): void
{
    foreach ($paths as $path) {
        if (is_string($path) && is_file($path)) @unlink($path);
    }
}

function reviewText($value, int $max): string
{
    if (!is_string($value)) return '';
    $value = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '');
    return function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    reviewResponse(405, ['success' => false, 'message' => 'Метод не поддерживается.']);
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 7 * 1024 * 1024) {
    reviewResponse(413, ['success' => false, 'message' => 'Общий размер фотографий не должен превышать 6 МБ.']);
}
$host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
$origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origin !== '') {
    $originHost = strtolower((string)parse_url($origin, PHP_URL_HOST));
    if ($originHost === '' || $originHost !== preg_replace('/:\d+$/', '', $host)) {
        reviewResponse(403, ['success' => false, 'message' => 'Запрос отклонён.']);
    }
}
if (strtolower((string)($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '')) === 'cross-site') {
    reviewResponse(403, ['success' => false, 'message' => 'Запрос отклонён.']);
}
if (!empty($_POST['website'])) {
    reviewResponse(200, ['success' => true, 'message' => 'Спасибо!']);
}

$name = reviewText($_POST['name'] ?? '', 100);
$car = reviewText($_POST['car'] ?? '', 150);
$review = reviewText($_POST['review'] ?? '', 3000);
if (function_exists('mb_strlen')) {
    $nameLength = mb_strlen($name, 'UTF-8');
    $reviewLength = mb_strlen($review, 'UTF-8');
} else {
    $nameLength = strlen($name);
    $reviewLength = strlen($review);
}
if ($nameLength < 2 || $car === '' || $reviewLength < 15) {
    reviewResponse(422, ['success' => false, 'message' => 'Укажите имя, автомобиль и отзыв не короче 15 символов.']);
}

$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$ratePath = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'baribal-review-' . hash('sha256', $ip) . '.txt';
$rate = @fopen($ratePath, 'c+');
if ($rate !== false) {
    if (flock($rate, LOCK_EX)) {
        $last = (int)trim((string)stream_get_contents($rate));
        if ($last > 0 && time() - $last < 60) {
            flock($rate, LOCK_UN);
            fclose($rate);
            reviewResponse(429, ['success' => false, 'message' => 'Пожалуйста, подождите минуту перед повторной отправкой.']);
        }
        ftruncate($rate, 0);
        rewind($rate);
        fwrite($rate, (string)time());
        fflush($rate);
        flock($rate, LOCK_UN);
    }
    fclose($rate);
}

$photoNames = [];
$storedPaths = [];
$photoField = $_FILES['photos'] ?? null;
if (is_array($photoField) && isset($photoField['name']) && is_array($photoField['name'])) {
    $fileCount = count($photoField['name']);
    if ($fileCount > 3) reviewResponse(422, ['success' => false, 'message' => 'Можно приложить не более трёх фотографий.']);
    $storage = dirname(__DIR__, 2) . '/baribal-review-storage';
    if ($fileCount > 0 && !is_dir($storage) && !@mkdir($storage, 0700, true) && !is_dir($storage)) {
        reviewResponse(503, ['success' => false, 'message' => 'Загрузка фотографий временно недоступна.']);
    }
    if (is_dir($storage)) @chmod($storage, 0700);
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $extensions = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    for ($i = 0; $i < $fileCount; $i++) {
        $error = (int)($photoField['error'][$i] ?? UPLOAD_ERR_NO_FILE);
        if ($error === UPLOAD_ERR_NO_FILE) continue;
        if ($error !== UPLOAD_ERR_OK) {
            reviewCleanup($storedPaths);
            reviewResponse(422, ['success' => false, 'message' => 'Не удалось загрузить одну из фотографий. Проверьте размер файла.']);
        }
        $tmp = (string)($photoField['tmp_name'][$i] ?? '');
        $size = (int)($photoField['size'][$i] ?? 0);
        if ($size < 1 || $size > 2 * 1024 * 1024 || !is_uploaded_file($tmp)) {
            reviewCleanup($storedPaths);
            reviewResponse(422, ['success' => false, 'message' => 'Каждая фотография должна быть не больше 2 МБ.']);
        }
        $mime = $finfo->file($tmp);
        if (!is_string($mime) || !isset($extensions[$mime])) {
            reviewCleanup($storedPaths);
            reviewResponse(422, ['success' => false, 'message' => 'Поддерживаются только JPG, PNG и WebP.']);
        }
        $imageInfo = @getimagesize($tmp);
        if (!is_array($imageInfo) || ($imageInfo['mime'] ?? '') !== $mime
            || (int)$imageInfo[0] < 1 || (int)$imageInfo[1] < 1
            || (int)$imageInfo[0] > 8000 || (int)$imageInfo[1] > 8000
            || (int)$imageInfo[0] * (int)$imageInfo[1] > 40000000) {
            reviewCleanup($storedPaths);
            reviewResponse(422, ['success' => false, 'message' => 'Одна из фотографий повреждена или имеет неподдерживаемый размер.']);
        }
        $filename = bin2hex(random_bytes(20)) . '.' . $extensions[$mime];
        $destination = $storage . DIRECTORY_SEPARATOR . $filename;
        if (!move_uploaded_file($tmp, $destination)) {
            foreach ($storedPaths as $oldPath) @unlink($oldPath);
            reviewResponse(503, ['success' => false, 'message' => 'Не удалось сохранить фотографии. Попробуйте ещё раз.']);
        }
        @chmod($destination, 0600);
        $photoNames[] = $filename;
        $storedPaths[] = $destination;
    }
}

$configPath = dirname(__DIR__, 2) . '/baribal-private/baribal-mail.json';
$storePath = dirname(__DIR__) . '/lib/lead-store.php';
try {
    if (!is_file($configPath) || !is_readable($configPath) || !is_file($storePath)) {
        throw new RuntimeException('Review storage is not configured.');
    }
    $config = json_decode((string)file_get_contents($configPath), true, 512, JSON_THROW_ON_ERROR);
    require_once $storePath;
    $pdo = baribalLeadDatabase($config);
    $insert = $pdo->prepare(
        "INSERT INTO baribal_reviews (status, author_name, car, review_text, photo_files)
         VALUES ('pending', :name, :car, :review, :photos)"
    );
    $insert->execute([
        'name' => $name,
        'car' => $car,
        'review' => $review,
        'photos' => $photoNames ? json_encode($photoNames, JSON_THROW_ON_ERROR) : null,
    ]);
} catch (Throwable $error) {
    foreach ($storedPaths as $oldPath) @unlink($oldPath);
    error_log('BARIBAL review submission failed (' . get_class($error) . ').');
    reviewResponse(503, ['success' => false, 'message' => 'Не удалось принять отзыв. Попробуйте позже или позвоните нам.']);
}

reviewResponse(200, [
    'success' => true,
    'message' => 'Спасибо! Отзыв отправлен на проверку. После модерации он появится на сайте.',
]);
