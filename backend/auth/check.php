<?php
require_once __DIR__ . '/../config.php';
jsonResponse([
	'success' => !empty($_SESSION['admin_id']),
	'admin' => !empty($_SESSION['admin_id']) ? [ 'id' => $_SESSION['admin_id'], 'name' => $_SESSION['admin_name'] ] : null
]);
