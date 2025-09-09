# accounts.urls
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import SignupView, CurrentUserAPIView

urlpatterns = [
    path('get-token', obtain_auth_token),
    path('signup', SignupView.as_view()),
    path('me', CurrentUserAPIView.as_view(), name="current_user"),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
]