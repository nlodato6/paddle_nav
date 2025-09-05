from django.urls import path
from .views import GeminiTextGenerate, TideData, CurrentsData, WaterAtlasData, WeatherData

urlpatterns = [
    path("generate/", GeminiTextGenerate.as_view(), name="gemini-generate"),
    path("tides/", TideData.as_view(), name="tide-data"),
    path('currents/', CurrentsData.as_view(), name='currents-data'),
    path('water_atlas/', WaterAtlasData.as_view(), name='water-atlas-data'),
    path('weather/', WeatherData.as_view(), name='weather-data')
    
]