from django.contrib import admin
from . import models

# Register your models here.

#Register the new correct user model
admin.site.register(models.User)
admin.site.register(models.SkillType)
admin.site.register(models.UserSkill)
admin.site.register(models.EductationType)
admin.site.register(models.UserEducation)
admin.site.register(models.Offer)
admin.site.register(models.PayMethod)
admin.site.register(models.OfferInterest)
admin.site.register(models.Article)
admin.site.register(models.ArticleImage)
admin.site.register(models.CollaborationRequest)
