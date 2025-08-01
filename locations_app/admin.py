from django.contrib import admin
from .models import LocationCategory, RecreationArea, RecreationType


# Register your models here.
admin.site.register(LocationCategory)
admin.site.register(RecreationType)
admin.site.register(RecreationArea)
