<?php
require_once __DIR__ . '/../config.php';

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$orderNumber = $input['order_number'] ?? '';
$phone = $input['phone'] ?? '';
if (!$orderNumber || !$phone) jsonResponse(['success'=>false,'message'=>'Paramètres manquants'], 400);

$query = http_build_query([
	'order_number' => 'eq.' . $orderNumber,
	'customer_phone' => 'eq.' . $phone,
	'limit' => 1,
	'select' => 'id,order_number,status,total,customer_name,created_at'
]);
$res = supabaseRequest('orders', 'GET', null, $query);
if ($res['error']) jsonResponse(['success'=>false,'message'=>'Erreur serveur'], 500);
$order = $res['data'][0] ?? null;
if (!$order) jsonResponse(['success'=>false,'message'=>'Commande non trouvée'], 404);

// Fetch items
$itemsRes = supabaseRequest('order_items', 'GET', null, http_build_query([
	'order_id' => 'eq.' . $order['id'],
	'select' => 'product_id,name,price,quantity'
]));
$order['items'] = $itemsRes['data'] ?? [];

// Decorate
$statusLabels = [ 'pending' => 'En attente', 'processing' => 'En préparation', 'delivering' => 'En livraison', 'delivered' => 'Livré' ];
$order['status_label'] = $statusLabels[$order['status']] ?? $order['status'];
$order['created_at_text'] = date('d M Y - H:i', strtotime($order['created_at']));

jsonResponse(['success'=>true,'order'=>$order]);
