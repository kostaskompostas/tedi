from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import AbstractUser, BaseUserManager



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
    username = None
    email = models.EmailField(_('email address'), unique=True)
    
    #User also has a myriad of booleans that indicate which info
    #is public and which is private

    #User phone for communication
    phone = models.CharField(max_length=15, null = True,blank=True)
    phone_private = models.BooleanField(null=True)

    #User profile picture
    profile_picture = models.ImageField(upload_to="users/images/",null=True)
    #Collaborators are like "friends" in facebook
    #It's a many to many relationship
    collaborators = models.ManyToManyField("self");

    #Set the username field as the login credential
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    #Set the manager to be the one above
    objects = UserManager();


class EductationType(models.Model):
    """This is a class that describes various levels of education
    A user can have multiple of those and he is the one to set his/her
    institution through the next class.
    
    This class is populated by administrators only
    with records such as:
        -Primary School Diploma
        -HighSchool Diploma
        -University Bachelor
        -Master of Science Degree
        -PHD
    """

    #What is the name of the education level
    name = models.CharField(max_length=50,null=True)

    #Defines of you can have this education more than once
    #E.g. you can have 2 bachelor degrees
    once = models.BooleanField(null=True)


class UserEducation(models.Model):
    """This class allows for a user to specify an education he has been through
    and also which institution he was handed the diploma from"""

    #Which user got the education
    user = models.ForeignKey(User,on_delete=models.CASCADE)

    #Which type of education
    education = models.ForeignKey(EductationType,on_delete=models.CASCADE,null=True)

    #Which school he graduated from
    institution_name = models.CharField(max_length=200,null=True)

    #Wether this information be private for non collaborators
    private = models.BooleanField()

class SkillType(models.Model):
    """This class model will list a set of skills as well as a small
    description for that skill. It is populated by the admins and a user
    can select one or more of those that he claims to have, as well as the
    skill level he thinks he is in"""

    #What is the name of the skill
    name = models.CharField(max_length=150)

    #A small description of the skill
    description = models.TextField(max_length = 300)

class UserSkill(models.Model):
    """This is a specific skill owned by a specific user, as well as
    his assessment of his ability to deliver on that skill measured x/10"""

    #Which user got the skill
    user = models.ForeignKey(User,on_delete=models.CASCADE)

    #Which skill does he have
    skill = models.ForeignKey(SkillType,on_delete=models.CASCADE)

    #What is his skill level out of ten
    level = models.PositiveSmallIntegerField()

    #Is this skill information private to non collaborators
    private = models.BooleanField()

