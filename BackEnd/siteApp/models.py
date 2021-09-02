from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Create your models here.


#Create custom user model manager
class UserManager(BaseUserManager):

    use_in_migrations = True;

    #Custom create new user
    def create_user(self, email, password, **extra_fields):

        #Create a new user model with the fields from the args
        new_user = self.model(email = email, **extra_fields);

        #Password must be set through set_password() to properly hash
        new_user.set_password(password);

        #Finally save the new user and return him
        new_user.save();
        return new_user;

    #Custom superuser creation
    def create_superuser(self,email,password,**extra_fields):

        #Create a new user and set the appropriate flags
        new_superuser = self.create_user(email,password,**extra_fields);
        new_superuser.is_staff = True;
        new_superuser.is_superuser = True;

        #Save and return the new superuser
        new_superuser.save();
        return new_superuser;


#Create custom user model for email login
class User(AbstractUser):

    #Don't use the default username field
    username = None;
    email = models.EmailField(_('email address'), unique=True);

    #Set the username field as the login credential
    USERNAME_FIELD = 'email';
    REQUIRED_FIELDS = [];

    #Set the manager to be the one above
    objects = UserManager();