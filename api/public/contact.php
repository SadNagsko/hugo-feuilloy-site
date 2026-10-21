<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require dirname(__DIR__) . '/vendor/autoload.php';
require dirname(__DIR__) . '/src/mail-templates.php';

const MAX_BODY_BYTES = 20000;
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 3600;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header("Content-Security-Policy: frame-ancestors 'self'");
header('Cache-Control: no-cache, no-store, must-revalidate');

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

function clientIp(): string
{
    $remote = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    $behindProxy = filter_var($remote, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false;
    if ($behindProxy && $forwarded !== '') {
        $parts = array_map('trim', explode(',', $forwarded));
        $last = end($parts);
        if (is_string($last) && filter_var($last, FILTER_VALIDATE_IP)) {
            return $last;
        }
    }
    return $remote;
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
$config = static function (string $key, string $default = '') use ($env): string {
    if (isset($env[$key]) && $env[$key] !== '') {
        return $env[$key];
    }
    $value = getenv($key);
    return $value !== false && $value !== '' ? $value : $default;
};

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

if (rateLimited(clientIp())) {
    respond(429, ['ok' => false, 'error' => 'rate']);
}

$months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
$now = new DateTimeImmutable('now', new DateTimeZone('Europe/Paris'));
$receivedAt = $now->format('j') . ' ' . $months[(int) $now->format('n') - 1] . ' ' . $now->format('Y') . ' à ' . $now->format('H\\hi');
$siteUrl = $config('SITE_URL', 'https://hugofeuilloy.fr');
$siteHost = (string) preg_replace('#^https?://#', '', $siteUrl);

$smtp = static function () use ($config): PHPMailer {
    $mail = new PHPMailer(true);
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->isSMTP();
    $mail->Host = $config('SMTP_HOST', 'smtp.gmail.com');
    $mail->Port = (int) $config('SMTP_PORT', '587');
    $mail->SMTPAuth = true;
    $mail->Username = $config('SMTP_USER');
    $mail->Password = $config('SMTP_PASS');
    $mail->SMTPSecure = $mail->Port === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    return $mail;
};

$mail = $smtp();
try {
    $mail->setFrom($config('SMTP_USER'), $config('MAIL_FROM_NAME', 'Site ' . $siteHost));
    $mail->addAddress($config('CONTACT_TO', $config('SMTP_USER')));
    $mail->addReplyTo($fields['email'], $fields['nom']);

    $mail->Subject = 'Nouvelle demande – ' . $fields['nom'] . ($fields['entreprise'] !== '' ? " ({$fields['entreprise']})" : '');
    $mail->isHTML(true);
    $mail->Body = notificationHtml($fields, $receivedAt, $siteHost);
    $mail->AltBody = notificationText($fields, $receivedAt);

    $mail->send();
} catch (Exception) {
    error_log('Contact form: ' . $mail->ErrorInfo);
    respond(502, ['ok' => false, 'error' => 'send']);
}

if ($config('SEND_CONFIRMATION', '1') === '1') {
    $me = [
        'name' => $config('SIGNATURE_NAME', 'Hugo Feuilloy'),
        'role' => $config('SIGNATURE_ROLE', 'Développeur web freelance'),
        'phone' => $config('SIGNATURE_PHONE'),
        'email' => $config('CONTACT_TO', $config('SMTP_USER')),
        'site' => $siteUrl,
    ];
    $confirmation = $smtp();
    try {
        $confirmation->setFrom($config('SMTP_USER'), $me['name']);
        $confirmation->addAddress($fields['email'], $fields['nom']);
        $confirmation->addReplyTo($me['email'], $me['name']);
        $confirmation->Subject = 'Bien reçu, je reviens vers vous sous 24 h';
        $confirmation->isHTML(true);
        $confirmation->Body = confirmationHtml($fields['nom'], $me);
        $confirmation->AltBody = confirmationText($fields['nom'], $me);
        $confirmation->send();
    } catch (Exception) {
        error_log('Contact confirmation: ' . $confirmation->ErrorInfo);
    }
}

respond(200, ['ok' => true]);
