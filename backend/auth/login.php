<?php
require_once __DIR__ . '/../config.php';

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';
if (!$username || !$password) jsonResponse(['success'=>false,'message'=>'Identifiants requis'], 400);

$q = http_build_query([
	'username' => 'eq.' . $username,
	'limit' => 1,
	'select' => 'id,username,full_name,hashed_password'
]);
$res = supabaseRequest('admins', 'GET', null, $q);
if ($res['error']) jsonResponse(['success'=>false,'message'=>'Erreur serveur'], 500);
$admin = $res['data'][0] ?? null;
if (!$admin) jsonResponse(['success'=>false,'message'=>'Utilisateur introuvable'], 404);

$hash = $admin['hashed_password'] ?? '';
if (!$hash || !password_verify($password, $hash)) {
	jsonResponse(['success'=>false,'message'=>'Mot de passe invalide'], 401);
}

$_SESSION['admin_id'] = $admin['id'];
$_SESSION['admin_name'] = $admin['full_name'] ?: $admin['username'];

jsonResponse(['success'=>true,'admin'=>['id'=>$admin['id'],'name'=>$_SESSION['admin_name']]]);
