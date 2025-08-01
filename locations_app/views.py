from django.shortcuts import render
from rest_framework.views import APIView, Response
from django.core.serializers import serialize
from rest_framework import status 

import json
import requests

from .models import RecreationArea, RecreationType, LocationCategory


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
     