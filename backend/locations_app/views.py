from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from django.core.serializers import serialize
from django.contrib.gis.geos import Point
from .serializers import RecreationAreaSerializer, CommentSerializer, FavoriteSerializer
from .models import Favorite, Comment, RecreationArea


import json
import requests

from .models import RecreationArea, RecreationType, LocationCategory
from .serializers import RecreationAreaSerializer


class Alllocations(APIView):
    """
    APIView to fetch all park locations from the external Florida State Parks: Florida's Outdoor Recreation Inventory API.
    """

    def get(self, request):

        # Florida's Outdoor Recreation Inventory API
        api_url = "https://ca.dep.state.fl.us/arcgis/rest/services/OpenData/PARKS_FORI/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"

        api_response = requests.get(api_url, timeout=15)
        api_response.raise_for_status() 
        arcgis_data = api_response.json()

        processed_data = []

        if 'features' in arcgis_data:
            for feature in arcgis_data['features']:
                location_data = {} 

                #filters out the null fields
                if 'attributes' in feature:
                    original_attributes = feature['attributes']
                
                    filtered_attributes = {
                        key: value
                        for key, value in original_attributes.items()
                        if value is not None #filtering nulls
                    }
                    
                    location_data.update(filtered_attributes)
                
                #if recreation area has geometry add it to location data
                if 'geometry' in feature and feature['geometry'] is not None:
                        geometry = feature['geometry']                        
                        location_data['geometry'] = geometry 

                # add full location data to proccessed data
                if location_data:
                    processed_data.append(location_data)

                
        try:
        # Query all objects from the recreationArea model
            db_locations = RecreationArea.objects.all()

            db_data = [{
                    'id': loc.id,
                    'name': loc.name,
                    'description': loc.description,
                    'geom': {
                        'longitude': loc.geom.x,
                        'latitude': loc.geom.y,
                    } if loc.geom else None,
                    'address': loc.address,
                    'city': loc.city,
                    'state': loc.state,
                    'zip_code': loc.zip_code,
                    'phone_number': loc.phone_number,
                    'is_official_data': loc.is_official_data,
                    'location_category': loc.location_category.name if loc.location_category else None,
                    'recreation_types': [
                        rec_type.name for rec_type in loc.recreation_type.all()
                    ],
                    'submitted_by': loc.submitted_by.username if loc.submitted_by else None,
                    'favorited_by_count': loc.favorited_by.count(), # Returns a count of favorited users
                    'date_added': loc.date_added.isoformat(),
                    'last_updated': loc.last_updated.isoformat(),
                } for loc in db_locations]
        except Exception as e:
                # Catch any database or serialization errors
            return Response({"error": f"Failed to retrieve data from database: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 3. COMBINE THE DATASETS

        # Extend the processed_data list with the data from the database
        processed_data.extend(db_data)
            
        return Response(processed_data, status=status.HTTP_200_OK)


class LocationDetail(APIView):
    """
    APIView to retrieve a single RecreationArea instance by ID.
    """
    def get(self, request, pk):
        location = get_object_or_404(RecreationArea, pk=pk)
        serializer = RecreationAreaSerializer(location)
        return Response(serializer.data)


class CreateLocation(APIView):
    """
    APIView that allows authenticated users to create new RecreationArea entries.
    The submitted location will be marked as user-submitted and not official data.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        # create geom field for user entered locations
        longitude = data.get('longitude')
        latitude = data.get('latitude')

        if longitude is None or latitude is None:
            return Response(
                {"error": "Longitude and latitude are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Create the Point object from the coordinates
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
    API view to allow a user to favorite a RecreationArea, either from
    the local database or from an external API.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk=None, *args, **kwargs):
        user = request.user
        OBJECTID = request.data.get('OBJECTID')
        
        if not pk and not OBJECTID:
            return Response({"error": "Either pk in URL or OBJECTID in body is required."}, status=status.HTTP_400_BAD_REQUEST)

        if pk:
            try:
                location = get_object_or_404(RecreationArea, pk=pk)
            except RecreationArea.DoesNotExist:
                return Response({"error": "Location not found."}, status=status.HTTP_404_NOT_FOUND)
        
        elif OBJECTID:
            try:
                # Use the OBJECTID to find or create the location
                location, created = RecreationArea.objects.get_or_create(OBJECTID=OBJECTID)
                
                # If a new object was just created, fetch and save the full API data
                if created:
                    api_url = f"https://ca.dep.state.fl.us/arcgis/rest/services/OpenData/PARKS_FORI/MapServer/0/query?where=OBJECTID={OBJECTID}&outFields=*&outSR=4326&f=json"
                    api_response = requests.get(api_url, timeout=15)
                    api_response.raise_for_status()
                    arcgis_data = api_response.json()
                    
                    if not arcgis_data.get('features'):
                        location.delete() # Clean up the empty object if API data is missing
                        return Response({"error": "Official location not found."}, status=status.HTTP_404_NOT_FOUND)

                    feature = arcgis_data['features'][0]
                    geometry = feature.get('geometry', {})
                    
                    if not geometry or 'x' not in geometry or 'y' not in geometry:
                        location.delete() # Clean up the empty object
                        return Response({"error": "Invalid geometry data from API."}, status=status.HTTP_400_BAD_REQUEST)
                    
                    location.name = feature.get('SITE_NAME', 'Unnamed Location')
                    location.address = feature.get('LOCATION')
                    location.city = feature.get('COUNTY')
                    location.geom = Point(geometry['x'], geometry['y'])
                    location.is_official_data = True
                    location.save()
            
            except (requests.exceptions.RequestException, KeyError) as e:
                return Response({"error": f"Failed to fetch official location data: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        else:
            return Response({"error": "Either pk in URL or OBJECTID in body is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        favorite_obj, created = Favorite.objects.get_or_create(user=user, location=location)
        
        if created:
            message = "Location added to favorites."
            status_code = status.HTTP_201_CREATED
        else:
            message = "Location is already in favorites."
            status_code = status.HTTP_200_OK

        return Response({"message": message}, status=status_code)
        

class UnfavoriteLocation (APIView):
    """
    API view to allow user to unfavorite a RecreationArea.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            location = get_object_or_404(RecreationArea, pk=pk)
            user = request.user
            
            user.favorite_locations.remove(location)

            favorite_object = Favorite.objects.filter(user=user, location=location)
            
            if favorite_object.exists():
                favorite_object.delete()
                message = "Location removed from favorites."
                status_code = status.HTTP_200_OK
            else:
                message = "Location is not in your favorites."
                status_code = status.HTTP_404_NOT_FOUND
                
            return Response({"message": message}, status=status_code)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserFavoriteListView(APIView):

    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        user = request.user
        
        # Query all Favorite objects for the current user.
        favorites = Favorite.objects.filter(user=user).select_related('location')
        
        serializer = FavoriteSerializer(favorites, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CreateComment(APIView):
    """
    API view to allow authenticated users to create a new comment on a RecreationArea.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            location = get_object_or_404(RecreationArea, pk=pk)
        except RecreationArea.DoesNotExist:
            return Response({"error": "Location not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['user'] = request.user.id
        data['location'] = location.id

        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteComment(APIView):
    """
    API view to allow an authenticated user to delete their own comment.
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
