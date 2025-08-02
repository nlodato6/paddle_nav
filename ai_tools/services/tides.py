import requests
from datetime import datetime

def get_tide_data(station_id="8726520"):
    url = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter"
    params = {
        "station": station_id,
        "product": "predictions",
        "datum": "MLLW",
        "units": "english",
        "time_zone": "lst_ldt",
        "format": "json",
        "interval": "hilo",
        "date": "today"
    }
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    return response.json()

