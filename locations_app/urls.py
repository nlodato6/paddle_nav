from django.urls import path
from .views import Alllocations

urlpatterns = [
    # Currently only takes GET requests
    path('', Alllocations.as_view(), name='all_locations')
]