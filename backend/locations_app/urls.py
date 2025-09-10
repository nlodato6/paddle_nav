from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    Alllocations,
    EditLocation,
    CreateLocation,
    FavoriteLocation,
    UnfavoriteLocation,
    DeleteLocation,
    CreateComment,
    DeleteComment,
    LocationDetail,
    UserFavoriteListView,
    LocationCategoryViewSet,
    RecreationTypeViewSet,
)

router = DefaultRouter()
router.register(r"categories", LocationCategoryViewSet)
router.register(r"recreation-types", RecreationTypeViewSet)

urlpatterns = [
    # Currently only takes GET requests
    path("db/", include(router.urls)),

    path('', Alllocations.as_view(), name='all_locations'),
    path('locations/create/', CreateLocation.as_view(), name='create_location'),
    path('locations/<int:pk>/', LocationDetail.as_view(), name='selected-locations'),
    path('locations/<int:pk>/edit/', EditLocation.as_view(), name='edit_location'),
    path('locations/<int:pk>/delete/', DeleteLocation.as_view(), name='delete-location'),

    path('locations/<int:pk>/favorite/', FavoriteLocation.as_view(), name='favorite_location'),
    path('locations/api_favorite/', FavoriteLocation.as_view(), name='favorite_official_location'),
    path('locations/<int:pk>/unfavorite/', UnfavoriteLocation.as_view(), name='unfavorite-location'),
    path('locations/<int:pk>/comments/create/', CreateComment.as_view(), name='create-comment'),
    path('comments/<int:pk>/delete/', DeleteComment.as_view(), name='delete-comment'),

    path('locations/favorites/', UserFavoriteListView.as_view(), name='user-favorites'),

]
