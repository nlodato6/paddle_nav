import requests
from datetime import datetime
from ai_tools.gemini_service import generate_text_from_prompt



def get_water_atlas_data(station_id="8726520"):
    """
    Fetch water quality data from Water Atlas.
    """

    url = "https://api.wateratlas.usf.edu/CoastalWaterQualityConcerns?s={station_id}"

    response = requests.get(url, timeout=10)

    try:
        response.raise_for_status()
        raw_data = response
    except requests.exceptions.HTTPError as e:
        raise Exception(f"Water Atlas API error: {e}\nURL: {response.url}")

    return response.json()


def parse_water_atlas_data(response):

    result = []
    for feature in response['features']:
       if 'properties' in feature:
            properties = feature['properties']
            
            characteristic = properties.get('characterstic')
            station = properties.get('latestStation')
            event_text_location = properties.get('eventTextLocation')
            sample_date = properties.get('latestSampleDate')
            event_description = properties.get('eventDescription')
            
            result.append({
                'characteristic': characteristic,
                'station': station,
                'event_text_location': event_text_location,
                'sample_date': sample_date,
                'event_description': event_description
            })
            
            
    return result

def summarize_water_atlas(station_id):
  
    raw_data = get_water_atlas_data(station_id) 
    parsed_data = parse_water_atlas_data(raw_data)

    if not parsed_data:
        return f"No water quality concerns found for station {station_id}."

    formatted = []
    for entry in parsed_data:
        characteristic = entry.get('characteristic', 'N/A')
        station = entry.get('station', 'N/A')
        event_text_location = entry.get('event_text_location', 'N/A')
        sample_date = entry.get('sample_date', 'N/A') 
        event_description = entry.get('event_description', 'No description provided')

        formatted.append(f"* **Characteristic:** {characteristic}")
        formatted.append(f"  **Station:** {station}")
        formatted.append(f" **Event Location:** {event_text_location}")
        formatted.append(f"  **Time of Latest Sample:** {sample_date}")
        formatted.append(f"  **Description:** {event_description}\n") 

    water_quality_concerns_text = "\n".join(formatted)
    
    prompt = (
        f"Here are water quality concerns for station {station_id}:\n\n"
        f"{water_quality_concerns_text}\n\n"
        f"Please summarize these water quality concerns. Include the characteristic, station, "
        f"latest sample time, and a brief description for each. "
        f"If there are multiple concerns, group them logically and highlight any significant issues."
    )
    print(prompt)
    return generate_text_from_prompt(prompt)