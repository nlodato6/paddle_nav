from django.urls import path
from .views import Alllocations, EditLocation,CreateLocation,FavoriteLocation, UnfavoriteLocation, DeleteLocation, CreateComment, DeleteComment

urlpatterns = [
    # Currently only takes GET requests
    path('', Alllocations.as_view(), name='all_locations'),
    path('locations/create/', CreateLocation.as_view(), name='create_location'),
    path('locations/<int:pk>/edit/', EditLocation.as_view(), name='edit_location'),
    path('locations/<int:pk>/favorite/', FavoriteLocation.as_view(), name='favorite-location'),
    path('locations/<int:pk>/unfavorite/', UnfavoriteLocation.as_view(), name='unfavorite-location'),
    path('locations/<int:pk>/delete/', DeleteLocation.as_view(), name='delete-location'),
    path('locations/<int:pk>/comments/create/', CreateComment.as_view(), name='create-comment'),
    path('comments/<int:pk>/delete/', DeleteComment.as_view(), name='delete-comment'),
]
