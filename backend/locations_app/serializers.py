from rest_framework import serializers
from django.contrib.gis.geos import Point
from .models import RecreationArea, Comment
from rest_framework.fields import CurrentUserDefault

class RecreationAreaSerializer(serializers.ModelSerializer):

    submitted_by = serializers.HiddenField(default=CurrentUserDefault())

    class Meta:
        model = RecreationArea
        fields = '__all__'
        read_only_fields = ['submitted_by', 'is_official_data']

    def to_representation(self, instance):
        """Serialize the Point to GeoJSON format."""
        representation = super().to_representation(instance)
        if isinstance(instance.geom, Point):
            representation['geom'] = {
                "type": "Point",
                "coordinates": [instance.geom.x, instance.geom.y]
            }
        return representation



class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'location', 'comment', 'added_at']
        read_only_fields = ['id', 'user', 'added_at']