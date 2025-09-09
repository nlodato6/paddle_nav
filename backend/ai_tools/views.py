from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings

from .services.tides import get_tide_data, summarize_tides
from .services.water_quality import get_water_atlas_data, summarize_water_atlas
from .services.currents import get_currents_data,summarize_currents

from .gemini_service import generate_text_from_prompt

class GeminiTextGenerate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        prompt = request.data.get("prompt") 
        user_message = request.data.get("user_message")

        if not prompt:
            return Response({"error": "Prompt is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            generated_text = generate_text_from_prompt(prompt, user_message=user_message)
            return Response({"response": generated_text}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    

class TideData(APIView):
    """
    APIView to get Tide data from NOAA API
    """

    def get(self, request):
        #station_id, begin_date, end_date will need to be user input but defaulted to clearwater and today.
        station_id = request.query_params.get("station_id", "8726520")  # Default to Clearwater, FL
        begin_date = request.data.get("begin_date", "today")
        end_date = request.data.get("end_date", begin_date)
        data = get_tide_data(station_id, begin_date, end_date)
        
        if "error" in data:
            return Response({"error": data["error"]}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response(data, status=status.HTTP_200_OK)
    
    def post(self, request):
        """
        Returns the Gemini summary of tides data
        """
        station_id = request.data.get("station_id")
        begin_date = request.data.get("begin_date", "today")  # default to today
        end_date = request.data.get("end_date")

        if not station_id:
            return Response(
                {"error": "Missing 'station_id' in request body."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            summary = summarize_tides(station_id, begin_date, end_date)
            return Response({"station_id": station_id, "begin_date": begin_date, "end_date": end_date, "summary": summary}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class CurrentsData(APIView):
    """
    APIView to get Currents data from NOAA API
    """
    def get(self, request):
        pass
        """
        Returns raw currents data for a given station and date.
        """
        station_id = request.query_params.get("station_id")

        begin_date = request.query_params.get("begin_date", "today")
        end_date = request.query_params.get("end_date", begin_date)
        data = get_currents_data(station_id, begin_date, end_date)
        
        if "error" in data:
            return Response({"error": data["error"]}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        return Response(data, status=status.HTTP_200_OK)
    
    def post(self, request):
        """
        Returns the Gemini summary of currents data
        """
        station_id = request.data.get("station_id")
        date = request.data.get("date", "today")  # default to today

        if not station_id:
            return Response(
                {"error": "Missing 'station_id' in request body."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            summary = summarize_currents(station_id, date)
            return Response({"station_id": station_id, "date": date, "summary": summary}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class WaterAtlasData(APIView):
    def get(self, request):

        station_id = request.query_params.get("station_id", "8726520")  # Default to Clearwater, FL
        data = get_water_atlas_data(station_id)
        
        if "error" in data:
            return Response({"error": data["error"]}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response(data, status=status.HTTP_200_OK)
     
    def post(self, request):
        """
        Returns the Gemini summary of water atlas data.
        """
        station_id = request.data.get("station_id")
      
        if not station_id:
            return Response(
                {"error": "Missing 'station_id' in request body."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            summary = summarize_water_atlas(station_id)
            return Response({"station_id": station_id, "summary": summary}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )



class WeatherData(APIView):
    """ DOES NOT WORK"""
    def get():
        """
        fetch and process weather data using the Weather API client.
        """
        pass
        
    def post(self, request):
        """
        Returns a Gemini summary of the provided 7-day weather forecast.
        """
        pass
        