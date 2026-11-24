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
    exit('Раздел рейтингов временно недоступен.');
}
$config = json_decode((string)file_get_contents($configPath), true);
$user = (string)($_SERVER['PHP_AUTH_USER'] ?? '');
$password = (string)($_SERVER['PHP_AUTH_PW'] ?? '');
if ($user === '' && isset($_SERVER['HTTP_AUTHORIZATION']) && preg_match('/^Basic\\s+(.+)$/i', (string)$_SERVER['HTTP_AUTHORIZATION'], $match)) {
    $decoded = base64_decode($match[1], true);
    if (is_string($decoded) && str_contains($decoded, ':')) [$user, $password] = explode(':', $decoded, 2);
}
if (!is_array($config) || $user !== 'baribal' || !password_verify($password, (string)($config['admin_password_hash'] ?? ''))) {
    header('WWW-Authenticate: Basic realm="BARIBAL — рейтинги"');
    http_response_code(401);
    exit('Требуется авторизация.');
}
require_once $storePath;

function ratingHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$providers = [
    'google' => ['name' => 'Google Maps', 'detail' => 'Официальный Places API: рейтинг и число оценок. Нужны API key и Place ID.'],
    'yandex' => ['name' => 'Яндекс Карты', 'detail' => 'Официальный виджет/инструменты Яндекс Бизнеса. Отдельно проверяем возможность серверного API для истории.'],
    '2gis' => ['name' => '2ГИС', 'detail' => 'Официальный виджет рейтинга из кабинета компании. Публичный API не отдаёт рейтинг; парсинг не используем.'],
];

try {
    $pdo = baribalLeadDatabase($config);
    $latest = [];
    foreach ($pdo->query(
        "SELECT s.* FROM baribal_rating_snapshots s
         INNER JOIN (
             SELECT provider, MAX(checked_at) AS latest_at
             FROM baribal_rating_snapshots GROUP BY provider
         ) x ON x.provider = s.provider AND x.latest_at = s.checked_at
         ORDER BY s.provider"
    )->fetchAll() as $row) {
        $latest[(string)$row['provider']] = $row;
    }
    $history = $pdo->query(
        "SELECT provider, rating, review_count, checked_at, source, status
         FROM baribal_rating_snapshots
         ORDER BY checked_at DESC LIMIT 60"
    )->fetchAll();
} catch (Throwable $error) {
    error_log('BARIBAL ratings admin failed (' . get_class($error) . ').');
    http_response_code(503);
    exit('Не удалось открыть историю рейтингов. Проверьте подключение к базе.');
}
?><!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>BARIBAL — рейтинги</title>
<style>
:root{color-scheme:light;--ink:#202124;--muted:#687078;--line:#e4e7ea;--paper:#fff;--soft:#f4f6f7;--accent:#b77b36;--green:#21643a;--amber:#8a5a16}
*{box-sizing:border-box}body{margin:0;background:#f1f3f4;color:var(--ink);font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}
main{max-width:1100px;margin:0 auto;padding:28px 20px 56px}.eyebrow{color:var(--accent);font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}h1{font-size:30px;line-height:1.15;margin:5px 0 8px}.muted{color:var(--muted)}
.admin-nav{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.admin-nav a{display:inline-flex;align-items:center;gap:8px;padding:9px 13px;border:1px solid var(--line);border-radius:999px;background:#fff;color:#41484e;text-decoration:none;font-weight:750;font-size:13px}.admin-nav a.active{background:#25282b;border-color:#25282b;color:#fff}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:22px 0}.card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px;min-width:0}.card h2{font-size:17px;margin:0 0 8px}.score{font-size:30px;font-weight:800;letter-spacing:-1px;margin:10px 0 0}.count{font-size:13px;color:var(--muted)}.status{display:inline-flex;border-radius:999px;padding:5px 9px;background:#fff4df;color:var(--amber);font-size:11px;font-weight:800}.ok{background:#e8f4eb;color:var(--green)}.panel{background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px;margin-top:16px}.panel h2{font-size:18px;margin:0 0 10px}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;min-width:580px}th,td{text-align:left;padding:11px 9px;border-bottom:1px solid #edf0f1;font-size:13px}th{color:var(--muted);font-weight:700}tr:last-child td{border-bottom:0}.empty{padding:22px 12px;text-align:center;color:var(--muted);background:var(--soft);border-radius:10px}.note{font-size:13px;color:var(--muted);margin:8px 0 0}.callout{border-left:3px solid var(--accent);padding:10px 13px;background:#faf7f2;border-radius:0 9px 9px 0;font-size:13px;margin-top:14px}
@media(max-width:760px){main{padding:22px 14px 40px}.grid{grid-template-columns:1fr}.card{padding:16px}h1{font-size:27px}}
</style>
</head>
<body><main>
<div class="eyebrow">BARIBAL · управление</div>
<h1>Рейтинги и репутация</h1>
<p class="muted">Мониторинг оценок на независимых площадках. Здесь будет сохраняться история изменений, чтобы видеть не только текущий балл, но и динамику.</p>
<nav class="admin-nav" aria-label="Разделы админки">
<a href="/admin/leads.php">Заявки</a><a href="/admin/reviews.php">Отзывы</a><a class="active" href="/admin/ratings.php">Рейтинги</a>
</nav>
<section class="grid" aria-label="Рейтинги площадок">
<?php foreach ($providers as $key => $provider): $row = $latest[$key] ?? null; ?>
<article class="card">
<h2><?= ratingHtml($provider['name']) ?></h2>
<?php if ($row && $row['status'] === 'ok' && $row['rating'] !== null): ?>
<div class="score"><?= number_format((float)$row['rating'], 1, ',', ' ') ?> / 5</div>
<div class="count"><?= $row['review_count'] !== null ? number_format((int)$row['review_count'], 0, ',', ' ') . ' оценок/отзывов' : 'Количество пока не получено' ?></div>
<p class="note">Проверено: <?= ratingHtml((string)$row['checked_at']) ?></p>
<span class="status ok">Данные получены</span>
<?php else: ?>
<div class="score">—</div><div class="count">Нет подтверждённых данных</div>
<p class="note"><?= ratingHtml($provider['detail']) ?></p>
<span class="status">Ожидает подключения</span>
<?php endif; ?>
</article>
<?php endforeach; ?>
</section>
<section class="panel">
<h2>История изменений</h2>
<p class="note">Снимки рейтинга будут добавляться автоматически после подключения официальных источников. История хранится отдельно по каждой площадке.</p>
<?php if (!$history): ?><div class="empty" style="margin-top:14px">Пока нет сохранённых измерений. Это нормально: автоматические источники ещё не подключены.</div>
<?php else: ?><div class="table-wrap"><table><thead><tr><th>Площадка</th><th>Рейтинг</th><th>Количество</th><th>Дата проверки</th><th>Источник</th></tr></thead><tbody>
<?php foreach ($history as $item): ?><tr><td><?= ratingHtml($providers[(string)$item['provider']]['name'] ?? (string)$item['provider']) ?></td><td><?= $item['rating'] !== null ? number_format((float)$item['rating'], 1, ',', ' ') : '—' ?></td><td><?= $item['review_count'] !== null ? number_format((int)$item['review_count'], 0, ',', ' ') : '—' ?></td><td><?= ratingHtml((string)$item['checked_at']) ?></td><td><?= ratingHtml((string)$item['source']) ?></td></tr><?php endforeach; ?>
</tbody></table></div><?php endif; ?>
</section>
<section class="panel">
<h2>Что уже выяснили по подключению</h2>
<p><strong>Google Maps.</strong> Places API официально возвращает поля <code>rating</code> и <code>userRatingCount</code>. Нужны ключ Google Cloud с включённым Places API и идентификатор места.</p>
<p><strong>Яндекс Карты.</strong> Рейтинг обновляется ежедневно, но виджет — не то же самое, что серверный API для собственной истории. Подключим только документированный источник, без чтения разметки страницы.</p>
<p><strong>2ГИС.</strong> В личном кабинете доступен официальный виджет, показывающий текущий рейтинг и число отзывов. Это надёжный вариант отображения на сайте. Для отдельного серверного журнала запросим у 2ГИС официальный доступ/API; публичный API не выдаёт рейтинг компании.</p>
<div class="callout">Важно: пока источник не подключён, система не показывает выдуманные оценки и не создаёт фиктивную историю. Как только появятся разрешённые ключи/идентификаторы, добавим ежедневную автоматическую проверку.</div>
</section>
</main></body></html>
