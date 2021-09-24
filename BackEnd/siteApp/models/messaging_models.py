from django.db import models
from django.db.models.deletion import SET_NULL
from .user_models import *

class Message(models.Model):
    """This will represent a message text sent from one user to another one"""

    #This is the one sending the text
    user_from = models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_from")

    #This is the one receiving the text
    user_to = models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_to")

    #This is the content of the text
    content = models.CharField(max_length=200,null=False)

    #Information on when the message was sent
    created_on = models.DateTimeField(auto_now_add=True)

    #Then there is order id to know which message came first on the conversation in a convenient manner
    #Starting with one is the convention here
    order_id = models.PositiveBigIntegerField(null=False)