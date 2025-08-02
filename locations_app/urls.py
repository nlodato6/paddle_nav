from django.urls import path
from .views import Alllocations, EditLocation,CreateLocation

urlpatterns = [
    # Currently only takes GET requests
    path('', Alllocations.as_view(), name='all_locations'),
    path('locations/create/', CreateLocation.as_view(), name='create_location'),
    path('locations/<int:pk>/edit/', EditLocation.as_view(), name='edit_location'),
]