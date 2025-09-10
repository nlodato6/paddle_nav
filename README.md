### PaddleNav: Geolocation and Account Management System

### Project Overview
PaddleNav is a full-stack web application designed to manage and display locations with a focus on geographic data. The application consists of a React frontend, a Django backend API, a PostGIS database, and an Nginx reverse proxy, all orchestrated with Docker Compose for a seamless development and deployment experience.

### Features
User Accounts: Secure user registration and authentication.

Location Management: A full-featured API for creating, viewing, and managing locations.

Favorites System: Users can mark locations as favorites.

Geographic Data: Utilizes PostGIS to store and query spatial data efficiently.

Dockerized Environment: The entire application stack runs inside isolated containers, ensuring a consistent environment across different machines.

Single Entry Point: An Nginx reverse proxy acts as the single point of contact, serving both the frontend and routing API requests to the backend, which prevents CORS issues.

### Step 2: Run the Project
The project includes a run-compose-dev.sh script to automate the setup process. This script will build the Docker images, start the containers, run database migrations, and launch the frontend development server.

1. Make the script executable: Before you can run the script, you need to give it execute permissions.  Open a terminal in the project's root directory and run:

    chmod +x run-compose-dev.sh

This command modifies the file's permissions, making it runnable as a program.

2. Execute the script:

    ./run-compose-dev.sh

### What the run-compose-dev.sh Script Does
This single script automates the entire project setup, saving you from running multiple commands manually.

1. docker compose -f docker-compose.dev.yml up -d --build: This command reads the docker-compose.dev.yml file, which defines your services, networks, and volumes. It builds the necessary Docker images and starts all services (the Django API, the PostgreSQL database, and Nginx) in detached mode (-d). The --build flag ensures that the images are rebuilt if any changes have been made to the Dockerfiles.

2. sleep 10: This is a critical step. It introduces a 10-second pause to give the PostgreSQL database container sufficient time to fully initialize and become ready for connections.

3. docker exec paddle_nav-api-1 python /src/manage.py makemigrations and docker exec paddle_nav-api-1 python /src/manage.py migrate: These commands run Django's database migration commands directly inside the api container. This ensures your database schema is up-to-date with your application's models.

4. cd ./frontend and npm run dev: The script navigates to the frontend directory and then runs the dev script defined in your package.json file. This starts the frontend's development server, typically powered by a tool like Vite.

### Usage
Once all services are running, you can access the application at the following URLs:

Frontend: Navigate to http://localhost in your web browser.

Backend API: The API is exposed through the Nginx reverse proxy at http://localhost/api/. You can test endpoints like http://localhost/api/fsp/ from your browser or a tool like Postman.

### File Structure
./: Root directory containing docker-compose.dev.yml and the run-compose-dev.sh script.

backend/: Django backend source code.

frontend/: React frontend source code.

webserver/: Nginx configuration.

### Technology Stack
Frontend: React, Vite

Backend: Django, Django Rest Framework, PostGIS

Database: PostgreSQL (PostGIS)

Containerization: Docker, Docker Compose

Web Server: Nginx

API Communication: Axios