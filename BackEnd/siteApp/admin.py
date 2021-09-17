from django.contrib import admin
from . import models

# Register your models here.

#Register the new correct user model
admin.site.register(models.User);