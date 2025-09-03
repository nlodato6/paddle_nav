import requests
from datetime import datetime
from ai_tools.gemini_service import generate_text_from_prompt


def normalize_date_string(date_str):
    if date_str == "today":
        return datetime.now().strftime("%Y%m%d")
    return date_str


def get_tide_data(station_id, begin_date, end_date):
    begin_date = normalize_date_string(begin_date)
    end_date = normalize_date_string(end_date) if end_date else begin_date

    url = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter"

    params = {
        "station": station_id,
        "product": "predictions",
        "datum": "MLLW",
        "units": "english",
        "time_zone": "lst_ldt",
        "format": "json",
        "interval": "hilo",
        "begin_date": begin_date,
        "end_date": end_date,
    }

    response = requests.get(url, params=params, timeout=10)

    try:
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        raise Exception(f"NOAA API error: {e}\nURL: {response.url}")

    return response.json()


def parse_tide_data(raw_data):
    predictions = raw_data.get("predictions", [])

    result = []
    for entry in predictions:
        entry_time = datetime.strptime(entry["t"], "%Y-%m-%d %H:%M")
        # if entry_time.date() == target:
        result.append({
            "time": entry_time,
            "value": float(entry["v"]),
            "type": entry["type"]
        })
    return result


def summarize_tides(station_id, begin_date, end_date):
    normalized_begin_date = normalize_date_string(begin_date)
    normalized_end_date = normalize_date_string(end_date)

    raw_data = get_tide_data(station_id, normalized_begin_date, normalized_end_date)
    parsed_data = parse_tide_data(raw_data)

    if not parsed_data:
        return f"No tide predictions available for {begin_date} {end_date}."

    formatted = []
    for entry in parsed_data:
        tide_type = "High Tide" if entry["type"] == "H" else "Low Tide"
        time_str = entry["time"].strftime("%I:%M %p")
        height = round(entry["value"], 2)
        formatted.append(f"* {tide_type} at {time_str}, Height: {height} ft")

    tide_text = "\n".join(formatted)

    prompt = (
        f"Here is tide data for {begin_date} to {end_date}:\n\n"
        f"{tide_text}\n\n"
        f"Please summarize the high and low tides with times and heights."
        f" Please return all the high and lows tides with height and time."
    )

    return generate_text_from_prompt(prompt)
