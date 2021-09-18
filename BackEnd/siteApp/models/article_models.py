from django.db import models
from .user_models import User

#THESE MODELS HAVE TO DO JUST WITH ARTICLES THAT EACH USER CAN UPLOAD
#NOT SO MUCH IS KNOWN ON HOW TO CREATE AND UPLOAD ARTICLES WITH PICTURES AND VIDEO

class Article(models.Model):
    """This model represents an article uploaded by the user of the application
    All the files belonging to the article will be connected to it by a foreign key
    """

    #Who wrote the article
    author = models.ForeignKey(User,on_delete=models.CASCADE)

    #When was the article created
    created_on = models.DateField(auto_now=True)

    #When was the article last modified
    last_modified_on = models.DateTimeField(auto_now_add=True)

class ArticleAddon(models.Model):
    """This is a class that represents a file that is added to a specific
    article. This can be an image or a video, that's why there are subclasses to this one"""

    article = models.ForeignKey(Article,on_delete=models.CASCADE)

class ArticleImage(ArticleAddon):
    """This is an image that is attatched to an article"""

    data = models.ImageField(upload_to="users/articles/images/")

#FOR VIDEOS WE DON'T KNOW YET