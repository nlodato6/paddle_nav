from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .gemini_service import generate_text_from_prompt
from .services.tides import get_tide_data

class GeminiTextGenerate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        prompt = request.data.get("prompt")
        if not prompt:
            return Response({"error": "Prompt is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            generated_text = generate_text_from_prompt(prompt)
            return Response({"response": generated_text}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class TideData(APIView):
    """
    APIView to get Tide data from NOAA API
    """

    def get(self, request):
        station_id = request.query_params.get("station_id", "8726520")  # Default to Clearwater, FL
        data = get_tide_data(station_id)
        
        if "error" in data:
            return Response({"error": data["error"]}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response(data, status=status.HTTP_200_OK)