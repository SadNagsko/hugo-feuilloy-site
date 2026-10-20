# API contact

Reçoit le formulaire de contact du site et l'envoie par email via le SMTP Gmail (PHPMailer).

## Déploiement sur le VPS

1. Copier ce dossier `api/` sur le serveur, par exemple dans `/var/www/hugofeuilloy/api`.
2. Installer les dépendances : `composer install --no-dev --optimize-autoloader`
3. Créer `api/.env` à partir de `.env.example` et le remplir (voir ci-dessous), puis `chmod 600 .env`.
4. Exposer uniquement `api/public/` sous `/api` dans le VirtualHost Apache du site :

   ```apache
   Alias /api /var/www/hugofeuilloy/api/public
   <Directory /var/www/hugofeuilloy/api/public>
       Require all granted
       Options -Indexes
   </Directory>
   ```

   Le `.env` et `vendor/` restent hors de la racine web.

## Mot de passe d'application Gmail

Compte Google → Sécurité → Validation en deux étapes (doit être activée) → Mots de passe des applications.
Créer un mot de passe nommé « hugofeuilloy.fr » et le coller dans `SMTP_PASS`. `SMTP_USER` est l'adresse Gmail.

## Test

```bash
curl -i -X POST https://hugofeuilloy.fr/api/contact.php \
  -H "Origin: https://hugofeuilloy.fr" -H "Content-Type: application/json" \
  -d '{"nom":"Test","email":"test@exemple.fr","message":"Test du formulaire"}'
```

Réponse attendue : `{"ok":true}` et un email dans la boîte de réception.
