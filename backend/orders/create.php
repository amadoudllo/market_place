<?php
require_once __DIR__ . '/../config.php';

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$name = trim($input['customer_name'] ?? '');
$phone = trim($input['customer_phone'] ?? '');
$address = trim($input['customer_address'] ?? '');
$productName = trim($input['product_name'] ?? '');
$qty = max(1, intval($input['quantity'] ?? 1));
$price = max(0, intval($input['price'] ?? 0));
$notes = trim($input['notes'] ?? '');

if (!$name || !$phone || !$address || !$productName) {
	jsonResponse(['success'=>false,'message'=>'Champs requis manquants'], 400);
}

$orderNumber = 'AMS-' . date('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(2)),0,4));
$total = $qty * $price;

// Create order
$orderBody = [
	'order_number' => $orderNumber,
	'customer_name' => $name,
	'customer_phone' => $phone,
	'customer_address' => $address,
	'notes' => $notes,
	'total' => $total,
	'status' => 'pending'
];
$res = supabaseRequest('orders', 'POST', $orderBody);
if ($res['error'] || $res['code'] >= 400) jsonResponse(['success'=>false,'message'=>'Erreur création commande'], 500);
$order = $res['data'][0] ?? null;
if (!$order) jsonResponse(['success'=>false,'message'=>'Commande non créée'], 500);

// Create order item
$itemBody = [
	'order_id' => $order['id'],
	'name' => $productName,
	'price' => $price,
	'quantity' => $qty
];
$itemsRes = supabaseRequest('order_items', 'POST', $itemBody);

jsonResponse(['success'=>true,'order_number'=>$orderNumber]);
