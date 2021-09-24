"""tediProj URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from siteApp.views.user_views import SkillView
from django.contrib import admin
from django.urls import path
from siteApp import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/',views.AuthView.as_view(),name = 'signup'),
    path('api/user/',views.UserView.as_view(),name = 'user'),
    path('api/skills/',views.SkillView.as_view(),name="skills"),
    path('api/edu/',views.EducationView.as_view(), name = "education")

]


urlpatterns.extend(
    static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
)