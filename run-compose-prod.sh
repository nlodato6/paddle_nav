#!/bin/sh

# Build and start containers using production compose file
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

sleep 10
# make sure the postgres container is ready, then run migrations
echo "Creating new migrations for app..."
docker-compose -f docker-compose.prod.yml exec -T api python manage.py makemigrations

echo "Applying database migrations..."
docker-compose -f docker-compose.prod.yml exec -T api python manage.py migrate


# Echo "Copying sql files to the container..."
# docker cp ./backend/init.sql paddle_nav-db-1:/tmp/init.sql

# echo "Importing init.sql data to the database..."
# docker exec -it paddle_nav-db-1 psql -U postgres -d paddle_nav_db -f /tmp/init.sql
