from rest_framework import serializers
from django.contrib.gis.geos import Point
from .models import RecreationArea, Comment, LocationCategory, RecreationType
from rest_framework.fields import CurrentUserDefault


class RecreationAreaSerializer(serializers.ModelSerializer):
    submitted_by = serializers.HiddenField(default=CurrentUserDefault())
    favorited_by_count = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = RecreationArea
        fields = '__all__'
        read_only_fields = ['submitted_by', 'is_official_data', 'favorited_by_count', 'is_favorited', 'geom']

    def to_representation(self, instance):
        """Serialize the Point to GeoJSON format."""
        representation = super().to_representation(instance)
        if isinstance(instance.geom, Point):
            representation['geom'] = {
                "type": "Point",
                "coordinates": [instance.geom.x, instance.geom.y]
            }
        return representation

    def get_favorited_by_count(self, obj):
        """Return the number of users who favorited this location."""
        return obj.favorited_by.count()

    def get_is_favorited(self, obj):
        """Return True if the current user has favorited this location."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(id=request.user.id).exists()
        return False
    
    # def create(self, validated_data):
    #     """ Fix for Create Ggeom error"""
    #     longitude = validated_data.pop("longitude", None)
    #     latitude = validated_data.pop("latitude", None)
    #     if longitude and latitude:
    #         validated_data["geom"] = Point(float(longitude), float(latitude))
    #     return super().create(validated_data)
    
    
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=CurrentUserDefault())
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'location', 'comment', 'added_at']
        read_only_fields = ['id', 'user', 'added_at']


class LocationCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationCategory
        fields = ["id", "name", "description"]

class RecreationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecreationType
        fields = ["id", "name", "description"]
