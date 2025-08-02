from django.urls import path
from .views import GeminiTextGenerate, TideData

urlpatterns = [
    path("generate/", GeminiTextGenerate.as_view(), name="gemini-generate"),
    path("tides/", TideData.as_view(), name="tide-data"),
]
