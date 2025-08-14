<?php
// Config backend - Amado Shop
// Renseignez vos valeurs Supabase
$SUPABASE_URL = getenv('SUPABASE_URL') ?: 'https://ygltzdwmvycdtvzghzmb.supabase.co';
$SUPABASE_KEY = getenv('SUPABASE_SERVICE_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnbHR6ZHdtdnljZHR2emdoem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTAxNjcsImV4cCI6MjA3MDIyNjE2N30.7ZJlA9u20UPPOEbT-n3ECMGCKtfILdSKzC2LfR6S8YM';

if (session_status() === PHP_SESSION_NONE) { session_start(); }

function supabaseRequest($path, $method = 'GET', $body = null, $query = '') {
	global $SUPABASE_URL, $SUPABASE_KEY;
	$ch = curl_init();
	$url = rtrim($SUPABASE_URL, '/') . '/rest/v1/' . ltrim($path, '/');
	if ($query) { $url .= (strpos($url, '?') === false ? '?' : '&') . $query; }
	$headers = [
		'Content-Type: application/json',
		'apikey: ' . $SUPABASE_KEY,
		'Authorization: Bearer ' . $SUPABASE_KEY,
		'Prefer: return=representation'
	];
	curl_setopt_array($ch, [
		CURLOPT_URL => $url,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_CUSTOMREQUEST => $method,
		CURLOPT_HTTPHEADER => $headers,
	]);
	if ($body !== null) {
		curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($body) ? $body : json_encode($body));
	}
	$response = curl_exec($ch);
	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	$error = curl_error($ch);
	curl_close($ch);
	return [ 'code' => $httpCode, 'data' => $response ? json_decode($response, true) : null, 'error' => $error ];
}

function jsonResponse($payload, $status = 200) {
	http_response_code($status);
	header('Content-Type: application/json');
	echo json_encode($payload);
	exit;
}

function requireAdmin() {
	if (empty($_SESSION['admin_id'])) {
		jsonResponse([ 'success' => false, 'message' => 'Non autorisé' ], 401);
	}
}
