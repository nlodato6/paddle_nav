#!/bin/bash

# # Define the path to your Django project and virtual environment
# DJANGO_PROJECT_DIR="."
# VENV_DIR="$DJANGO_PROJECT_DIR/venv" # Assuming 'venv' is inside your project

# # Check if the virtual environment exists
# if [ ! -d "$VENV_DIR" ]; then
#     echo "Error: Virtual environment not found at $VENV_DIR"

#     python -m venv venv
#     echo "Venv Created"

#     echo "Installing requirements.txt"
#     pip install -r requirements.txt
#     echo "Requirements installed"
# fi

# # Activate the virtual environment
# source "$VENV_DIR/bin/activate"

# Change to the Django project directory
# cd "$DJANGO_PROJECT_DIR" # This line is usually not needed if the script is run from the root

# echo "Deleting existing migration files..."
# rm -rf categories_app/migrations
# rm -rf posts_app/migrations
# echo "Existing migration files deleted."

docker compose up -d

sleep 5
# # pip3 install requests_oauthlib dotenv psycopg2

echo "Creating new migrations for app..."
# python manage.py makemigrations categories_app posts_app
docker exec assessment-4-api-1 python /src/manage.py makemigrations 


echo "Applying database migrations..."
# python manage.py migrate
docker exec assessment-4-api-1 python /src/manage.py migrate
sleep 3


# get into db
 docker exec -it backend-db-1 psql ih localhost -p 5432 -U postgres -d paddle_nav_db

# Execute the Django management command to load data
# Replace 'your_app' and 'your_fixture.json' with your actual values
# python manage.py loaddata fixtures/categories_data.json
docker exec assessment-4-api-1 python /src/manage.py loaddata fixtures/categories_data.json

# python manage.py loaddata fixtures/posts_data.json
docker exec assessment-4-api-1 python /src/manage.py loaddata fixtures/posts_data.json

# echo "Running tests..."
# # python3 manage.py test tests --debug-mode

# # Deactivate the virtual environment (optional, but good practice if not staying in the venv)
# # deactivate

echo "Django data loaded successfully."
echo "source venv/bin/activate"