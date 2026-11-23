<?php
declare(strict_types=1);

/**
 * Shared BARIBAL lead storage.
 * The configuration is kept outside public_html; this file contains no secrets.
 */
function baribalLeadDatabase(array $config): PDO
{
    foreach (['db_host', 'db_name', 'db_username', 'db_password'] as $key) {
        if (!isset($config[$key]) || !is_string($config[$key]) || trim($config[$key]) === '') {
            throw new RuntimeException('Lead database configuration is incomplete.');
        }
    }

    $host = trim($config['db_host']);
    $database = trim($config['db_name']);
    $username = trim($config['db_username']);
    $password = $config['db_password'];

    $dsn = 'mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8mb4';
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_TIMEOUT => 5,
    ]);

    baribalEnsureLeadSchema($pdo);
    return $pdo;
}

function baribalEnsureLeadSchema(PDO $pdo): void
{
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS baribal_leads (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            lead_number VARCHAR(24) NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(24) NOT NULL DEFAULT 'new',
            name VARCHAR(100) NOT NULL DEFAULT '',
            phone VARCHAR(40) NOT NULL,
            phone_normalized VARCHAR(24) NOT NULL,
            car VARCHAR(150) NOT NULL DEFAULT '',
            service VARCHAR(180) NOT NULL DEFAULT '',
            selected_services TEXT NULL,
            contact_methods VARCHAR(255) NOT NULL DEFAULT '',
            contact_other VARCHAR(180) NOT NULL DEFAULT '',
            page_url TEXT NULL,
            page_path VARCHAR(255) NOT NULL DEFAULT '',
            page_title VARCHAR(255) NOT NULL DEFAULT '',
            source_block VARCHAR(255) NOT NULL DEFAULT '',
            source_button VARCHAR(180) NOT NULL DEFAULT '',
            referrer TEXT NULL,
            utm_source VARCHAR(255) NOT NULL DEFAULT '',
            utm_medium VARCHAR(255) NOT NULL DEFAULT '',
            utm_campaign VARCHAR(255) NOT NULL DEFAULT '',
            utm_term VARCHAR(255) NOT NULL DEFAULT '',
            utm_content VARCHAR(255) NOT NULL DEFAULT '',
            is_repeat TINYINT(1) NOT NULL DEFAULT 0,
            previous_lead_id BIGINT UNSIGNED NULL,
            email_status VARCHAR(24) NOT NULL DEFAULT 'pending',
            email_error VARCHAR(255) NOT NULL DEFAULT '',
            PRIMARY KEY (id),
            UNIQUE KEY uq_baribal_lead_number (lead_number),
            KEY idx_baribal_phone (phone_normalized, id),
            KEY idx_baribal_created (created_at),
            KEY idx_baribal_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
}

function baribalNormalizePhone(string $phone): string
{
    $digits = preg_replace('/\\D+/', '', $phone) ?? '';
    if (strlen($digits) === 10) {
        return '7' . $digits;
    }
    if (strlen($digits) === 11 && ($digits[0] === '8' || $digits[0] === '7')) {
        return '7' . substr($digits, 1);
    }
    return $digits;
}

function baribalLeadNumber(int $id): string
{
    return 'BAR-' . str_pad((string)$id, 6, '0', STR_PAD_LEFT);
}

/**
 * Each submission is retained as a separate lead. A matching normalized phone
 * only marks a possible repeat; it never suppresses a new request.
 */
function baribalSaveLead(PDO $pdo, array $lead): array
{
    $pdo->beginTransaction();
    try {
        $previousId = null;
        $lookup = $pdo->prepare(
            'SELECT id FROM baribal_leads WHERE phone_normalized = :phone ORDER BY id DESC LIMIT 1 FOR UPDATE'
        );
        $lookup->execute(['phone' => $lead['phone_normalized']]);
        $previous = $lookup->fetch();
        if ($previous) {
            $previousId = (int)$previous['id'];
        }

        $insert = $pdo->prepare(
            'INSERT INTO baribal_leads (
                name, phone, phone_normalized, car, service, selected_services,
                contact_methods, contact_other, page_url, page_path, page_title,
                source_block, source_button, referrer, utm_source, utm_medium,
                utm_campaign, utm_term, utm_content, is_repeat, previous_lead_id
            ) VALUES (
                :name, :phone, :phone_normalized, :car, :service, :selected_services,
                :contact_methods, :contact_other, :page_url, :page_path, :page_title,
                :source_block, :source_button, :referrer, :utm_source, :utm_medium,
                :utm_campaign, :utm_term, :utm_content, :is_repeat, :previous_lead_id
            )'
        );
        $insert->execute([
            'name' => $lead['name'],
            'phone' => $lead['phone'],
            'phone_normalized' => $lead['phone_normalized'],
            'car' => $lead['car'],
            'service' => $lead['service'],
            'selected_services' => $lead['selected_services'],
            'contact_methods' => $lead['contact_methods'],
            'contact_other' => $lead['contact_other'],
            'page_url' => $lead['page_url'],
            'page_path' => $lead['page_path'],
            'page_title' => $lead['page_title'],
            'source_block' => $lead['source_block'],
            'source_button' => $lead['source_button'],
            'referrer' => $lead['referrer'],
            'utm_source' => $lead['utm_source'],
            'utm_medium' => $lead['utm_medium'],
            'utm_campaign' => $lead['utm_campaign'],
            'utm_term' => $lead['utm_term'],
            'utm_content' => $lead['utm_content'],
            'is_repeat' => $previousId !== null ? 1 : 0,
            'previous_lead_id' => $previousId,
        ]);

        $id = (int)$pdo->lastInsertId();
        $number = baribalLeadNumber($id);
        $update = $pdo->prepare('UPDATE baribal_leads SET lead_number = :number WHERE id = :id');
        $update->execute(['number' => $number, 'id' => $id]);
        $pdo->commit();

        return [
            'id' => $id,
            'number' => $number,
            'is_repeat' => $previousId !== null,
            'previous_id' => $previousId,
            'previous_number' => $previousId !== null ? baribalLeadNumber($previousId) : '',
        ];
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $error;
    }
}

function baribalSetLeadEmailStatus(PDO $pdo, int $id, string $status, string $error = ''): void
{
    $statement = $pdo->prepare(
        'UPDATE baribal_leads SET email_status = :status, email_error = :error WHERE id = :id'
    );
    $statement->execute([
        'status' => $status,
        'error' => substr($error, 0, 255),
        'id' => $id,
    ]);
}
