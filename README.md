# Amado Shop

Site e‑commerce moderne (HTML/CSS/Bootstrap/JS + PHP + Supabase) pour vente avec paiement à la livraison en Guinée.

## Structure

- `index.html` (Accueil), `boutique.html`, `commande.html`, `suivi-commande.html`
- `admin/index.html` (login), `admin/dashboard.html`
- `assets/css` styles, `assets/js` scripts
- `backend/` endpoints PHP (Supabase REST)

## Prérequis

- PHP 8+ (avec cURL)
- Un projet Supabase (tables: `products`, `orders`, `order_items`, `admins`)

## Configuration

Éditer `backend/config.php` et renseigner:

- `SUPABASE_URL`: URL de votre projet
- `SUPABASE_SERVICE_KEY`: Service Role Key (à conserver côté serveur)

Dans les scripts JS, remplacez le numéro WhatsApp `+224123456789`.

## Lancement local

Sous Windows PowerShell:

```
php -S 127.0.0.1:8080 -t .
```

Puis ouvrez `http://127.0.0.1:8080/`.

## Endpoints clés

- `backend/products/list.php` (liste produits + filtres)
- `backend/orders/create.php` (création commande)
- `backend/orders/track.php` (suivi commande)
- `backend/auth/login.php`, `auth/check.php`, `auth/logout.php`
- `backend/orders/list.php` (admin), `backend/stats/overview.php`, `backend/export/orders_csv.php`

## Sécurité

Les endpoints admin exigent une session via `requireAdmin()`.
Servez le site derrière un serveur web (Apache/Nginx) et gardez la Service Key côté serveur uniquement.
