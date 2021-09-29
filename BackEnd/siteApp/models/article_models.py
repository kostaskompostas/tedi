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

    #What is written in the article
    content = models.TextField(max_length=500,null=True)

    #Private articles can only be viewed by collaborators of the author
    private = models.BooleanField(null=True)

    #When was the article created
    created_on = models.DateField(auto_now_add=True)

    #Wether the article can be expanded with addons or not
    #When the article is finalized it will be visible to other users
    finalized = models.BooleanField(null=True)

    #Number of likes and number of comments for this article
    #Independently saved to avoid taxing the database
    num_likes = models.PositiveIntegerField(null=False,default=0)
    num_comments = models.PositiveIntegerField(null=False,default=0)


class ArticleAddon(models.Model):
    """This is a class that represents a file that is added to a specific
    article. This can be an image or a video, that's why there are subclasses to this one"""

    article = models.ForeignKey(Article,on_delete=models.CASCADE,null=True)


class ArticleImage(ArticleAddon):
    """This is an image that is attatched to an article"""

    data = models.ImageField(upload_to="users/articles/images/")

class Comment(models.Model):
    """This is for users to leave comments on the articles"""

    #The article that the comment is about
    article = models.ForeignKey(Article,on_delete=models.CASCADE)

    #The user leaving the comment
    user = models.ForeignKey(User,on_delete=models.CASCADE)

    #The content of the comment
    content = models.TextField(max_length=300,null=False)


class Like(models.Model):
    """This is for users to leave a like on the article"""

    #The article that the comment is about
    article = models.ForeignKey(Article,on_delete=models.CASCADE)

    #The user leaving the comment
    user = models.ForeignKey(User,on_delete=models.CASCADE)


#FOR VIDEOS WE DON'T KNOW YET