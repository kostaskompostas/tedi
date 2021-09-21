from django.db import models
from .user_models import User

class PayMethod(models.Model):
    """This represents the various modes of payment that the user
    will be able to offer when he is making an offer to other users"""

    #Code name to be used in code only as a key for the method
    codename = models.CharField(max_length=20)

    #Display name that is used to say to the users what the mode is about
    name = models.CharField(max_length=30)

def get_default_pay_method():
    return PayMethod.objects.get_or_create(codename='nopay',name='No payment')[0]

class Offer(models.Model):
    """This represents an offer done by a specific user"""

    #Who is making the offer
    author = models.ForeignKey(User,on_delete=models.CASCADE, null = False)

    #A suitable name for the offer
    name = models.CharField(max_length=60)

    #What the offer is about
    description = models.TextField(max_length=1024,null = False)

    #How much is the payment for this offer
    price = models.PositiveIntegerField()
    pay_method = models.ForeignKey(PayMethod,on_delete=models.SET(get_default_pay_method),null=True)

    #This is a variable that states weather the offer was filled by a user
    #It is a foreign key to a user that filled the offer,
    #If set to null it means the offer has not yet been filled
    filled = models.BooleanField()

class OfferInterest(models.Model):
    """This instance indicates that a specific user has taken interest in
    a specific offer. The author of the offer can see all those that are interested
    through instances of this class"""

    #The user taking interest
    user = models.ForeignKey(User,on_delete=models.CASCADE)

    #The offer he has taken interest in
    offer = models.ForeignKey(Offer,on_delete=models.CASCADE)


