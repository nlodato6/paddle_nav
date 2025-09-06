from django.contrib.gis.db import models
from django.core.exceptions import ValidationError
from django.conf import settings


class LocationCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
    
class RecreationType(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False)
    description = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
    

class RecreationArea(models.Model):

    OBJECTID = models.CharField(max_length=255, unique=True, null=True, blank=True)
    name = models.CharField(max_length=255, unique= True, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    geom = models.PointField(srid=4326, null=True)
    address = models.CharField(max_length=255, blank=True, default=" ")
    city = models.CharField(max_length=100, default= " ")
    county = models.CharField(max_length=100, default= "n/a")
    state = models.CharField(max_length=2, default='FL',editable=False)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    is_official_data = models.BooleanField(default=False,editable=False)
    location_category = models.ForeignKey(LocationCategory, on_delete=models.SET_NULL, null=True, blank=True)
    recreation_type = models.ManyToManyField(RecreationType, blank=True, related_name='recreation_areas')
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,blank=True, null=True,related_name='submitted_locations')
    favorited_by = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='favorite_locations', blank=True)
    date_added = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
    def clean(self):
        #can not be offical and submitted by user
        if self.is_official_data and self.submitted_by:
            raise ValidationError("Official data should not have a submitted_by user.")


#users can add comments to the locations
class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    location = models.ForeignKey(RecreationArea, on_delete=models.CASCADE, related_name='comment')
    added_at = models.DateTimeField(auto_now_add=True)
    comment = models.TextField(blank=False, null=False)

    class Meta:
        unique_together = ('user', 'comment')

    def __str__(self):
        return f"{self.user.username} → {self.location.name} → {self.comment}"