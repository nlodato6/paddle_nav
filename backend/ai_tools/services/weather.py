import requests
from django.shortcuts import render


def weather_view(request):
    # Latitude and longitude for a location, e.g., Berlin, Germany
    latitude = 52.52
    longitude = 13.41

    # API endpoint and parameters
    api_url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": ["temperature_2m", "relative_humidity_2m"],
    }
    
    # Make the API request
    response = requests.get(api_url, params=params)
    data = response.json()

    # Pass data to the template
    context = {
        'forecast_data': data
    }

    return render(request, 'your_app/weather_template.html', context)