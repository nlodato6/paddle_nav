#!/bin/sh

# Build and start containers using production compose file
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# make sure the postgres container is ready, then run migrations
sleep 10
docker-compose -f docker-compose.prod.yml exec api python manage.py makemigrations
docker-compose -f docker-compose.prod.yml exec api python manage.py migrate
