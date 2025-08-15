<?php
// Config backend - Amado Shop
// Configuration MySQL pour phpMyAdmin

// Inclure la configuration de la base de données
require_once __DIR__ . '/database_config.php';

// Utiliser les constantes de configuration ou les variables d'environnement
$DB_HOST = getenv('DB_HOST') ?: DB_HOST;
$DB_NAME = getenv('DB_NAME') ?: DB_NAME;
$DB_USER = getenv('DB_USER') ?: DB_USER;
$DB_PASS = getenv('DB_PASS') ?: DB_PASS;
$DB_PORT = getenv('DB_PORT') ?: DB_PORT;
$DB_CHARSET = getenv('DB_CHARSET') ?: DB_CHARSET;

if (session_status() === PHP_SESSION_NONE) { session_start(); }

// Connexion à la base de données MySQL
function getDBConnection() {
	global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS, $DB_PORT, $DB_CHARSET;
	try {
		$dsn = "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME;charset=$DB_CHARSET";
		$pdo = new PDO($dsn, $DB_USER, $DB_PASS, DB_OPTIONS);
		return $pdo;
	} catch (PDOException $e) {
		error_log("Erreur de connexion à la base de données: " . $e->getMessage());
		return null;
	}
}

// Fonction pour exécuter des requêtes MySQL (remplace supabaseRequest)
function mysqlRequest($table, $method = 'GET', $data = null, $where = '', $orderBy = '') {
	$pdo = getDBConnection();
	if (!$pdo) {
		return ['code' => 500, 'data' => null, 'error' => 'Erreur de connexion à la base de données'];
	}
	
	try {
		switch ($method) {
			case 'GET':
				$sql = "SELECT * FROM $table";
				if ($where) $sql .= " WHERE $where";
				if ($orderBy) $sql .= " ORDER BY $orderBy";
				
				$stmt = $pdo->prepare($sql);
				$stmt->execute();
				$result = $stmt->fetchAll();
				return ['code' => 200, 'data' => $result, 'error' => null];
				
			case 'POST':
				if (!$data) return ['code' => 400, 'data' => null, 'error' => 'Données manquantes'];
				
				$columns = implode(', ', array_keys($data));
				$placeholders = ':' . implode(', :', array_keys($data));
				$sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";
				
				$stmt = $pdo->prepare($sql);
				$stmt->execute($data);
				$id = $pdo->lastInsertId();
				return ['code' => 201, 'data' => ['id' => $id], 'error' => null];
				
			case 'PUT':
				if (!$data || !$where) return ['code' => 400, 'data' => null, 'error' => 'Données ou condition manquantes'];
				
				$setClause = implode(', ', array_map(fn($key) => "$key = :$key", array_keys($data)));
				$sql = "UPDATE $table SET $setClause WHERE $where";
				
				$stmt = $pdo->prepare($sql);
				$stmt->execute($data);
				return ['code' => 200, 'data' => ['affected_rows' => $stmt->rowCount()], 'error' => null];
				
			case 'DELETE':
				if (!$where) return ['code' => 400, 'data' => null, 'error' => 'Condition manquante'];
				
				$sql = "DELETE FROM $table WHERE $where";
				$stmt = $pdo->prepare($sql);
				$stmt->execute();
				return ['code' => 200, 'data' => ['affected_rows' => $stmt->rowCount()], 'error' => null];
				
			default:
				return ['code' => 400, 'data' => null, 'error' => 'Méthode non supportée'];
		}
	} catch (PDOException $e) {
		error_log("Erreur MySQL: " . $e->getMessage());
		return ['code' => 500, 'data' => null, 'error' => $e->getMessage()];
	}
}

// Alias pour la compatibilité avec l'ancien code
function supabaseRequest($path, $method = 'GET', $body = null, $query = '') {
	// Extraire le nom de la table du chemin
	$table = trim($path, '/');
	
	// Parser la query string pour extraire les conditions
	$where = '';
	$orderBy = '';
	if ($query) {
		parse_str($query, $params);
		if (isset($params['order'])) {
			$orderBy = $params['order'];
		}
		// Gérer les autres paramètres de requête si nécessaire
	}
	
	return mysqlRequest($table, $method, $body, $where, $orderBy);
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
