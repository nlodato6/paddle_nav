#!/bin/bash

# These environment variables are consumed by the docker-compose file.
# We can supply explicit defaults that are checked in with source code 
# since they are only used for local development.

docker compose -f docker-compose.dev.yml up -d --build

# make sure the postgres container is ready, then run migrations
Echo 'DB starting...'

sleep 10 

echo "Creating new migrations for app..."
docker exec paddle_nav-api-1  python /src/manage.py makemigrations

echo "Applying database migrations..."
docker exec paddle_nav-api-1  python /src/manage.py migrate

sleep 5

Echo 'Migrations made'

Echo "Copying sql files to the container..."
docker cp ./backend/init.sql paddle_nav-db-1:/tmp/init.sql

sleep 5

echo "Importing init.sql data to the database..."
docker exec -it paddle_nav-db-1 psql -U postgres -d paddle_nav_db -f /tmp/init.sql


sleep 5

Echo 'DB loaded'



#start frontend
Echo 'Starting Frontend'
cd ./frontend 

npm run dev