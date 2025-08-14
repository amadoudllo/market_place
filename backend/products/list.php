<?php
require_once __DIR__ . '/../config.php';

$q = $_GET['q'] ?? '';
$category = $_GET['category'] ?? '';
$price = $_GET['price'] ?? '';
$sort = $_GET['sort'] ?? 'popular';
$page = max(1, intval($_GET['page'] ?? 1));
$pageSize = min(50, max(1, intval($_GET['pageSize'] ?? 12)));
$popular = isset($_GET['popular']) ? 1 : 0;

$params = [];
if ($q) { $params[] = 'name=ilike.' . rawurlencode('%' . $q . '%'); }
if ($category) { $params[] = 'category=eq.' . rawurlencode($category); }
if ($price) {
	if (substr($price, -1) === '+') { $params[] = 'price=gte.' . intval($price); }
	else {
		$parts = explode('-', $price); if (count($parts) === 2) {
			$params[] = 'price=gte.' . intval($parts[0]);
			$params[] = 'price=lte.' . intval($parts[1]);
		}
	}
}

$order = 'created_at.desc';
if ($sort === 'price-low') $order = 'price.asc';
if ($sort === 'price-high') $order = 'price.desc';
if ($sort === 'newest') $order = 'created_at.desc';

$rangeFrom = ($page - 1) * $pageSize;

$query = implode('&', $params);
$query .= ($query ? '&' : '') . 'order=' . $order;
$query .= '&select=id,name,price,category,image_url,description,sales_count,stock';

$result = supabaseRequest('products', 'GET', null, $query);
if ($result['error']) jsonResponse(['success'=>false,'message'=>'Erreur serveur'], 500);
$products = $result['data'] ?? [];

if ($popular) {
	usort($products, function($a,$b){ return ($b['sales_count'] ?? 0) <=> ($a['sales_count'] ?? 0); });
}

$total = count($products);
$productsPage = array_slice($products, $rangeFrom, $pageSize);

jsonResponse(['success'=>true,'products'=>$productsPage,'total'=>$total]);
