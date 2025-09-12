### PaddleNav Project

### Project Overview
PaddleNav is a full-stack web application designed to manage and display locations with a focus on geographic data. The application consists of a React frontend, a Django backend API, a PostGIS database, and an Nginx reverse proxy, all orchestrated with Docker Compose for a seamless development and deployment experience.

### Features
- Create, edit, and favorite recreation areas
- User authentication with token-based login
- Manage personal locations with CRUD functionality
- AI-powered floating chatbot (Google Gemini integration)
- Integration with official ArcGIS data and NOAA tide stations

### Technology Stack
Frontend: React, Vite

Backend: Django, Django Rest Framework, PostGIS

Database: PostgreSQL (PostGIS)

Containerization: Docker, Docker Compose

Web Server: Nginx

API Communication: Axios

### Internal API
Authentication

    POST /api/accounts/api-token-auth/ → Login and get token
        Body: { "username": "...", "password": "..." }
        Response: { "token": "..." }
        Token must be sent as Authorization: Token <your_token>

    POST /api/accounts/signup/ → Create a new user
        Body: { "username": "...", "email": "...", "password": "..." }

Locations

    GET /api/fsp/ → List all locations (DB + official data if stored)

    POST /api/fsp/locations/create/ → Create a new user location

    GET /api/fsp/locations/{id}/ → Get a location by ID (backend only)

    PUT /api/fsp/locations/{id}/edit/ → Update a location (full update)

    PATCH /api/fsp/locations/{id}/edit/ → Update a location (partial update)

    DELETE /api/fsp/locations/{id}/delete/ → Delete a user-created location

Favorites

    POST /api/fsp/locations/{id}/favorite/ → Favorite a DB location

    DELETE /api/fsp/locations/{id}/unfavorite/ → Unfavorite a DB location

    POST /api/fsp/locations/api_favorite/ → Favorite an official (API) location
        Body: { "OBJECTID": "...", "name": "..." }

    POST /api/fsp/locations/api_unfavorite/ → Unfavorite an official (API) location
        Body: { "OBJECTID": "..." }

    GET /api/fsp/locations/favorites/ → List user favorites

Database Tables

    GET /api/fsp/db/categories/ → List location categories

    GET /api/fsp/db/recreation-types/ → List recreation types

    ET /api/fsp/db/metstations/ → List metstations

AI Tools
    POST /api/ai_tools/generate/
        Body: { "prompt": "your text" }
        Returns AI-generated text using Gemini
    
    POST /api/ai_tools/tides/
        Body: { "station_id": "8726520", "begin_date": "20250807", "end_date": "20250807" }
        Returns Gemini-generated summary of NOAA tide data
    
    POST /api/ai_tools/water_atlas/
        Body: { "station_id": "8726520", "begin_date": "20250807", "end_date": "20250807" }
        Returns Gemini-generated summary of USF Water Atlas data

### Third-Party APIs

This project integrates with several external APIs to enrich functionality:

1. ArcGIS REST API (Florida State Parks Data)
    Provides official park and recreation area data.
    Endpoint: `https://ca.dep.state.fl.us/arcgis/rest/services/OpenData/PARKS_FORI/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`
    Supplies geometry, address, categories for official locations.
    These are marked as is_official_data=true in the database and cannot be edited.

2. Google Gemini API
    Powers the floating chatbot for AI-generated answers.
    Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
    Requires GEMINI_API_KEY in .env:
        GEMINI_API_KEY=your_api_key_here
    Accessed via Django proxy
        POST /api/ai_tools/generate/

3. NOAA Tides & Currents API (Optional)
    Provides real-time tide, current, and meteorological data.
    Endpoint: `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter`
    Integrated into the MetStation model for official NOAA monitoring stations.
    Example documentation: NOAA Tides & Currents API

4. USF Water Atlas Coastal Water Quality Concerns API
    Endpoint: `https://api.wateratlas.usf.edu/CoastalWaterQualityConcerns?s={station_id}`  
    Returns water quality concern data for a given monitoring station.  
    Example use case: Displaying environmental indicators and alerts associated with user-selected locations.

### Step 2: Run the Project
The project includes a run-compose-dev.sh script to automate the setup process. This script will build the Docker images, start the containers, run database migrations, and launch the frontend development server.

1. Make the script executable: Before you can run the script, you need to give it execute permissions.  Open a terminal in the project's root directory and run:

    chmod +x run-compose-dev.sh

This command modifies the file's permissions, making it runnable as a program.

2. Execute the script:

    ./run-compose-dev.sh

### What the run-compose-dev.sh Script Does
This single script automates the entire project setup, saving you from running multiple commands manually.

1. Start Docker services

    docker compose -f docker-compose.dev.yml up -d --build

    - Reads the docker-compose.dev.yml file to define services, networks, and volumes.
    - Builds the necessary Docker images and starts all services (the Django API, PostgreSQL database, and Nginx) in detached mode (-d).
    - The --build flag ensures that the images are rebuilt if any changes have been made to the Dockerfiles.

2. Wait for PostgreSQL to initialize

    sleep 10

    -Adds a 10-second pause to give the Postgres container enough time to fully start.

3. Apply Django migrations

    docker exec paddle_nav-api-1 python /src/manage.py makemigrations
    docker exec paddle_nav-api-1 python /src/manage.py migrate

    - Runs Django’s makemigrations and migrate inside the API container.
    - Ensures the database schema is up-to-date with the application models.

4. Load initial SQL seed data

    docker cp ./backend/init.sql paddle_nav-db-1:/tmp/init.sql
    docker exec -it paddle_nav-db-1 psql -U postgres -d paddle_nav_db -f /tmp/init.sql

    - Copies your init.sql seed file into the Postgres container.
    - Executes it against the paddle_nav_db database, preloading tables with initial data (categories, recreation types, stations, etc).

5. Start the frontend

    cd ./frontend
    npm install
    npm audit fix
    npm run dev

    - Installs frontend dependencies and applies quick fixes for known vulnerabilities.
    - Starts the frontend development server (Vite), making the app available at http://localhost:5173.

### Usage
Once all services are running, you can access the application at the following URLs:

Frontend: Navigate to http://localhost in your web browser.

Backend API: The API is exposed through the Nginx reverse proxy at http://localhost/api/. You can test endpoints like http://localhost/api/fsp/ from your browser or a tool like Postman.

### File Structure
./: Root directory containing docker-compose.dev.yml and the run-compose-dev.sh script.

backend/: Django backend source code.

frontend/: React frontend source code.

webserver/: Nginx configuration.

