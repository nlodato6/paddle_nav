from django.contrib.gis.db import models

class TideStation(models.Model):
    station_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=2, blank=True, null=True)
    location = models.PointField(srid=4326)  # same as your geom field
    # optionally add other metadata fields
    
    def __str__(self):
        return f"{self.name} ({self.station_id})"
