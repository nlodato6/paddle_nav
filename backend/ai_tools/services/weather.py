import requests
from django.shortcuts import render
from ai_tools.gemini_service import generate_text_from_prompt


def get_weather_data(latitude, longitude, forecast_days=7):
    """
    Fetch a multi-day weather forecast from the Open-Meteo API.
    """
    api_url = "https://api.open-meteo.com/v1/forecast"
    
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "precipitation_sum"],
        "timezone": "auto",
        "forecast_days": forecast_days
    }
    
    try:
        response = requests.get(api_url, params=params, timeout=10)
        response.raise_for_status()  # Raises an exception for bad responses
        return response.json()
    except requests.exceptions.RequestException as e:
        raise requests.exceptions.RequestException(f"Error fetching weather data: {e}\nURL: {response.url}")


def parse_weather_data(response):
    """
    Parse the raw JSON weather data into a more usable list of dictionaries.

    Args:
        response (dict): The raw JSON response from the get_weather_data function.

    Returns:
        list: A list of dictionaries, where each dictionary represents a single day's forecast.
    """
    parsed_forecast = []
    if 'daily' in response:
        daily_data = response['daily']
        for i in range(len(daily_data['time'])):
            day_data = {
                "date": daily_data['time'][i],
                "max_temp": daily_data['temperature_2m_max'][i],
                "min_temp": daily_data['temperature_2m_min'][i],
                "weather_code": daily_data['weather_code'][i],
                "precipitation": daily_data['precipitation_sum'][i]
            }
            parsed_forecast.append(day_data)
            
    return parsed_forecast


def summarize_weather(latitude, longitude):
    """
    Fetches weather data, parses it, and generates a Gemini-powered summary.

    Args:
        latitude (float): The latitude for the location.
        longitude (float): The longitude for the location.
    
    Returns:
        str: A summary of the weather forecast from a text generation model.
    """
    try:
        raw_data = get_weather_data(latitude, longitude)
        parsed_data = parse_weather_data(raw_data)
        
        if not parsed_data:
            return "No weather forecast data was found for this location."

        # Format the parsed data into a string for the prompt
        formatted_forecast = []
        for day in parsed_data:
            formatted_forecast.append(f"Date: {day['date']}, Max Temp: {day['max_temp']}°C, Min Temp: {day['min_temp']}°C, Weather Code: {day['weather_code']}, Precipitation: {day['precipitation']}mm")

        weather_text = "\n".join(formatted_forecast)
        
        prompt = (
            f"Here is a 7-day weather forecast:\n\n"
            f"{weather_text}\n\n"
            f"Please provide a concise and easy-to-read summary of the weather. "
            f"Highlight key trends like temperature changes and precipitation, "
            f"and mention the overall weather outlook for the week."
        )
        
        return generate_text_from_prompt(prompt)

    except requests.exceptions.RequestException as e:
        return f"An error occurred: {e}"

# Example usage
if __name__ == '__main__':
    # Using the location from your original code
    lat = 52.52
    lon = 13.41

    print("Fetching and summarizing weather data...")
    summary = summarize_weather(lat, lon)
    print("\n--- Final Summary ---")
    print(summary)