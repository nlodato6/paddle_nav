from rest_framework import serializers
from .models import RecreationArea



class RecreationAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecreationArea
        fields = '__all__' 
        read_only_fields = ['submitted_by', 'is_official_data']
