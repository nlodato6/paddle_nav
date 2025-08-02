from django.urls import path
from .views import GeminiTextGenerateView

urlpatterns = [
    path("generate/", GeminiTextGenerateView.as_view(), name="gemini-generate"),
]
