import json
import requests

MDAPI_URL = "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=met"

def fetch_met_stations():
    resp = requests.get(MDAPI_URL)
    resp.raise_for_status()
    data = resp.json()
    return data.get("stations", []) or data.get("stationList", [])

def generate_sql(stations):
    values = []
    for s in stations:
        if s.get("state") == "FL":
            sid = s.get("id")
            name = s.get("name", "").replace("'", "''")
            lat = s.get("lat") or 0
            lng = s.get("lng") or 0
            aff = (s.get("affiliations") or "").replace("'", "''")
            tidal = 1 if s.get("tidal") else 0
            greatlakes = 1 if s.get("greatlakes") else 0

            values.append(
                f"('{sid}', '{name}', 'FL', {lat}, {lng}, '{aff}', {tidal}, {greatlakes})"
            )

    if not values:
        return "-- No Florida stations found"

    sql = f"""INSERT INTO locations_app_metstation (
    station_id, name, state, lat, lng, affiliations, tidal, greatlakes
) VALUES
{",\n".join(values)}
ON CONFLICT (station_id) DO UPDATE SET
    name = EXCLUDED.name,
    state = EXCLUDED.state,
    lat = EXCLUDED.lat,
    lng = EXCLUDED.lng,
    affiliations = EXCLUDED.affiliations,
    tidal = EXCLUDED.tidal,
    greatlakes = EXCLUDED.greatlakes;"""
    return sql


if __name__ == "__main__":
    stations = fetch_met_stations()
    sql = generate_sql(stations)
    print(sql)
