#!/bin/bash
echo "Deleting existing migration files..."
rm -rf advertisement_app/migrations
rm -rf car_app/migrations
rm -rf car_model_app/migrations
rm -rf user_app/migrations
rm -rf user_profile_app/migrations
echo "Existing migration files deleted."

sleep 5

docker compose up -d

sleep 5

echo "Creating new migrations for app..."
python3 manage.py makemigrations user_profile_app user_app advertisement_app car_app car_model_app

echo "Applying database migrations..."
python3 manage.py migrate

sleep 5

echo "Copying sql files to the container..."
docker cp ./init.sql backend-db-1:/tmp/init.sql
# docker cp ./script.sql cars_database-db-1:/tmp/script.sql
# docker cp ./delete_tables.sql cars_database-db-1:/tmp/delete_tables.sql

sleep 5

echo "Importing init.sql data to the database..."
docker exec -it backend-db-1 psql -h localhost -p 5432 -U postgres -d cars -f /tmp/init.sql

sleep 5

# echo "Running script.sql query in the database..."
# docker exec -it backend-db-1 psql -h localhost -p 5432 -U postgres -d cars_db -f /tmp/script.sql

# Execute the Django management command to load data
# Replace 'your_app' and 'your_fixture.json' with your actual values
# python3 manage.py loaddata fixtures/user_profiles.json
# python3 manage.py loaddata fixtures/users.json
# python3 manage.py loaddata fixtures/advertisements.json
# python3 manage.py loaddata fixtures/cars.json
# python3 manage.py loaddata fixtures/car_models.json

# echo "Running tests..."
# python3 manage.py test tests --debug-mode

# echo "Deleting tables..."
# echo "user_profile_app_userprofile table...";
# echo "user_app_appuser table...";
# echo "user_app_user table...";
# echo "advertisement_app_advertisement table...";
# echo "car_model_app_carmodel table...";
# echo "car_app_car table...";
# docker exec -it cars_database-db-1 psql -h localhost -p 5432 -U postgres -d cars_db -f /tmp/delete_tables.sql

# Deactivate the virtual environment (optional, but good practice if not staying in the venv)
# deactivate

echo "Django data loaded successfully."