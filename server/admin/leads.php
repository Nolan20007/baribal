<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex, nofollow, noarchive');
header('Cache-Control: no-store, max-age=0');

$configPath = dirname(__DIR__, 2) . '/baribal-private/baribal-mail.json';
$autoloadPath = dirname(__DIR__) . '/vendor/autoload.php';
$storePath = dirname(__DIR__) . '/lib/lead-store.php';

if (!is_file($configPath) || !is_readable($configPath) || !is_file($storePath)) {
    http_response_code(503);
    exit('Журнал заявок временно недоступен.');
}
$config = json_decode((string)file_get_contents($configPath), true);
if (!is_array($config) || empty($config['admin_password_hash'])) {
    http_response_code(503);
    exit('Доступ к журналу ещё не настроен.');
}

$user = (string)($_SERVER['PHP_AUTH_USER'] ?? '');
$password = (string)($_SERVER['PHP_AUTH_PW'] ?? '');
if ($user === '' && isset($_SERVER['HTTP_AUTHORIZATION'])
    && preg_match('/^Basic\\s+(.+)$/i', (string)$_SERVER['HTTP_AUTHORIZATION'], $authMatch)) {
    $decoded = base64_decode($authMatch[1], true);
    if (is_string($decoded) && str_contains($decoded, ':')) {
        [$user, $password] = explode(':', $decoded, 2);
    }
}
if ($user !== 'baribal' || !password_verify($password, (string)$config['admin_password_hash'])) {
    header('WWW-Authenticate: Basic realm="BARIBAL — журнал заявок"');
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
if (empty($_SESSION['lead_csrf'])) {
    $_SESSION['lead_csrf'] = bin2hex(random_bytes(32));
}

function leadHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

try {
    $pdo = baribalLeadDatabase($config);
    $pendingReviews = (int)$pdo->query("SELECT COUNT(*) FROM baribal_reviews WHERE status = 'pending'")->fetchColumn();
    $query = trim((string)($_GET['q'] ?? ''));
    $view = (string)($_GET['view'] ?? 'active');
    if (!in_array($view, ['active', 'trash'], true)) {
        $view = 'active';
    }
    $filter = (string)($_GET['filter'] ?? 'all');
    $filterLabels = [
        'all' => 'Все',
        'unprocessed' => 'Необработанные',
        'new' => 'Новые',
        'in_progress' => 'В работе',
        'booked' => 'Записаны',
        'completed' => 'Завершённые',
    ];
    if (!isset($filterLabels[$filter])) {
        $filter = 'all';
    }
    $page = max(1, min(100000, (int)($_GET['page'] ?? 1)));
    $statusLabels = [
        'new' => 'Новая',
        'in_progress' => 'В работе',
        'booked' => 'Записан',
        'completed' => 'Завершена',
    ];
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $token = (string)($_POST['csrf'] ?? '');
        $leadId = (int)($_POST['lead_id'] ?? 0);
        $action = (string)($_POST['action'] ?? 'status');
        if (!hash_equals((string)$_SESSION['lead_csrf'], $token) || $leadId < 1) {
            http_response_code(400);
            exit('Не удалось проверить запрос. Обновите страницу и повторите действие.');
        }

        if ($action === 'status') {
            $newStatus = (string)($_POST['status'] ?? '');
            if (!isset($statusLabels[$newStatus]) || $view !== 'active') {
                http_response_code(400);
                exit('Недопустимое изменение статуса.');
            }
            $updateStatus = $pdo->prepare('UPDATE baribal_leads SET status = :status WHERE id = :id AND deleted_at IS NULL');
            $updateStatus->execute(['status' => $newStatus, 'id' => $leadId]);
            $redirect = '/admin/leads.php?' . http_build_query(['q' => $query, 'filter' => $filter, 'page' => $page]);
            header('Location: ' . $redirect, true, 303);
            exit;
        }

        if (!in_array($action, ['trash', 'restore', 'delete'], true)) {
            http_response_code(400);
            exit('Неизвестное действие.');
        }
        $findLead = $pdo->prepare('SELECT id, lead_number, deleted_at FROM baribal_leads WHERE id = :id LIMIT 1');
        $findLead->execute(['id' => $leadId]);
        $targetLead = $findLead->fetch();
        if (!$targetLead) {
            http_response_code(404);
            exit('Заявка не найдена.');
        }

        if ($action === 'trash' || $action === 'delete') {
            $confirmPassword = (string)($_POST['confirm_password'] ?? '');
            $confirmNumber = trim((string)($_POST['confirm_number'] ?? ''));
            $actualNumber = (string)($targetLead['lead_number'] ?: baribalLeadNumber($leadId));
            if (!password_verify($confirmPassword, (string)$config['admin_password_hash'])
                || !hash_equals($actualNumber, $confirmNumber)) {
                http_response_code(403);
                exit('Пароль или номер заявки не совпадает. Действие не выполнено.');
            }
        }

        if ($action === 'trash') {
            if ($targetLead['deleted_at'] !== null) {
                http_response_code(409);
                exit('Заявка уже находится в корзине.');
            }
            $change = $pdo->prepare('UPDATE baribal_leads SET deleted_at = NOW() WHERE id = :id AND deleted_at IS NULL');
            $change->execute(['id' => $leadId]);
            $redirect = '/admin/leads.php';
        } elseif ($action === 'restore') {
            if ($targetLead['deleted_at'] === null) {
                http_response_code(409);
                exit('Заявка уже находится в основном списке.');
            }
            $change = $pdo->prepare('UPDATE baribal_leads SET deleted_at = NULL WHERE id = :id AND deleted_at IS NOT NULL');
            $change->execute(['id' => $leadId]);
            $redirect = '/admin/leads.php?view=trash';
        } else {
            if ($targetLead['deleted_at'] === null) {
                http_response_code(409);
                exit('Сначала переместите заявку в корзину.');
            }
            $change = $pdo->prepare('DELETE FROM baribal_leads WHERE id = :id AND deleted_at IS NOT NULL');
            $change->execute(['id' => $leadId]);
            $redirect = '/admin/leads.php?view=trash';
        }
        header('Location: ' . $redirect, true, 303);
        exit;
    }
    $perPage = 40;
    $searchWhere = '';
    $searchParams = [];
    if ($query !== '') {
        $searchWhere = ' WHERE (lead_number LIKE :number OR phone LIKE :phone OR name LIKE :name OR service LIKE :service)';
        $like = '%' . $query . '%';
        $searchParams = ['number' => $like, 'phone' => $like, 'name' => $like, 'service' => $like];
    }

    // Status chips are global navigation: clicking one clears any email/search deep-link.
    $statusCountsQuery = $pdo->query(
        'SELECT status, COUNT(*) AS amount FROM baribal_leads WHERE deleted_at IS NULL GROUP BY status'
    );
    $trashCount = (int)$pdo->query('SELECT COUNT(*) FROM baribal_leads WHERE deleted_at IS NOT NULL')->fetchColumn();
    $statusCounts = ['new' => 0, 'in_progress' => 0, 'booked' => 0, 'completed' => 0];
    foreach ($statusCountsQuery->fetchAll() as $statusCount) {
        if (array_key_exists((string)$statusCount['status'], $statusCounts)) {
            $statusCounts[(string)$statusCount['status']] = (int)$statusCount['amount'];
        }
    }
    $allCount = array_sum($statusCounts);
    $unprocessedCount = $statusCounts['new'] + $statusCounts['in_progress'];

    $whereParts = [$view === 'trash' ? 'deleted_at IS NOT NULL' : 'deleted_at IS NULL'];
    $params = $searchParams;
    if ($searchWhere !== '') {
        $whereParts[] = substr($searchWhere, 7);
    }
    if ($view === 'active' && $filter === 'unprocessed') {
        $whereParts[] = "status IN ('new', 'in_progress')";
    } elseif ($view === 'active' && isset($statusLabels[$filter])) {
        $whereParts[] = 'status = :status_filter';
        $params['status_filter'] = $filter;
    }
    $where = $whereParts ? ' WHERE ' . implode(' AND ', $whereParts) : '';

    $count = $pdo->prepare('SELECT COUNT(*) FROM baribal_leads' . $where);
    $count->execute($params);
    $total = (int)$count->fetchColumn();
    $pages = max(1, (int)ceil($total / $perPage));
    $page = min($page, $pages);
    $offset = ($page - 1) * $perPage;
    $statement = $pdo->prepare(
        'SELECT id, lead_number, created_at, status, name, phone, car, service,
                selected_services, contact_methods, contact_other, page_url, page_path,
                page_title, source_block, source_button, referrer, utm_source,
                utm_medium, utm_campaign, is_repeat, previous_lead_id, email_status, email_error
         FROM baribal_leads' . $where . ' ORDER BY id DESC LIMIT ' . $perPage . ' OFFSET ' . $offset
    );
    $statement->execute($params);
    $leads = $statement->fetchAll();
} catch (Throwable $error) {
    error_log('BARIBAL leads dashboard failed (' . get_class($error) . ').');
    http_response_code(503);
    exit('Не удалось подключиться к базе заявок. Проверьте настройки базы данных.');
}

function leadValue(array $lead, string $key, string $fallback = '—'): string
{
    $value = trim((string)($lead[$key] ?? ''));
    return $value !== '' ? $value : $fallback;
}

?><!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Заявки BARIBAL</title>
<style>
:root{color-scheme:light;--ink:#202124;--muted:#687078;--line:#e4e7ea;--paper:#fff;--soft:#f4f6f7;--accent:#b77b36;--warn:#fff3df;--green:#e8f5ed}
*{box-sizing:border-box}body{margin:0;background:#f1f3f4;color:var(--ink);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}
main{max-width:1180px;margin:0 auto;padding:28px 20px 56px}.top{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:22px}
.eyebrow{color:var(--accent);font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
h1{font-size:30px;line-height:1.15;margin:5px 0}.muted{color:var(--muted)}.count{font-variant-numeric:tabular-nums;color:var(--muted)}
.admin-nav{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 18px}.admin-nav a{display:inline-flex;align-items:center;gap:8px;padding:9px 13px;border:1px solid var(--line);border-radius:999px;background:#fff;color:#41484e;text-decoration:none;font-weight:750;font-size:13px}.admin-nav a.active{background:#25282b;border-color:#25282b;color:#fff}.admin-nav b{display:inline-grid;place-items:center;min-width:22px;height:22px;padding:0 6px;border-radius:99px;background:#f9dddd;color:#a33a3a;font-size:11px}
.search{display:flex;gap:8px;margin:0 0 12px}.search input{flex:1;min-width:0;border:1px solid var(--line);border-radius:10px;padding:12px 14px;font:inherit;background:white}
.filters{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 20px}.filter-chip{display:inline-flex;align-items:center;gap:8px;padding:8px 11px;border:1px solid var(--line);border-radius:999px;background:#fff;color:#41484e;text-decoration:none;font-size:13px;font-weight:700}.filter-chip span{display:inline-grid;place-items:center;min-width:21px;height:21px;padding:0 5px;border-radius:999px;background:#edf0f2;color:#596168;font-size:11px;font-variant-numeric:tabular-nums}.filter-chip.is-active{background:#25282b;border-color:#25282b;color:#fff}.filter-chip.is-active span{background:#fff;color:#25282b}.filter-chip.is-alert:not(.is-active){border-color:#efc3c3;background:#fff5f5;color:#a33a3a}.filter-chip.is-alert:not(.is-active) span{background:#f9dddd;color:#a33a3a}
button{border:0;border-radius:10px;padding:0 18px;background:#25282b;color:white;font:inherit;font-weight:650;cursor:pointer}
.list{display:grid;gap:14px}.lead{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:18px 20px;box-shadow:0 4px 18px #10182008}.lead-unprocessed{background:#fffafa;border-color:#edc7c7;box-shadow:inset 3px 0 0 #d96b6b,0 4px 18px #10182008}.tag.status-new{background:#fde5e5;color:#a12e2e}.tag.status-in_progress{background:#fff0e8;color:#a34c2b}.tag.status-booked{background:#e9f1fb;color:#315f91}.tag.status-completed{background:#e8f5ed;color:#21643a}
.lead-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.number{font-weight:800;font-size:18px;letter-spacing:.02em}
.tags{display:flex;gap:7px;flex-wrap:wrap}.tag{display:inline-flex;align-items:center;border-radius:999px;padding:4px 9px;font-size:12px;font-weight:700;background:var(--soft);color:#4f5961}
.tag.repeat{background:var(--warn);color:#875313}.tag.sent{background:var(--green);color:#21643a}.tag.failed{background:#fdeaea;color:#9c3030}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 20px}.field{min-width:0}.field small{display:block;color:var(--muted);font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:3px}
.field strong,.field span,.field a{display:block;overflow-wrap:anywhere}.field a{color:#8a5b22;text-decoration:none}.field a:hover{text-decoration:underline}
.wide{grid-column:1/-1}.empty{padding:36px;text-align:center;color:var(--muted);background:white;border:1px solid var(--line);border-radius:14px}
.pager{display:flex;justify-content:space-between;align-items:center;margin-top:20px}.pager a{color:#80551f;text-decoration:none;font-weight:700}.status-form{display:flex;align-items:center;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid var(--line)}.status-form select{max-width:190px;border:1px solid var(--line);border-radius:8px;padding:8px 10px;background:#fff;color:var(--ink);font:inherit}.status-form button{padding:8px 12px;font-size:13px}
.trash-nav{margin-left:auto}.trash-nav span{font-size:17px}.trash-nav b{background:#edf0f2;color:#596168}
.lead-controls{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px;padding-top:12px;border-top:1px solid var(--line)}.lead-controls .status-form{margin:0;padding:0;border:0}
.lead-action{position:relative}.lead-action summary{list-style:none;display:grid;place-items:center;width:36px;height:36px;border:1px solid var(--line);border-radius:9px;background:#fff;color:#596168;font-size:19px;cursor:pointer}.lead-action summary::-webkit-details-marker{display:none}.danger-action summary{color:#a33a3a}
.action-panel{position:absolute;z-index:5;right:0;bottom:44px;width:min(320px,calc(100vw - 44px));display:grid;gap:10px;padding:14px;background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:0 12px 36px #10182020}.action-panel strong{font-size:13px}.action-panel label{display:grid;gap:5px;color:var(--muted);font-size:11px;font-weight:700}.action-panel input{width:100%;min-width:0;padding:9px 10px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink);font:13px -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.action-panel button{min-height:38px}.danger-action .action-panel button{background:#a33a3a}
@media(max-width:700px){main{padding:20px 12px 40px}.top{display:block}h1{font-size:25px}.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.lead{padding:15px}.lead-head{align-items:flex-start;flex-direction:column}.search button{padding:0 12px}}
@media(max-width:420px){.grid{grid-template-columns:1fr}.wide{grid-column:auto}}
</style>
</head>
<body>
<main>
<header class="top">
 <div><div class="eyebrow">BARIBAL · ВНУТРЕННИЙ ЖУРНАЛ</div><h1><?= $view === 'trash' ? 'Корзина заявок' : 'Заявки клиентов' ?></h1><div class="muted"><?= $view === 'trash' ? 'Удалённые заявки можно восстановить или удалить навсегда' : 'Все обращения сохраняются отдельно, включая повторные' ?></div></div>
 <div class="count">Найдено: <?= number_format($total, 0, ',', ' ') ?></div>
</header>
<nav class="admin-nav" aria-label="Разделы админки">
 <a class="<?= $view === 'active' ? 'active' : '' ?>" href="/admin/leads.php">Заявки</a>
 <a class="trash-nav <?= $view === 'trash' ? 'active' : '' ?>" href="/admin/leads.php?view=trash"><span aria-hidden="true">🗑</span> Корзина <b><?= number_format($trashCount, 0, ',', ' ') ?></b></a>
 <a href="/admin/reviews.php">Отзывы<?php if ($pendingReviews > 0): ?><b><?= number_format($pendingReviews, 0, ',', ' ') ?></b><?php endif; ?></a>
</nav>
<form class="search" method="get" action="">
 <input type="search" name="q" value="<?= leadHtml($query) ?>" placeholder="Номер, телефон, имя или услуга" aria-label="Поиск заявок">
 <input type="hidden" name="filter" value="<?= leadHtml($filter) ?>">
 <input type="hidden" name="view" value="<?= leadHtml($view) ?>">
 <button type="submit">Найти</button>
</form>
<?php if ($view === 'active'): ?>
<nav class="filters" aria-label="Фильтр заявок">
 <?php foreach ($filterLabels as $filterKey => $filterLabel):
   $filterCount = match ($filterKey) {
     'all' => $allCount,
     'unprocessed' => $unprocessedCount,
     default => $statusCounts[$filterKey] ?? 0,
   };
 ?>
  <a class="filter-chip<?= $filter === $filterKey ? ' is-active' : '' ?><?= $filterKey === 'unprocessed' ? ' is-alert' : '' ?>"
     href="?<?= http_build_query(['filter' => $filterKey]) ?>">
    <?= leadHtml($filterLabel) ?><span><?= number_format($filterCount, 0, ',', ' ') ?></span>
  </a>
 <?php endforeach; ?>
</nav>
<?php endif; ?>
<section class="list" aria-label="Список заявок">
<?php if (!$leads): ?>
 <div class="empty"><?= $view === 'trash' ? 'Корзина пуста.' : 'Заявок пока нет' . ($query !== '' ? ' по этому запросу' : '') . '.' ?></div>
<?php endif; ?>
<?php foreach ($leads as $lead): ?>
 <article class="lead<?= in_array((string)$lead['status'], ['new', 'in_progress'], true) ? ' lead-unprocessed' : '' ?>">
  <div class="lead-head">
   <div><div class="number"><?= leadHtml(leadValue($lead, 'lead_number', 'BAR-' . str_pad((string)$lead['id'], 6, '0', STR_PAD_LEFT))) ?></div><div class="muted"><?= leadHtml((string)$lead['created_at']) ?></div></div>
   <div class="tags">
    <span class="tag status status-<?= leadHtml((string)$lead['status']) ?>"><?= leadHtml($statusLabels[(string)$lead['status']] ?? 'Неизвестный статус') ?></span>
    <?php if ((int)$lead['is_repeat'] === 1): ?><span class="tag repeat">Повтор · <?= leadHtml(baribalLeadNumber((int)$lead['previous_lead_id'])) ?></span><?php else: ?><span class="tag">Первое обращение</span><?php endif; ?>
    <?php if ($lead['email_status'] === 'sent'): ?><span class="tag sent">Письмо отправлено</span><?php elseif ($lead['email_status'] === 'failed'): ?><span class="tag failed">Ошибка письма</span><?php else: ?><span class="tag">Письмо: <?= leadHtml(leadValue($lead, 'email_status')) ?></span><?php endif; ?>
   </div>
  </div>
  <div class="grid">
   <div class="field"><small>Клиент</small><strong><?= leadHtml(leadValue($lead, 'name', 'Имя не указано')) ?></strong></div>
   <div class="field"><small>Телефон</small><a href="tel:<?= leadHtml((string)$lead['phone']) ?>"><?= leadHtml((string)$lead['phone']) ?></a></div>
   <div class="field"><small>Автомобиль</small><span><?= leadHtml(leadValue($lead, 'car')) ?></span></div>
   <div class="field"><small>Услуга</small><strong><?= leadHtml(leadValue($lead, 'service')) ?></strong></div>
   <div class="field"><small>Способ связи</small><span><?= leadHtml(leadValue($lead, 'contact_methods')) ?></span></div>
   <?php if (trim((string)$lead['contact_other']) !== ''): ?><div class="field"><small>Комментарий</small><span><?= nl2br(leadHtml((string)$lead['contact_other'])) ?></span></div><?php endif; ?>
   <div class="field"><small>Выбранные услуги</small><span><?= nl2br(leadHtml(leadValue($lead, 'selected_services'))) ?></span></div>
   <div class="field"><small>Страница</small><a href="<?= leadHtml(leadValue($lead, 'page_url', '#')) ?>" target="_blank" rel="noopener"><?= leadHtml(leadValue($lead, 'page_title', leadValue($lead, 'page_path'))) ?></a></div>
   <div class="field"><small>Блок / кнопка</small><span><?= leadHtml(leadValue($lead, 'source_block')) ?><?= trim((string)$lead['source_button']) !== '' ? ' · ' . leadHtml((string)$lead['source_button']) : '' ?></span></div>
   <div class="field"><small>Реклама</small><span><?= leadHtml(implode(' / ', array_filter([(string)$lead['utm_source'], (string)$lead['utm_medium'], (string)$lead['utm_campaign']]))) ?: '—' ?></span></div>
  </div>
  <?php if ($view === 'active'): ?>
  <div class="lead-controls">
   <form class="status-form" method="post">
    <input type="hidden" name="csrf" value="<?= leadHtml((string)$_SESSION['lead_csrf']) ?>">
    <input type="hidden" name="lead_id" value="<?= (int)$lead['id'] ?>">
    <input type="hidden" name="action" value="status">
    <label class="muted" for="status-<?= (int)$lead['id'] ?>">Статус:</label>
    <select id="status-<?= (int)$lead['id'] ?>" name="status">
     <?php foreach ($statusLabels as $statusKey => $statusLabel): ?>
      <option value="<?= leadHtml($statusKey) ?>"<?= $lead['status'] === $statusKey ? ' selected' : '' ?>><?= leadHtml($statusLabel) ?></option>
     <?php endforeach; ?>
    </select>
    <button type="submit">Сохранить</button>
   </form>
   <details class="lead-action">
    <summary aria-label="Переместить заявку в корзину" title="Переместить в корзину">🗑</summary>
    <form method="post" class="action-panel">
     <input type="hidden" name="csrf" value="<?= leadHtml((string)$_SESSION['lead_csrf']) ?>">
     <input type="hidden" name="lead_id" value="<?= (int)$lead['id'] ?>">
     <input type="hidden" name="action" value="trash">
     <strong>Переместить <?= leadHtml(leadValue($lead, 'lead_number')) ?> в корзину</strong>
     <label>Повторите пароль администратора<input type="password" name="confirm_password" autocomplete="current-password" required></label>
     <label>Введите номер заявки<input type="text" name="confirm_number" value="" placeholder="<?= leadHtml(leadValue($lead, 'lead_number')) ?>" required></label>
     <button type="submit">Подтвердить</button>
    </form>
   </details>
  </div>
  <?php else: ?>
  <div class="lead-controls trash-controls">
   <form method="post" class="status-form">
    <input type="hidden" name="csrf" value="<?= leadHtml((string)$_SESSION['lead_csrf']) ?>">
    <input type="hidden" name="lead_id" value="<?= (int)$lead['id'] ?>">
    <input type="hidden" name="action" value="restore">
    <button type="submit">↶ Восстановить</button>
   </form>
   <details class="lead-action danger-action">
    <summary aria-label="Удалить заявку навсегда" title="Удалить навсегда">×</summary>
    <form method="post" class="action-panel">
     <input type="hidden" name="csrf" value="<?= leadHtml((string)$_SESSION['lead_csrf']) ?>">
     <input type="hidden" name="lead_id" value="<?= (int)$lead['id'] ?>">
     <input type="hidden" name="action" value="delete">
     <strong>Удалить <?= leadHtml(leadValue($lead, 'lead_number')) ?> навсегда</strong>
     <label>Повторите пароль администратора<input type="password" name="confirm_password" autocomplete="current-password" required></label>
     <label>Введите номер заявки<input type="text" name="confirm_number" value="" placeholder="<?= leadHtml(leadValue($lead, 'lead_number')) ?>" required></label>
     <button type="submit">Удалить навсегда</button>
    </form>
   </details>
  </div>
  <?php endif; ?>
 </article>
<?php endforeach; ?>
</section>
<nav class="pager" aria-label="Страницы">
 <span class="muted">Страница <?= $page ?> из <?= $pages ?></span>
 <span><?php if ($page > 1): ?><a href="?q=<?= rawurlencode($query) ?>&filter=<?= rawurlencode($filter) ?>&page=<?= $page - 1 ?>">← Новее</a><?php endif; ?> <?php if ($page < $pages): ?><a href="?q=<?= rawurlencode($query) ?>&filter=<?= rawurlencode($filter) ?>&page=<?= $page + 1 ?>">Старее →</a><?php endif; ?></span>
</nav>
</main>
</body>
</html>
