<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$limit = 5;
$storagePath = __DIR__ . '/../data/ask_me_limits.json';

if (!file_exists($storagePath)) {
    file_put_contents($storagePath, "{}");
}

$raw = file_get_contents($storagePath);
$records = json_decode($raw ?: '{}', true);
if (!is_array($records)) {
    $records = [];
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ipKey = hash('sha256', $ip);

if (!isset($records[$ipKey]) || !is_array($records[$ipKey])) {
    $records[$ipKey] = ['count' => 0];
}

$count = (int)($records[$ipKey]['count'] ?? 0);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? null;

if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input') ?: '{}', true);
    if (is_array($body) && isset($body['action'])) {
        $action = (string)$body['action'];
    }
}

if ($action === 'consume') {
    $wasAllowed = $count < $limit;
    if ($wasAllowed) {
        $count++;
        $records[$ipKey]['count'] = $count;
        file_put_contents($storagePath, json_encode($records, JSON_PRETTY_PRINT), LOCK_EX);
    }

    echo json_encode([
        'ok' => true,
        'allowed' => $wasAllowed,
        'limit' => $limit,
        'used' => min($count, $limit),
        'remaining' => max(0, $limit - $count),
    ]);
    exit;
}

echo json_encode([
    'ok' => true,
    'allowed' => $count < $limit,
    'limit' => $limit,
    'used' => min($count, $limit),
    'remaining' => max(0, $limit - $count),
]);
