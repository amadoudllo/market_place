# Amado Shop - Boutique en ligne

Site e‑commerce moderne (HTML/CSS/Bootstrap/JS + PHP + MySQL) pour vente avec paiement à la livraison en Guinée.

## 🚀 Fonctionnalités

- **Frontend** : Interface moderne avec Bootstrap 5
- **Backend** : API PHP REST avec base de données MySQL
- **Gestion** : Panel admin pour produits et commandes
- **Paiement** : À la livraison (système local Guinée)

## 📁 Structure du projet

```
market_place/
├── assets/           # CSS, JS, images
├── backend/          # API PHP (MySQL)
├── admin/            # Interface d'administration
├── boutique.html     # Page des produits
├── commande.html     # Processus de commande
├── suivi-commande.html # Suivi des commandes
└── index.html        # Page d'accueil
```

## 🗄️ Base de données

- **Système** : MySQL avec phpMyAdmin
- **Tables** : `products`, `orders`, `order_items`, `admins`
- **Configuration** : `backend/database_config.php`

## ⚙️ Installation

### Prérequis

- Serveur web (Apache/Nginx) avec PHP 7.4+
- MySQL 5.7+ ou MariaDB 10.2+
- Extension PHP PDO MySQL

### Configuration

1. **Cloner le projet** dans votre dossier web
2. **Configurer la base de données** dans `backend/database_config.php`
3. **Lancer l'installation** : `php backend/install.php`
4. **Accéder à l'admin** : `/admin/` (admin/admin123)

### Variables de configuration

- `DB_HOST` : Hôte MySQL (localhost)
- `DB_NAME` : Nom de la base (amado_shop)
- `DB_USER` : Utilisateur MySQL
- `DB_PASS` : Mot de passe MySQL

## 🔧 Développement

Le projet utilise une architecture modulaire avec :

- **API REST** : Endpoints PHP pour CRUD
- **Sécurité** : Sessions PHP et hachage bcrypt
- **Responsive** : Design mobile-first avec Bootstrap

## 📝 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.
