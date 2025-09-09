import requests
from django.conf import settings

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

def generate_text_from_prompt(prompt, user_message=None):

    api_key = settings.GEMINI_API_KEY
    headers = {
        "Content-Type": "application/json"
    }

    full_prompt = prompt
    
    if user_message:
        full_prompt += f"\nUser: {user_message}"

    payload = {
        "contents": [
            {
                "parts": [{"text": full_prompt}]
            }
        ]
    }

    response = requests.post(
        f"{GEMINI_API_URL}?key={api_key}",
        headers=headers,
        json=payload,
        timeout=60
    )
    response.raise_for_status()
    data = response.json()
    
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        return "Could not parse response."
