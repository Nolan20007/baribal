<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=120');
header('X-Content-Type-Options: nosniff');

$configPath = dirname(__DIR__, 2) . '/baribal-private/baribal-mail.json';
$storePath = dirname(__DIR__) . '/lib/lead-store.php';
try {
    if (!is_file($configPath) || !is_readable($configPath)) throw new RuntimeException('Configuration unavailable.');
    $config = json_decode((string)file_get_contents($configPath), true, 512, JSON_THROW_ON_ERROR);
    require_once $storePath;
    $pdo = baribalLeadDatabase($config);
    $statement = $pdo->query(
        "SELECT id, created_at, author_name, car, review_text, photo_files
         FROM baribal_reviews WHERE status = 'approved' ORDER BY reviewed_at DESC, id DESC LIMIT 100"
    );
    $items = [];
    while ($row = $statement->fetch()) {
        $files = json_decode((string)($row['photo_files'] ?? '[]'), true);
        if (!is_array($files)) $files = [];
        $items[] = [
            'id' => (int)$row['id'],
            'date' => (string)$row['created_at'],
            'name' => (string)$row['author_name'],
            'car' => (string)$row['car'],
            'text' => (string)$row['review_text'],
            'photos' => array_map(
                static fn($index) => '/api/review-image.php?id=' . (int)$row['id'] . '&photo=' . (int)$index,
                array_keys($files)
            ),
        ];
    }
    echo json_encode(['success' => true, 'reviews' => $items], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $error) {
    error_log('BARIBAL public reviews API failed (' . get_class($error) . ').');
    http_response_code(503);
    echo json_encode(['success' => false, 'reviews' => []], JSON_UNESCAPED_UNICODE);
}
