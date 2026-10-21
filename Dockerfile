# 1. Build du front (Vite + pré-rendu)
FROM node:22-alpine AS front
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Dépendances PHP (PHPMailer)
FROM composer:2 AS vendor
WORKDIR /app
COPY api/composer.json api/composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# 3. Image finale : Apache + PHP
FROM php:8.3-apache
RUN a2enmod headers rewrite
COPY docker/apache-site.conf /etc/apache2/conf-enabled/site.conf
COPY --from=front /app/dist/ /var/www/html/
COPY api/public/ /var/www/api/public/
COPY api/src/ /var/www/api/src/
COPY --from=vendor /app/vendor/ /var/www/api/vendor/
EXPOSE 80
