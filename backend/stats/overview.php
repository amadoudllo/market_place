<?php
require_once __DIR__ . '/../config.php';
requireAdmin();

$today = date('Y-m-d');

$ordersRes = supabaseRequest('orders', 'GET', null, 'order=created_at.desc&select=id,total,status,created_at,customer_phone');
$orders = $ordersRes['data'] ?? [];

$ordersToday = 0; $revenueToday = 0; $pending = 0; $customers = [];
foreach ($orders as $o) {
	$created = substr($o['created_at'] ?? '', 0, 10);
	if ($created === $today) { $ordersToday++; $revenueToday += intval($o['total'] ?? 0); }
	if (($o['status'] ?? '') === 'pending') $pending++;
	$customers[$o['customer_phone'] ?? ''] = true;
}

jsonResponse([
	'success' => true,
	'ordersToday' => $ordersToday,
	'revenueToday' => $revenueToday,
	'pending' => $pending,
	'totalCustomers' => max(0, count(array_filter(array_keys($customers))))
]);
