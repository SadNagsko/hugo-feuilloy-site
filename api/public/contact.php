<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require dirname(__DIR__) . '/vendor/autoload.php';

const MAX_BODY_BYTES = 20000;
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 3600;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function loadEnv(string $file): array
{
    if (!is_readable($file)) {
        return [];
    }
    $values = [];
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $values[trim($key)] = trim(trim($value), "\"'");
    }
    return $values;
}

function clean(mixed $value, int $max, bool $multiline = false): string
{
    $text = is_string($value) ? $value : '';
    $text = $multiline ? str_replace("\r\n", "\n", $text) : preg_replace('/\s+/u', ' ', $text);
    $text = preg_replace($multiline ? '/[^\P{C}\n\t]/u' : '/\p{C}/u', '', (string) $text);
    return mb_substr(trim((string) $text), 0, $max);
}

function rateLimited(string $ip): bool
{
    $file = sys_get_temp_dir() . '/hf-contact-' . hash('sha256', $ip) . '.json';
    $now = time();
    $hits = is_readable($file) ? (json_decode((string) file_get_contents($file), true) ?: []) : [];
    $hits = array_values(array_filter($hits, static fn ($time) => is_int($time) && $time > $now - RATE_WINDOW_SECONDS));
    if (count($hits) >= RATE_LIMIT) {
        return true;
    }
    $hits[] = $now;
    file_put_contents($file, json_encode($hits), LOCK_EX);
    return false;
}

$env = loadEnv(dirname(__DIR__) . '/.env');
$config = static fn (string $key, string $default = ''): string => $env[$key] ?? $default;

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method']);
}

$allowedOrigins = array_filter(array_map('trim', explode(',', $config('ALLOWED_ORIGINS'))));
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === '' || !in_array($origin, $allowedOrigins, true)) {
    respond(403, ['ok' => false, 'error' => 'origin']);
}

$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'error' => 'size']);
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    respond(400, ['ok' => false, 'error' => 'format']);
}

if (clean($data['site_web'] ?? '', 200) !== '') {
    respond(200, ['ok' => true]);
}

$fields = [
    'nom' => clean($data['nom'] ?? '', 120),
    'entreprise' => clean($data['entreprise'] ?? '', 120),
    'email' => clean($data['email'] ?? '', 180),
    'telephone' => clean($data['telephone'] ?? '', 40),
    'besoins' => clean($data['besoins'] ?? '', 300),
    'budget' => clean($data['budget'] ?? '', 60),
    'message' => clean($data['message'] ?? '', 5000, true),
];

if ($fields['nom'] === '' || $fields['message'] === '' || !filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'validation']);
}

if (rateLimited($_SERVER['REMOTE_ADDR'] ?? 'unknown')) {
    respond(429, ['ok' => false, 'error' => 'rate']);
}

$labels = [
    'nom' => 'Nom',
    'entreprise' => 'Entreprise',
    'email' => 'Email',
    'telephone' => 'Téléphone',
    'besoins' => 'Besoins',
    'budget' => 'Budget',
];
$details = [];
foreach ($labels as $key => $label) {
    if ($fields[$key] !== '') {
        $details[] = "{$label} : {$fields[$key]}";
    }
}

$mail = new PHPMailer(true);
try {
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->isSMTP();
    $mail->Host = $config('SMTP_HOST', 'smtp.gmail.com');
    $mail->Port = (int) $config('SMTP_PORT', '587');
    $mail->SMTPAuth = true;
    $mail->Username = $config('SMTP_USER');
    $mail->Password = $config('SMTP_PASS');
    $mail->SMTPSecure = $mail->Port === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;

    $mail->setFrom($config('SMTP_USER'), $config('MAIL_FROM_NAME', 'Site hugofeuilloy.fr'));
    $mail->addAddress($config('CONTACT_TO', $config('SMTP_USER')));
    $mail->addReplyTo($fields['email'], $fields['nom']);

    $mail->Subject = 'Nouvelle demande – ' . $fields['nom'] . ($fields['entreprise'] !== '' ? " ({$fields['entreprise']})" : '');
    $mail->Body = $fields['message'] . "\n\n—\n" . implode("\n", $details);

    $mail->send();
    respond(200, ['ok' => true]);
} catch (Exception) {
    error_log('Contact form: ' . $mail->ErrorInfo);
    respond(502, ['ok' => false, 'error' => 'send']);
}
