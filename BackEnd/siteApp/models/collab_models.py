from django.db import models
from .user_models import User

class CollaborationRequest(models.Model):
    """This class is a request from a user to a user to get those two connected""" 

    #The user receiving the request can accept or reject the request
    #Either way this will get deleted.

    user_from = models.ForeignKey(User,on_delete=models.CASCADE,related_name="userfrom")
    user_to = models.ForeignKey(User,on_delete=models.CASCADE,related_name="userto")

