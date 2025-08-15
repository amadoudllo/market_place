<?php
/**
 * Script de test de connexion à la base de données MySQL
 * Utilisez ce script pour vérifier que votre configuration est correcte
 */

// Inclure la configuration
require_once __DIR__ . '/database_config.php';

echo "=== Test de connexion MySQL ===\n\n";

try {
    // Test de connexion à MySQL
    $pdo = new PDO("mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=" . DB_CHARSET, DB_USER, DB_PASS, DB_OPTIONS);
    echo "✓ Connexion à MySQL réussie\n";
    
    // Test de connexion à la base de données spécifique
    $pdo = new PDO("mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET, DB_USER, DB_PASS, DB_OPTIONS);
    echo "✓ Connexion à la base '" . DB_NAME . "' réussie\n";
    
    // Vérifier les tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "✓ Tables trouvées : " . implode(', ', $tables) . "\n";
    
    // Vérifier le nombre de produits
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM products");
    $productCount = $stmt->fetch()['count'];
    echo "✓ Nombre de produits : $productCount\n";
    
    // Vérifier le nombre d'admins
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM admins");
    $adminCount = $stmt->fetch()['count'];
    echo "✓ Nombre d'administrateurs : $adminCount\n";
    
    echo "\n=== Test de connexion réussi ! ===\n";
    echo "Votre configuration MySQL est correcte.\n";
    
} catch (PDOException $e) {
    echo "❌ Erreur de connexion : " . $e->getMessage() . "\n";
    echo "\nVérifiez que :\n";
    echo "- MySQL est démarré\n";
    echo "- Les paramètres dans database_config.php sont corrects\n";
    echo "- L'utilisateur a les droits d'accès\n";
    echo "- La base de données existe (lancez install.php si nécessaire)\n";
} catch (Exception $e) {
    echo "❌ Erreur inattendue : " . $e->getMessage() . "\n";
}
