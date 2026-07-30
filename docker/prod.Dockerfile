# syntax=docker/dockerfile:1

# ---------- 1. assets: build do front (Vite + SSR + PWA) ----------
FROM node:22-alpine AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY vite.config.ts tsconfig.json ./
COPY resources ./resources
COPY public ./public
RUN npm run build

# ---------- 2. vendor: dependências PHP sem dev ----------
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-scripts \
    --prefer-dist --optimize-autoloader --ignore-platform-reqs

# ---------- 3. app: PHP-FPM com o código pronto ----------
FROM php:8.3-fpm-alpine AS app
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo_mysql redis bcmath pcntl intl zip opcache gd

RUN { \
        echo 'opcache.enable=1'; \
        echo 'opcache.memory_consumption=192'; \
        echo 'opcache.max_accelerated_files=20000'; \
        echo 'opcache.validate_timestamps=0'; \
        echo 'memory_limit=256M'; \
    } > /usr/local/etc/php/conf.d/prod.ini

WORKDIR /var/www/html
COPY . .
COPY --from=vendor /app/vendor ./vendor
COPY --from=assets /app/public/build ./public/build
COPY --from=assets /app/public/sw.js ./public/sw.js
COPY --from=assets /app/bootstrap/ssr ./bootstrap/ssr

RUN php artisan package:discover --ansi \
    && chown -R www-data:www-data storage bootstrap/cache

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]

# ---------- 4. web: nginx servindo estáticos + fastcgi ----------
FROM nginx:1.27-alpine AS web
COPY --from=app /var/www/html/public /var/www/html/public
COPY docker/nginx/prod.conf /etc/nginx/conf.d/default.conf

# ---------- 5. ssr: Node rodando o bundle do Inertia ----------
FROM node:22-alpine AS ssr
WORKDIR /var/www/html
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=assets /app/bootstrap/ssr ./bootstrap/ssr
EXPOSE 13714
CMD ["node", "bootstrap/ssr/ssr.js"]
