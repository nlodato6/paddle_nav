from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from django.core.serializers import serialize
from django.contrib.gis.geos import Point
from django.db import transaction
from .serializers import RecreationAreaSerializer, LocationCategorySerializer, RecreationTypeSerializer
from .models import Comment, RecreationArea, LocationCategory, RecreationType


import json
import requests

from .models import RecreationArea, RecreationType, LocationCategory
from .serializers import RecreationAreaSerializer

RECREATION_MAPPING = {
    "S_USE_CANOE_KAYAK_TRAIL": "Canoe/Kayak Trail",
    "FW_CANOE_KAYAK_LAUNCHES": "Canoe/Kayak Launch",
    "SW_CANOE_KAYAK_LAUNCHES": "Canoe/Kayak Launch",
    "FRESHWATER_BOAT_RAMPS": "Boat Ramps",
    "SALTWATER_BOAT_RAMPS": "Boat Ramps",
    "FRESHWATER_BEACHES": "Beaches",
    "SALTWATER_BEACHES": "Beaches",
    "FRESHWATER_BEACH_LENGTH": "Beaches",
    "FRESHWATER_CATWALKS": "Catwalks",
    "SALTWATER_CATWALKS": "Catwalks",
    "FRESHWATER_PIERS": "Piers",
    "SALTWATER_PIERS": "Piers",
    "PARKING_AREAS": "Parking",
}

class Alllocations(APIView):
    """
    APIView to fetch all park locations from the external Florida State Parks API
    and combine with local database RecreationArea data.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        processed_data = []

        # 1. Fetch Florida Parks API data
        try:
            api_url = "https://ca.dep.state.fl.us/arcgis/rest/services/OpenData/PARKS_FORI/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
            api_response = requests.get(api_url, timeout=15)
            api_response.raise_for_status()
            arcgis_data = api_response.json()

            # The Florida Parks API returns a list of features under 'features' OR sometimes directly
            if isinstance(arcgis_data, dict) and 'features' in arcgis_data:
                api_features = arcgis_data['features']
            elif isinstance(arcgis_data, list):
                api_features = arcgis_data
            else:
                api_features = []

            for feature in api_features:
                attrs = feature.get('attributes', feature)

                #Map recreations_type
                recreation_categories = []
                for key, category in RECREATION_MAPPING.items():
                    if attrs.get(key):
                        recreation_categories.append(category)
                recreation_categories = list(set(recreation_categories))

                # Skip this location if no mapped recreation type exists
                if not recreation_categories:
                    continue 
            
                location_data = {
                    'id': attrs.get('ID'),
                    'name': attrs.get('SITE_NAME'),
                    'description': attrs.get('CATEGORY'),
                    'address': attrs.get('LOCATION') or attrs.get('LOCATION_ADDRESS'),
                    'city': attrs.get('LOCATION_CITY'),
                    'county': attrs.get('LOCATION_COUNTY'),
                    'state': attrs.get('LOCATION_STATE'),
                    'zip_code': attrs.get('LOCATION_ZIP'),
                    'latitude': attrs.get('DECIMAL_DEGREES_LAT'),
                    'longitude': attrs.get('DECIMAL_DEGREES_LONG'),
                    'geometry': feature.get('geometry'),
                    'is_official_data': True,
                    'OBJECTID': attrs.get('OBJECTID'),
                    'reports': attrs.get('REPORTS'),
                    'recreation_type': recreation_categories,
                }

                processed_data.append(location_data)
        except Exception as e:
            # If API fails, just log but continue to fetch DB data
            print(f"Florida Parks API error: {e}")

        # 2. Fetch DB RecreationArea data
        try:
            db_locations = RecreationArea.objects.all()
            for loc in db_locations:
                processed_data.append({
                    'id': loc.id,
                    'name': loc.name,
                    'description': loc.description,
                    'address': loc.address,
                    'city': loc.city,
                    'county': loc.county,
                    'state': loc.state,
                    'zip_code': loc.zip_code,
                    'latitude': loc.geom.y if loc.geom else None,
                    'longitude': loc.geom.x if loc.geom else None,
                    'geometry': {'x': loc.geom.x, 'y': loc.geom.y} if loc.geom else None,
                    'phone_number': loc.phone_number,
                    'is_official_data': loc.is_official_data,
                    'location_category': loc.location_category.name if loc.location_category else None,
                    'recreation_types': [rt.name for rt in loc.recreation_type.all()],
                    'submitted_by': loc.submitted_by.username if loc.submitted_by else None,
                    'favorited_by_count': loc.favorited_by.count(),
                    'date_added': loc.date_added.isoformat(),
                    'last_updated': loc.last_updated.isoformat(),
                })
        except Exception as e:
            return Response({"error": f"Failed to retrieve data from database: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(processed_data, status=status.HTTP_200_OK)

class LocationDetail(APIView):
    """
    APIView to retrieve a single RecreationArea instance by ID.
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
    
        location = get_object_or_404(RecreationArea, pk=pk)
        serializer = RecreationAreaSerializer(location)
        return Response(serializer.data)


class CreateLocation(APIView):
    """
    APIView that allows users to create new RecreationArea entries.
    The submitted location will be marked as non-official
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data.copy()

        longitude = data.get('longitude')
        latitude = data.get('latitude')

        if longitude and latitude:
            data['geom'] = Point(float(longitude), float(latitude))

        # data['submitted_by'] = request.user.id
        data['is_official_data'] = False 


        serializer = RecreationAreaSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Users editing locations
class EditLocation(APIView):
    """
    APIView that allows authenticated users to edit RecreationArea entries that they previously submitted.
    """
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        """Full Record Update"""
        
        location = get_object_or_404(RecreationArea, pk=pk)
        data = request.data.copy()
        
        # Create the Point object from the coordinates
        longitude = data.get('longitude')
        latitude = data.get('latitude')
        if longitude is None or latitude is None:
            return Response(
                {"error": "Longitude and latitude are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        data['geom'] = Point(float(longitude), float(latitude))

        # Can't edit official data or locations submitted by other users
        if location.is_official_data:
            raise PermissionDenied("You can't edit official data.")
        if location.submitted_by != request.user:
            raise PermissionDenied("You can only edit locations you submitted.")

        # This is the corrected line: Pass the modified 'data' dictionary to the serializer.
        serializer = RecreationAreaSerializer(location, data=data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """ Partial Record Update """
        location = get_object_or_404(RecreationArea, pk=pk)
        
        
        serializer = RecreationAreaSerializer(location, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteLocation(APIView):
    """
    APIView that allows ed users to delete RecreationArea entries
    that they previously submitted.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            location = get_object_or_404(RecreationArea, pk=pk)
        except RecreationArea.DoesNotExist:
            return Response({"error": "Location not found."}, status=status.HTTP_404_NOT_FOUND)

        # Can not delete Official data 
        if location.is_official_data:
            raise PermissionDenied("You can't delete official data.")

        # Users can only delete their OWN submissions
        if location.submitted_by != request.user:
            raise PermissionDenied("You can only delete locations you submitted.")

        location.delete()
        
        return Response({"message": "Location deleted successfully."}, status=status.HTTP_200_OK)
    

class FavoriteLocation(APIView):
    """
    API view to favorite a RecreationArea, either from local DB or external API.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk=None):
        user = request.user
        OBJECTID = request.data.get("OBJECTID")

        if not pk and not OBJECTID:
            return Response(
                {"error": "Either pk or OBJECTID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        location = None

        # Case 1: Favoriting by DB primary key
        if pk:
            location = get_object_or_404(RecreationArea, pk=pk)

        # Case 2: Favoriting by external API OBJECTID
        elif OBJECTID:
            location = RecreationArea.objects.filter(OBJECTID=OBJECTID).first()
            if not location:
                # fetch from API and store locally if not exists
                try:
                    api_url = (
                        f"https://ca.dep.state.fl.us/arcgis/rest/services/"
                        f"OpenData/PARKS_FORI/MapServer/0/query?where=OBJECTID={OBJECTID}"
                        "&outFields=*&outSR=4326&f=json"
                    )
                    api_response = requests.get(api_url, timeout=15)
                    api_response.raise_for_status()
                    arcgis_data = api_response.json()

                    features = arcgis_data.get("features")
                    if not features:
                        return Response(
                            {"error": "Official location not found."},
                            status=status.HTTP_404_NOT_FOUND
                        )

                    feature = features[0]
                    attrs = feature.get("attributes", {})
                    geometry = feature.get("geometry", {})

                    location = RecreationArea.objects.create(
                        OBJECTID=OBJECTID,
                        name=attrs.get("SITE_NAME", "Unnamed Location"),
                        description=attrs.get("DESCRIPTION") or "",
                        address=attrs.get("LOCATION") or "",
                        city=attrs.get("COUNTY") or "",
                        state="FL",
                        zip_code=attrs.get("ZIPCODE"),
                        phone_number=attrs.get("PHONE"),
                        geom=Point(geometry["x"], geometry["y"]) if geometry else None,
                        is_official_data=True,
                    )

                except requests.RequestException as e:
                    return Response(
                        {"error": f"Failed to fetch official location data: {e}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

        # Add to favorites
        if not location.favorited_by.filter(id=user.id).exists():
            location.favorited_by.add(user)
            message = "Location added to favorites."
            code = status.HTTP_201_CREATED
        else:
            message = "Location already in favorites."
            code = status.HTTP_200_OK

        return Response({"message": message}, status=code)

class UnfavoriteLocation(APIView):
    """
    API view to unfavorite a RecreationArea.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        user = request.user
        location = get_object_or_404(RecreationArea, pk=pk)

        if location.favorited_by.filter(id=user.id).exists():
            location.favorited_by.remove(user)
            serializer = RecreationAreaSerializer(location, context={'request': request})
            return Response({"message": "Location removed from favorites.", "location": serializer.data},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "Location was not in favorites."}, status=status.HTTP_404_NOT_FOUND)


class UserFavoriteListView(APIView):
    """
    API view to list all RecreationAreas favorited by the current user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        favorites = user.favorite_locations.all()  # reverse M2M relation
        serializer = RecreationAreaSerializer(favorites, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateComment(APIView):
    pass

class DeleteComment(APIView):
    """
    API view to allow a user to delete their own comment.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            comment = get_object_or_404(Comment, pk=pk)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)

        if comment.user != request.user:
            raise PermissionDenied("You can only delete your own comments.")

        comment.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)

# to pass to frontend for dropdowns
class LocationCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LocationCategory.objects.all()
    serializer_class = LocationCategorySerializer
    permission_classes = [permissions.AllowAny]

class RecreationTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RecreationType.objects.all()
    serializer_class = RecreationTypeSerializer
    permission_classes = [permissions.AllowAny]