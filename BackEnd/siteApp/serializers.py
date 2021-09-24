from rest_framework.serializers import ModelSerializer
from .models import *

#Create a serializer just for the profile picture field
class UserPictureSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ['profile_picture']

#Another serializer just for picture addons on articles
class ArticleImageSerializer(ModelSerializer):
    class Meta:
        model = ArticleImage
        fields = ['data']