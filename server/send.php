<?php
// Заявки с сайта ai-factory: сохраняет каждую заявку на хостинге и пересылает её в Telegram.
// Настройки лежат в lead-config.php рядом с этим файлом (образец: lead-config.example.php).
// Недоставленные заявки отправляет повторно команда `php send.php retry`, её можно поставить в cron.
// Совместим с PHP 7.4 и новее.

ini_set('display_errors', '0');

const LEAD_FIELDS = ['name' => 80, 'contact' => 120, 'interest' => 120, 'task' => 3000];
// Файлы с данными начинаются с этой строки: при открытии из браузера PHP сразу отвечает 404.
const LEAD_GUARD = "<?php http_response_code(404); exit; ?>\n";

function lead_config(string $dir): array
{
    $defaults = [
        'bot_token' => '',
        'recipient_username' => 'veermitor',
        'chat_id' => '',
        'api_base' => 'https://api.telegram.org',
        'fallback_email' => '',
        'site_name' => 'ai-factory',
        'rate_max' => 5,
        'rate_window' => 600,
        'min_fill_seconds' => 3,
    ];
    $file = $dir . '/lead-config.php';
    $custom = is_file($file) ? include $file : [];
    return array_merge($defaults, is_array($custom) ? $custom : []);
}

function lead_cut(string $value, int $limit): string
{
    return preg_match('/^.{0,' . $limit . '}/us', trim($value), $match) ? $match[0] : '';
}

function lead_len(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : (int) preg_match_all('/./us', $value);
}

function lead_reply(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function lead_data_dir(string $dir): string
{
    $path = $dir . '/lead-data';
    if (!is_dir($path)) {
        @mkdir($path, 0750, true);
    }
    if (!is_file($path . '/.htaccess')) {
        @file_put_contents($path . '/.htaccess', "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Deny from all\n</IfModule>\n");
    }
    if (!is_file($path . '/index.php')) {
        @file_put_contents($path . '/index.php', LEAD_GUARD);
    }
    return $path;
}

function lead_append(string $file, array $record): bool
{
    $handle = @fopen($file, 'c+');
    if (!$handle) {
        return false;
    }
    flock($handle, LOCK_EX);
    if (fstat($handle)['size'] === 0) {
        fwrite($handle, LEAD_GUARD);
    }
    fseek($handle, 0, SEEK_END);
    $ok = fwrite($handle, json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n") !== false;
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    return $ok;
}

function lead_read(string $file): array
{
    if (!is_file($file)) {
        return [];
    }
    $rows = [];
    foreach (array_slice(file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [], 1) as $line) {
        $row = json_decode($line, true);
        if (is_array($row)) {
            $rows[] = $row;
        }
    }
    return $rows;
}

function lead_client_ip(): string
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    // Behind the hosting's own proxy every visitor would share one address.
    $public = filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
    if (!$public) {
        $forwarded = trim(explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['HTTP_X_REAL_IP'] ?? ''))[0]);
        if (filter_var($forwarded, FILTER_VALIDATE_IP)) {
            return $forwarded;
        }
    }
    return $ip;
}

function lead_rate_limited(string $data, array $config): bool
{
    $handle = @fopen($data . '/rate.php', 'c+');
    if (!$handle) {
        return false;
    }
    flock($handle, LOCK_EX);
    $raw = (string) stream_get_contents($handle);
    $json = strpos($raw, LEAD_GUARD) === 0 ? substr($raw, strlen(LEAD_GUARD)) : '';
    $map = json_decode($json !== '' ? $json : '{}', true) ?: [];
    $now = time();
    $key = substr(hash('sha256', 'ai-factory|' . lead_client_ip()), 0, 16);
    foreach ($map as $id => $times) {
        $recent = array_values(array_filter($times, function ($time) use ($now, $config) {
            return $time > $now - (int) $config['rate_window'];
        }));
        if ($recent) {
            $map[$id] = $recent;
        } else {
            unset($map[$id]);
        }
    }
    $limited = count($map[$key] ?? []) >= (int) $config['rate_max'];
    if (!$limited) {
        $map[$key][] = $now;
    }
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, LEAD_GUARD . json_encode($map));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    return $limited;
}

function lead_telegram(array $config, string $method, array $params): ?array
{
    $url = rtrim((string) $config['api_base'], '/') . '/bot' . $config['bot_token'] . '/' . $method;
    $body = json_encode($params, JSON_UNESCAPED_UNICODE);
    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 10,
        ]);
        $raw = curl_exec($curl);
        unset($curl);
    } else {
        $context = stream_context_create(['http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $body,
            'timeout' => 10,
            'ignore_errors' => true,
        ]]);
        $raw = @file_get_contents($url, false, $context);
    }
    $answer = is_string($raw) ? json_decode($raw, true) : null;
    return is_array($answer) ? $answer : null;
}

// The recipient must press Start in the bot once; after that the chat is found by username and cached.
function lead_chat_id(array $config, string $data)
{
    if ((string) $config['chat_id'] !== '') {
        return is_numeric($config['chat_id']) ? (int) $config['chat_id'] : (string) $config['chat_id'];
    }
    $cached = lead_read($data . '/chat-id.php');
    if ($cached) {
        return end($cached)['chat_id'];
    }
    $username = ltrim((string) $config['recipient_username'], '@');
    $answer = lead_telegram($config, 'getUpdates', ['limit' => 100]);
    foreach (array_reverse($answer['result'] ?? []) as $update) {
        foreach (['message', 'edited_message', 'my_chat_member'] as $kind) {
            $from = $update[$kind]['from'] ?? [];
            $chat = $update[$kind]['chat'] ?? [];
            if (($chat['type'] ?? '') === 'private' && strcasecmp(ltrim((string) ($from['username'] ?? ''), '@'), $username) === 0) {
                @file_put_contents($data . '/chat-id.php', LEAD_GUARD . json_encode(['chat_id' => $chat['id']]) . "\n");
                return $chat['id'];
            }
        }
    }
    return null;
}

function lead_message(array $lead, array $config): string
{
    $escape = function ($value) {
        return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    };
    $time = (new DateTime((string) $lead['time']))->setTimezone(new DateTimeZone('Europe/Moscow'))->format('d.m.Y H:i');
    return implode("\n", [
        '🟢 <b>Новая заявка · ' . $escape($config['site_name']) . '</b>',
        '',
        '<b>Имя:</b> ' . $escape($lead['name']),
        '<b>Контакт:</b> ' . $escape($lead['contact']),
        '<b>Интересует:</b> ' . $escape($lead['interest'] !== '' ? $lead['interest'] : 'не указано'),
        '',
        '<b>Задача:</b>',
        $escape($lead['task']),
        '',
        '<i>' . $escape(trim($time . ' МСК · ' . ($lead['page'] ?? ''), ' ·')) . '</i>',
    ]);
}

function lead_send(array $lead, array $config, string $data): bool
{
    if ((string) $config['bot_token'] === '') {
        return false;
    }
    $chat = lead_chat_id($config, $data);
    if ($chat === null || $chat === '') {
        return false;
    }
    $answer = lead_telegram($config, 'sendMessage', [
        'chat_id' => $chat,
        'text' => lead_message($lead, $config),
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true,
    ]);
    if (($answer['ok'] ?? false) !== true) {
        return false;
    }
    lead_append($data . '/delivered.php', ['id' => $lead['id'], 'time' => gmdate('c')]);
    return true;
}

function lead_email(array $lead, array $config): void
{
    $to = trim((string) $config['fallback_email']);
    if ($to === '' || !function_exists('mail')) {
        return;
    }
    $text = html_entity_decode(strip_tags(lead_message($lead, $config)), ENT_QUOTES, 'UTF-8');
    $subject = '=?UTF-8?B?' . base64_encode('Заявка с сайта ' . $config['site_name']) . '?=';
    @mail($to, $subject, $text, "Content-Type: text/plain; charset=utf-8\r\n");
}

function lead_cli(array $argv, string $dir): int
{
    $config = lead_config($dir);
    $data = lead_data_dir($dir);
    $command = $argv[1] ?? '';
    $delivered = array_flip(array_column(lead_read($data . '/delivered.php'), 'id'));
    $waiting = array_values(array_filter(lead_read($data . '/leads.php'), function ($lead) use ($delivered) {
        return !isset($delivered[$lead['id'] ?? '']);
    }));
    if ($command === 'retry') {
        $sent = 0;
        foreach ($waiting as $lead) {
            $sent += lead_send($lead, $config, $data) ? 1 : 0;
        }
        fwrite(STDOUT, 'Отправлено: ' . $sent . ', ждут отправки: ' . (count($waiting) - $sent) . "\n");
        return 0;
    }
    if ($command === 'status') {
        fwrite(STDOUT, 'Заявок всего: ' . count(lead_read($data . '/leads.php')) . ', ждут отправки: ' . count($waiting) . "\n");
        return 0;
    }
    fwrite(STDOUT, "Команды: php send.php retry | php send.php status\n");
    return 0;
}

if (PHP_SAPI === 'cli') {
    exit(lead_cli($argv ?? [], __DIR__));
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    lead_reply(405, ['ok' => false, 'error' => 'method']);
}

$config = lead_config(__DIR__);
$raw = (string) file_get_contents('php://input', false, null, 0, 20000);
$input = json_decode($raw, true);
if (!is_array($input)) {
    $input = $_POST;
}

// Bots fill the hidden field or submit faster than a person can type. They get a normal answer and nothing else.
$tooFast = isset($input['elapsed']) && (int) $input['elapsed'] < (int) $config['min_fill_seconds'];
if (trim((string) ($input['website'] ?? '')) !== '' || $tooFast) {
    lead_reply(200, ['ok' => true, 'delivered' => true]);
}

$lead = [];
foreach (LEAD_FIELDS as $field => $limit) {
    $lead[$field] = lead_cut((string) ($input[$field] ?? ''), $limit);
}
$consent = in_array($input['consent'] ?? false, [true, 'true', '1', 'on', 1], true);
if ($lead['name'] === '') {
    lead_reply(422, ['ok' => false, 'error' => 'name']);
}
if (lead_len($lead['contact']) < 3) {
    lead_reply(422, ['ok' => false, 'error' => 'contact']);
}
if (lead_len($lead['task']) < 10) {
    lead_reply(422, ['ok' => false, 'error' => 'task']);
}
if (!$consent) {
    lead_reply(422, ['ok' => false, 'error' => 'consent']);
}

$data = lead_data_dir(__DIR__);
if (lead_rate_limited($data, $config)) {
    lead_reply(429, ['ok' => false, 'error' => 'rate']);
}

$lead += [
    'id' => bin2hex(random_bytes(6)),
    'time' => gmdate('c'),
    'page' => lead_cut((string) ($input['page'] ?? ''), 300),
    'source' => lead_cut((string) ($input['source'] ?? ''), 40),
    'consent' => true,
];
$stored = lead_append($data . '/leads.php', $lead);
$delivered = lead_send($lead, $config, $data);
if (!$delivered) {
    lead_email($lead, $config);
}
if (!$stored && !$delivered) {
    lead_reply(500, ['ok' => false, 'error' => 'storage']);
}
lead_reply(200, ['ok' => true, 'delivered' => $delivered]);
