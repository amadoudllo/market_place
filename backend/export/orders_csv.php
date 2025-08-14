<?php
require_once __DIR__ . '/../config.php';
requireAdmin();

$res = supabaseRequest('orders', 'GET', null, 'order=created_at.desc&select=order_number,customer_name,customer_phone,total,status,created_at');
$rows = $res['data'] ?? [];

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=orders.csv');
$out = fopen('php://output', 'w');
fputcsv($out, ['order_number','customer_name','customer_phone','total','status','created_at']);
foreach ($rows as $r) {
	fputcsv($out, [$r['order_number'],$r['customer_name'],$r['customer_phone'], $r['total'], $r['status'], $r['created_at']]);
}
fclose($out);
exit;
