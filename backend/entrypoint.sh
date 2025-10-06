#!/bin/sh
# python manage.py migrate --noinput
# python manage.py collectstatic --noinput
# exec "$@"

set -e

echo "Paveen"
echo "above line is env variable"

# Wait for Postgres (if you are using it)
if [ "$DB_HOST" != "" ]; then
  echo "Waiting for database $DB_HOST..."
  until nc -z "$DB_HOST" "$DB_PORT"; do
    sleep 1
  done
  echo "Database is up!"
fi

# Wait for Redis
if [ "$REDIS_HOST" != "" ]; then
  echo "Waiting for redis $REDIS_HOST..."
  until nc -z "$REDIS_HOST" 6379; do
    sleep 1
  done
  echo "Redis is up!"
fi

# Run migrations and collect static only in backend container
if [ "$DJANGO_ROLE" = "backend" ]; then
  echo "Applying database migrations..."
  python manage.py migrate --noinput

  echo "Collecting static files..."
  python manage.py collectstatic --noinput
fi

# For celery_beat, make sure scheduler tables exist
if [ "$DJANGO_ROLE" = "celery_beat" ]; then
  python manage.py migrate django_celery_beat --noinput
fi

# Execute the CMD from docker-compose
exec "$@"
