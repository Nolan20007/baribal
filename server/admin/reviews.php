<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex, nofollow, noarchive');
header('Cache-Control: no-store, max-age=0');

$configPath = dirname(__DIR__, 2) . '/baribal-private/baribal-mail.json';
$storePath = dirname(__DIR__) . '/lib/lead-store.php';
if (!is_file($configPath) || !is_readable($configPath) || !is_file($storePath)) {
    http_response_code(503);
    exit('Модерация отзывов временно недоступна.');
}
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
require $storePath;
session_set_cookie_params([
    'httponly' => true,
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'samesite' => 'Strict',
]);
session_start();
if (empty($_SESSION['review_csrf'])) $_SESSION['review_csrf'] = bin2hex(random_bytes(32));

function reviewAdminHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

try {
    $pdo = baribalLeadDatabase($config);
    $filter = (string)($_GET['filter'] ?? 'pending');
    $filters = ['pending' => 'На модерации', 'approved' => 'Опубликованные', 'rejected' => 'Отклонённые', 'all' => 'Все'];
    if (!isset($filters[$filter])) $filter = 'pending';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $token = (string)($_POST['csrf'] ?? '');
        $id = (int)($_POST['review_id'] ?? 0);
        $action = (string)($_POST['action'] ?? '');
        if (!hash_equals((string)$_SESSION['review_csrf'], $token) || $id < 1 || !in_array($action, ['approve', 'reject', 'delete'], true)) {
            http_response_code(400);
            exit('Не удалось проверить запрос. Обновите страницу и повторите действие.');
        }
        if ($action === 'delete') {
            $photoQuery = $pdo->prepare('SELECT photo_files FROM baribal_reviews WHERE id = :id LIMIT 1');
            $photoQuery->execute(['id' => $id]);
            $photoRow = $photoQuery->fetch();
            if ($photoRow) {
                $delete = $pdo->prepare('DELETE FROM baribal_reviews WHERE id = :id');
                $delete->execute(['id' => $id]);
                $photoFiles = json_decode((string)($photoRow['photo_files'] ?? '[]'), true);
                $storagePath = dirname(__DIR__, 2) . '/baribal-review-storage/';
                if (is_array($photoFiles)) {
                    foreach ($photoFiles as $filename) {
                        if (is_string($filename)
                            && preg_match('/^[a-f0-9]{40}\\.(jpg|png|webp)$/', $filename)) {
                            $photoPath = $storagePath . $filename;
                            if (is_file($photoPath)) {
                                @unlink($photoPath);
                            }
                        }
                    }
                }
            }
        } else {
            $newStatus = $action === 'approve' ? 'approved' : 'rejected';
            $update = $pdo->prepare('UPDATE baribal_reviews SET status = :status, reviewed_at = NOW() WHERE id = :id');
            $update->execute(['status' => $newStatus, 'id' => $id]);
        }
        header('Location: /admin/reviews.php?filter=' . rawurlencode($filter), true, 303);
        exit;
    }

    $counts = ['pending' => 0, 'approved' => 0, 'rejected' => 0];
    foreach ($pdo->query('SELECT status, COUNT(*) AS amount FROM baribal_reviews GROUP BY status')->fetchAll() as $row) {
        if (isset($counts[$row['status']])) $counts[$row['status']] = (int)$row['amount'];
    }
    $sql = 'SELECT id, created_at, reviewed_at, status, author_name, car, review_text, photo_files FROM baribal_reviews';
    if ($filter !== 'all') {
        $statement = $pdo->prepare($sql . ' WHERE status = :status ORDER BY created_at DESC LIMIT 200');
        $statement->execute(['status' => $filter]);
    } else {
        $statement = $pdo->query($sql . ' ORDER BY created_at DESC LIMIT 200');
    }
    $reviews = $statement->fetchAll();
} catch (Throwable $error) {
    error_log('BARIBAL review moderation failed (' . get_class($error) . ').');
    http_response_code(503);
    exit('Не удалось подключиться к базе отзывов.');
}
?><!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Отзывы BARIBAL — модерация</title>
<style>
:root{color-scheme:light;--ink:#202124;--muted:#687078;--line:#e4e7ea;--paper:#fff;--soft:#f4f6f7;--accent:#b77b36;--red:#b53c3c;--green:#21643a}
*{box-sizing:border-box}body{margin:0;background:#f1f3f4;color:var(--ink);font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}
main{max-width:1100px;margin:0 auto;padding:28px 20px 56px}.top{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:18px}
.eyebrow{color:var(--accent);font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}h1{font-size:30px;line-height:1.15;margin:5px 0}.muted{color:var(--muted)}
.admin-nav{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 18px}.admin-nav a{display:inline-flex;align-items:center;gap:8px;padding:9px 13px;border:1px solid var(--line);border-radius:999px;background:#fff;color:#41484e;text-decoration:none;font-weight:750;font-size:13px}.admin-nav a.active{background:#25282b;border-color:#25282b;color:#fff}.admin-nav b{display:inline-grid;place-items:center;min-width:22px;height:22px;padding:0 6px;border-radius:99px;background:#f9dddd;color:#a33a3a;font-size:11px}
.filters{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 20px}.filter{padding:8px 12px;border:1px solid var(--line);border-radius:999px;background:#fff;color:#41484e;text-decoration:none;font-size:13px;font-weight:700}.filter.active{background:#25282b;color:#fff;border-color:#25282b}.filter.pending:not(.active){border-color:#efc3c3;background:#fff5f5;color:#a33a3a}
.list{display:grid;gap:14px}.review{background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px 20px;box-shadow:0 4px 18px #10182008}.review.pending{background:#fffafa;border-color:#edc7c7;box-shadow:inset 3px 0 0 #d96b6b,0 4px 18px #10182008}.head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.name{font-weight:800;font-size:18px}.tag{display:inline-block;padding:4px 9px;border-radius:99px;background:#fff0d9;color:#875313;font-size:12px;font-weight:750}.tag.approved{background:#e8f5ed;color:var(--green)}.tag.rejected{background:#f0eeee;color:#62666a}.review-text{white-space:pre-wrap;overflow-wrap:anywhere;margin:16px 0;color:#333}.meta{color:var(--muted);font-size:12px;margin-top:3px}.photos{display:flex;gap:10px;flex-wrap:wrap;margin:12px 0}.photos img{width:150px;height:112px;object-fit:cover;border-radius:9px;border:1px solid var(--line);background:#eee}.actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:14px;padding-top:13px;border-top:1px solid var(--line)}.actions form{margin:0}.actions button{border:0;border-radius:9px;padding:10px 16px;font:inherit;font-weight:750;cursor:pointer}.approve{background:#21643a;color:#fff}.reject{background:#fff0f0;color:#a33a3a;border:1px solid #efc3c3!important}.empty{padding:36px;text-align:center;color:var(--muted);background:#fff;border:1px solid var(--line);border-radius:14px}
@media(max-width:640px){main{padding:20px 12px 40px}.top{display:block}h1{font-size:25px}.review{padding:15px}.head{display:block}.photos img{width:calc(50% - 5px);height:120px}}
</style>
</head>
<body><main>
<header class="top"><div><div class="eyebrow">BARIBAL · ВНУТРЕННИЙ ЖУРНАЛ</div><h1>Модерация отзывов</h1><div class="muted">На сайте публикуются только одобренные отзывы</div></div><div class="muted">На проверке: <strong><?= number_format($counts['pending'], 0, ',', ' ') ?></strong></div></header>
<nav class="admin-nav" aria-label="Разделы админки">
<a href="/admin/leads.php">Заявки</a>
<a class="active" href="/admin/reviews.php">Отзывы<?php if ($counts['pending'] > 0): ?><b><?= number_format($counts['pending'], 0, ',', ' ') ?></b><?php endif; ?></a>
<a href="/admin/ratings.php">Рейтинги</a>
</nav>
<nav class="filters" aria-label="Фильтр отзывов">
<?php foreach ($filters as $key => $label): ?>
<a class="filter<?= $filter === $key ? ' active' : '' ?><?= $key === 'pending' ? ' pending' : '' ?>" href="?filter=<?= reviewAdminHtml($key) ?>"><?= reviewAdminHtml($label) ?> · <?= number_format($key === 'all' ? array_sum($counts) : $counts[$key], 0, ',', ' ') ?></a>
<?php endforeach; ?>
</nav>
<section class="list" aria-label="Отзывы">
<?php if (!$reviews): ?><div class="empty">В этом разделе пока нет отзывов.</div><?php endif; ?>
<?php foreach ($reviews as $review):
$photos = json_decode((string)($review['photo_files'] ?? '[]'), true);
if (!is_array($photos)) $photos = [];
$status = (string)$review['status'];
$statusLabel = ['pending' => 'На модерации', 'approved' => 'Опубликован', 'rejected' => 'Отклонён'][$status] ?? 'Неизвестно';
?>
<article class="review <?= reviewAdminHtml($status) ?>">
<div class="head"><div><div class="name"><?= reviewAdminHtml((string)$review['author_name']) ?></div><div class="meta"><?= reviewAdminHtml((string)$review['car']) ?> · <?= reviewAdminHtml((string)$review['created_at']) ?></div></div><span class="tag <?= reviewAdminHtml($status) ?>"><?= reviewAdminHtml($statusLabel) ?></span></div>
<div class="review-text"><?= reviewAdminHtml((string)$review['review_text']) ?></div>
<?php if ($photos): ?><div class="photos" aria-label="Фотографии отзыва"><?php foreach (array_keys($photos) as $photoIndex): ?><a href="/admin/review-image.php?id=<?= (int)$review['id'] ?>&photo=<?= (int)$photoIndex ?>" target="_blank" rel="noopener"><img src="/admin/review-image.php?id=<?= (int)$review['id'] ?>&photo=<?= (int)$photoIndex ?>" alt="Фотография к отзыву" loading="lazy"></a><?php endforeach; ?></div><?php endif; ?>
<div class="actions">
<?php if ($status === 'pending'): ?>
<form method="post"><input type="hidden" name="csrf" value="<?= reviewAdminHtml((string)$_SESSION['review_csrf']) ?>"><input type="hidden" name="review_id" value="<?= (int)$review['id'] ?>"><input type="hidden" name="action" value="approve"><button class="approve" type="submit">Принять и опубликовать</button></form>
<form method="post" onsubmit="return confirm('Отклонить этот отзыв? На сайте он не появится.');"><input type="hidden" name="csrf" value="<?= reviewAdminHtml((string)$_SESSION['review_csrf']) ?>"><input type="hidden" name="review_id" value="<?= (int)$review['id'] ?>"><input type="hidden" name="action" value="reject"><button class="reject" type="submit">Отклонить</button></form>
<?php endif; ?>
<form method="post" onsubmit="return confirm('Удалить отзыв без возможности восстановления? Прикреплённые фотографии тоже будут удалены.');"><input type="hidden" name="csrf" value="<?= reviewAdminHtml((string)$_SESSION['review_csrf']) ?>"><input type="hidden" name="review_id" value="<?= (int)$review['id'] ?>"><input type="hidden" name="action" value="delete"><button class="reject" type="submit">Удалить отзыв</button></form>
</div>
</article>
<?php endforeach; ?>
</section>
</main></body></html>
