from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from django.core.serializers import serialize
from django.contrib.gis.geos import Point
from .serializers import RecreationAreaSerializer, CommentSerializer
from .models import Favorite, Comment


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
            
            return Response(processed_data, status=status.HTTP_200_OK)

#Users creating locations
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

        data['submitted_by'] = request.user.id
        data['is_official_data'] = False 


        serializer = RecreationAreaSerializer(data=data)
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
        location = get_object_or_404(RecreationArea, pk=pk)

        # can not edit official data
        if location.is_official_data:
            raise PermissionDenied("You can't edit official data.")

        #Only allow users to edit their own submissions
        if location.submitted_by != request.user:
            raise PermissionDenied("You can only edit locations you submitted.")

        serializer = RecreationAreaSerializer(location, data=request.data)

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
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class FavoriteLocation(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        pk = request.data.get('pk')
        api_id = request.data.get('api_id')
        user = request.user

        if not pk and not api_id:
            return Response({"error": "Either pk or api_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Handle user-created location
        if pk:
            location = get_object_or_404(RecreationArea, pk=pk)
            # Add to favorites and return
            Favorite.objects.get_or_create(user=user, location=location)
            return Response({"message": "Location added to favorites."}, status=status.HTTP_200_OK)

        # 2. Handle official API location
        if api_id:
            try:
                location = RecreationArea.objects.get(api_id=api_id)
            except RecreationArea.DoesNotExist:
                # Ingest the location from the API if it doesn't exist
                api_url = f"https://ca.dep.state.fl.us/arcgis/rest/services/OpenData/PARKS_FORI/MapServer/0/query?where=OBJECTID={api_id}&outFields=*&outSR=4326&f=json"
                
                try:
                    api_response = requests.get(api_url, timeout=15)
                    api_response.raise_for_status()
                    arcgis_data = api_response.json()
                except requests.exceptions.RequestException as e:
                    return Response({"error": f"Failed to fetch official location data: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                if not arcgis_data.get('features'):
                    return Response({"error": "Official location not found."}, status=status.HTTP_404_NOT_FOUND)

                feature = arcgis_data['features'][0]
                attributes = feature.get('attributes', {})
                geometry = feature.get('geometry', {})
                
                if not geometry or 'x' not in geometry or 'y' not in geometry:
                    return Response({"error": "Invalid geometry data from API."}, status=status.HTTP_400_BAD_REQUEST)
                
                longitude = geometry['x']
                latitude = geometry['y']
                geom = Point(longitude, latitude)

                # Create the new RecreationArea entry for the official location
                location = RecreationArea.objects.create(
                    api_id=api_id,
                    name=attributes.get('Name', 'Unnamed Location'),
                    geom=geom,
                    is_official_data=True
                )
            
            # Add to favorites using the Favorite model
            Favorite.objects.get_or_create(user=user, location=location)
            return Response({"message": "Official location added to favorites."}, status=status.HTTP_200_OK)
        

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

            return Response(
                {"message": "Location removed from favorites."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


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
