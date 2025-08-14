<?php
require_once __DIR__ . '/../config.php';
requireAdmin();

$page = max(1, intval($_GET['page'] ?? 1));
$pageSize = min(100, max(1, intval($_GET['pageSize'] ?? 20)));
$rangeFrom = ($page - 1) * $pageSize;

$res = supabaseRequest('orders', 'GET', null, 'order=created_at.desc&select=id,order_number,customer_name,total,status,created_at');
if ($res['error']) jsonResponse(['success'=>false,'message'=>'Erreur serveur'], 500);
$orders = $res['data'] ?? [];

foreach ($orders as &$o) {
	$o['items_count'] = 0;
}

$total = count($orders);
$ordersPage = array_slice($orders, $rangeFrom, $pageSize);

jsonResponse(['success'=>true,'orders'=>$ordersPage,'total'=>$total]);
