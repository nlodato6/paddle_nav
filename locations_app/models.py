from django.contrib.gis.db import models
from django.core.exceptions import ValidationError



class LocationCategory(models.Model):
    
    name = models.CharField(max_length=255, unique= True, blank=False, null=False)
    description = models.TextField(blank=True, null= True)

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
    
    name = models.CharField(max_length=255, unique= True, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    geom = models.PointField(srid=4326)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2, default='FL',editable=False)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    is_official_data = models.BooleanField(default=False,)
    location_category = models.ForeignKey(LocationCategory, on_delete=models.SET_NULL, null=True)
    recreation_type = models.ManyToManyField(RecreationType, blank=True, related_name='recreation_type')
    # submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,blank=True, null=True,related_name='submitted_locations')
    date_added = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
    
    