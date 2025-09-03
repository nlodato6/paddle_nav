#!/bin/bash

# These environment variables are consumed by the docker-compose file.
# We can supply explicit defaults that are checked in with source code 
# since they are only used for local development.

docker compose -f docker-compose.dev.yml up -d --build

# make sure the postgres container is ready, then run migrations
sleep 10 
docker exec docker-compose-app2-api-1  python /src/manage.py makemigrations 
docker exec docker-compose-app2-api-1  python /src/manage.py migrate