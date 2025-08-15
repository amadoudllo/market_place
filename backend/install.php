<?php
/**
 * Script d'installation pour Amado Shop
 * Ce script crée la base de données et les tables nécessaires
 */

// Inclure la configuration
require_once __DIR__ . '/database_config.php';

echo "=== Installation d'Amado Shop ===\n\n";

try {
    // Connexion à MySQL sans spécifier de base de données
    $pdo = new PDO("mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=" . DB_CHARSET, DB_USER, DB_PASS, DB_OPTIONS);
    echo "✓ Connexion à MySQL réussie\n";
    
    // Créer la base de données si elle n'existe pas
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET " . DB_CHARSET . " COLLATE " . DB_CHARSET . "_unicode_ci");
    echo "✓ Base de données '" . DB_NAME . "' créée ou déjà existante\n";
    
    // Sélectionner la base de données
    $pdo->exec("USE `" . DB_NAME . "`");
    
    // Lire et exécuter le schéma SQL
    $schema = file_get_contents(__DIR__ . '/schema.sql');
    
    // Diviser le schéma en requêtes individuelles
    $queries = array_filter(array_map('trim', explode(';', $schema)));
    
    foreach ($queries as $query) {
        if (!empty($query) && !preg_match('/^(--|USE|CREATE DATABASE)/', $query)) {
            $pdo->exec($query);
        }
    }
    
    echo "✓ Tables créées avec succès\n";
    
    // Créer un utilisateur admin par défaut (mot de passe: admin123)
    $adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT IGNORE INTO admins (username, full_name, hashed_password) VALUES (?, ?, ?)");
    $stmt->execute(['admin', 'Administrateur', $adminPassword]);
    
    echo "✓ Utilisateur admin créé (username: admin, mot de passe: admin123)\n";
    
    // Créer un produit de test
    $stmt = $pdo->prepare("INSERT IGNORE INTO products (name, price, category, description, stock) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute(['Produit Test', 5000, 'Test', 'Description du produit test', 10]);
    
    echo "✓ Produit de test créé\n";
    
    echo "\n=== Installation terminée avec succès ! ===\n";
    echo "Vous pouvez maintenant accéder à votre boutique.\n";
    echo "Identifiants admin: admin / admin123\n";
    
} catch (PDOException $e) {
    echo "❌ Erreur lors de l'installation: " . $e->getMessage() . "\n";
    echo "\nVérifiez que:\n";
    echo "- MySQL est démarré\n";
    echo "- Les paramètres de connexion dans database_config.php sont corrects\n";
    echo "- L'utilisateur MySQL a les droits de création de base de données\n";
} catch (Exception $e) {
    echo "❌ Erreur inattendue: " . $e->getMessage() . "\n";
}
