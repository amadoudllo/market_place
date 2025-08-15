<?php
// Configuration de la base de données MySQL pour Amado Shop
// Modifiez ces valeurs selon votre configuration phpMyAdmin

// Hôte de la base de données (généralement localhost pour phpMyAdmin local)
define('DB_HOST', 'localhost');

// Nom de la base de données
define('DB_NAME', 'amado_shop');

// Nom d'utilisateur MySQL
define('DB_USER', 'root');

// Mot de passe MySQL
define('DB_PASS', '');

// Port MySQL (optionnel, par défaut 3306)
define('DB_PORT', '3306');

// Charset de la base de données
define('DB_CHARSET', 'utf8mb4');

// Options PDO supplémentaires
define('DB_OPTIONS', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
]);
