from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from django.core.serializers import serialize

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
    


class FavoriteLocation(APIView):
    """
    API view to allow user to favorite a RecreationArea.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            location = get_object_or_404(RecreationArea, pk=pk)
            user = request.user

            # Add the location to the user's favorite_locations list
            # from the RecreationArea model's `favorited_by` ManyToMany field
            # The 'favorited_by' is the related name we established.
            user.favorite_locations.add(location)

            return Response(
                {"message": "Location added to favorites."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )