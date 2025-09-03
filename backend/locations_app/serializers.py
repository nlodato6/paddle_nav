from rest_framework import serializers
from django.contrib.gis.geos import Point
from .models import RecreationArea, Comment

class RecreationAreaSerializer(serializers.ModelSerializer):
    geom = serializers.JSONField()

    class Meta:
        model = RecreationArea
        fields = '__all__'
        read_only_fields = ['submitted_by', 'is_official_data']

    def validate_geom(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("geom must be a GeoJSON dict")
        if value.get("type") != "Point":
            raise serializers.ValidationError("Only Point type is supported for geom")
        if "coordinates" not in value:
            raise serializers.ValidationError("Coordinates required in geom")
        coords = value["coordinates"]
        if not isinstance(coords, (list, tuple)) or len(coords) != 2:
            raise serializers.ValidationError("Coordinates must be a [longitude, latitude] list")
        return value

    def create(self, validated_data):
        geom_data = validated_data.pop('geom')
        point = Point(geom_data['coordinates'][0], geom_data['coordinates'][1])
        validated_data['geom'] = point
        return super().create(validated_data)

    def update(self, instance, validated_data):
        geom_data = validated_data.pop('geom', None)
        if geom_data:
            instance.geom = Point(geom_data['coordinates'][0], geom_data['coordinates'][1])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

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