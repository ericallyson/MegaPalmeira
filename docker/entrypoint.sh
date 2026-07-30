#!/bin/sh
set -e

# Migrations e caches só fazem sentido no papel de aplicação web.
# Workers (queue/reverb/scheduler) só precisam dos caches.
if [ "${APP_ROLE:-web}" = "web" ]; then
    php artisan migrate --force
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
php artisan storage:link || true

exec "$@"
