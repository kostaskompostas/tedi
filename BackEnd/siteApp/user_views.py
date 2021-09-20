from rest_framework.views import APIView
from rest_framework.response import Response
from .rest_utility import *
from django.contrib.auth import authenticate,login,logout
import models as app_models


def check_users_collaboration(user1,user2):
    """Checks if the two users passes as parameters are collaborating"""

    #Try to find each other in the collaboration set
    return user2 in user1.collaborators.all()

def convert_user_to_dictionary(user, see_private):
    """This will convert a user model into a dictionary
    see_private is a boolean that when set to true, will make this function
    include the private data of the specific user. This should only be set
    to true if the request is done by a collaborating user"""

    #Write the public parts of the user
    final_dict = {}
    final_dict['email'] = user.email
    final_dict['first_name'] = user.first_name
    final_dict['last_name'] = user.last_name

    #Write the public parts that need permission
    if not user.phone_private:
        final_dict['phone'] = user.phone

    #Write the private parts of the user
    if see_private:
        final_dict['phone'] = user.phone

    #Return the complete dictionary
    return final_dict

class UserView(APIView):

    """This endpoint is used for retrieving user infromation as well as creating new users"""



    def get(self, request, format = None):
        """This will return a list of users, or a specific user depending on parameters provided"""

        request_data = request.query_params


        #First check if you are checking for a specific user
        if "user_email" in request_data:

            #Try to get the user specified
            try:
                user = app_models.User.objects.get(email = request_data("user_email"))
            except:
                return response_message(False, "User was not found")
            
            #Check if you are collaborating with the user
            collab = False
            if request.user.is_authenticated:
                collab = check_users_collaboration(request.user,user)
            
            #Finally return the user as a response
            return Response(convert_user_to_dictionary(user,collab))

        #If the user email was not specified, return a list of all users
        return response_from_queryset(app_models.User.objects.all(),lambda x: convert_user_to_dictionary(x,False))

    def post(self, request, format = None):

        """This is used for creating new users to the database
        
        Authenticated admin users can create other admin users"""

        request_data = request.data

        #Check if all the required keys are there
        if not check_dict_contains_keys(request_data,["user_email","user_phone","user_first_name","user_last_name"]):
            return response_message(False,"One of the required parameters for creating a user is missing")

        #Validate all the information passed on
        #TODO: Actually perform a validation

        #Check that the email is not used by another user
        if app_models.User.objects.filter(email=request_data['user_email']).count() != 0:
            return response_message(False,"The email is in use by another registered user")

        #Check if you are creating an admin user
        make_admin = False
        if "admin" in request_data:
            #Check if you are authorised for that
            if request.user.is_authenticated and request.user.is_superuser:
                make_admin = True
            else:
                return response_message(False,"You are not authorized to create an admin user")

        #Create the new user with the information provided
        new_user = app_models.User()
        new_user.email = request_data['user_email']
        new_user.first_name = request_data['user_first_name']
        new_user.last_name = request_data['user_last_name']
        new_user.phone = request_data['user_phone']
        new_user.phone_private = True if 'user_phone_private' in request_data else False
        new_user.is_superuser = make_admin
        new_user.is_staff = make_admin

        #Save the new user to the database and return a success
        try:
            new_user.save()
            return response_message(True,"The new user was created successfully")
        except:
            return response_message(False,"Could not save the new user into the database")

    def put(self, request, format = None):
        """This allows you to alter your core data, if you are a previously authenticated user"""

        #Get the data of the request
        request_data = request.data

        #Check if you are authenticated first
        if not request.user.is_authenticated:
            return response_message(False,"You must be authenticated to alter your data")

        #Then try to alter your data one by one and see if you run in an error
        #Because these will happen individually, you will have a dictionary of messages for each thing you are trying to alter
        response_dict = {}


        #Try to change your email
        if "user_email" in request_data:
            
            #Check if the new email is used by another person
            if app_models.User.objects.filter(email = request_data['user_email']):
                response_dict['user_email'] = {
                    'changed':'false',
                    'message':'email was in use by another user'
                }
            else:
                request.user.email = request_data['user_email']
                response_dict['user_email'] ={
                    'changed':'true'
                }
        
        if "user_password" in request_data:

            #Change the user password
            request.user.set_password(request_data['user_password'])
            response_dict['user_password'] ={
                'changed':'true'
            }
        
        if "user_first_name" in request_data:

            #Change his first name
            request.user.first_name = request_data['user_first_name']
            response_dict['user_first_name'] ={
                'changed':'true'
            }
        
        if "user_last_name" in request_data:

            #Change his last name
            request.user.last_name = request_data['user_last_name']
            response_dict['user_last_name'] ={
                'changed':'true'
            }

        if "user_phone" in request_data:

            #Change his last name
            request.user.phone = request_data['user_phone']
            response_dict['user_phone'] ={
                'changed':'true'
            }

        if "user_phone_private" in request_data:

            #Change his last name
            request.user.phone_private = True if request_data['user_phone_private'] == 'true' else False
            response_dict['user_phone_private'] ={
                'changed':'true'
            }
        
        #After all the changes try to save the user
        try:
            request.user.save()
            login(request,request.user)
            return Response(response_dict)
        except:
            return response_message(False,"Could not save user to the database")

class AuthView(APIView):
    """This endpoint is used for logging users in and logging users out of the application"""

    def get(self, request, format = None):
        """Give back the information of the logged in user"""

        if request.user.is_authenticated:

            #If you are logged in, return all your information
            return Response(convert_user_to_dictionary(request.user,True))
        
        else:

            return response_message(False,"You are not currently logged in")

    def post(self, request,format = None):
        """Log a user in or out"""

        #Parse the data of the request
        request_data = request.data

        #Check that one of the mode parameters are present
        if not check_dict_contains_one_key(request_data,["login","logout"]):
            return response_message(False,"One of the required parameters is missing")

        #Check if you are performing a login
        if "login" in request_data:
            
            #Check if you are already authenticated
            if request.user.is_authenticated:
                return response_message(False,"You are already logged in as user: ["+request.user.email+"]")

            #Check if all the login parameters are present
            if not check_dict_contains_keys(request_data,["user_email","user_password"]):
                return response_message(False,"One of the required parameters for login is missing")
            
            #If all is good try to authenticate the user
            user = authenticate(username=request_data['user_email'],password=request_data['user_password'])

            if not user == None:
                #Log the authenticated user in, and return the success response
                login(request,user=user)
                return response_message(True,"Login successful")
            else:
                return response_message(False,"Wrong credentials")
        
        if "logout" in request_data:

            #Check if you are logged in
            if not request.user.is_authenticated:
                return response_message(False,"You are not currently logged in")

            #If you are logged in, log yourself out
            logout(user=request.user)

            #Finaly send the success response
            return response_message(True,"You successfully logged out")
    
class CollabView(APIView):
    """This class is used for making collaboration requests
    Answering collaboration requests, and declining them
    Also viewing you collaboration requests, and others that people have made to you"""

    def convert_request_to_dictionary(self,collab,mode):
        """This is for turning collaboration requests into
        a serialized form"""

        return {
            'request_id':collab.id,
            'user_from_email':collab.user_from.email,
            'user_to_email': collab.user_to.email
        }


    def get(self, request, format = None):
        """Through this call you can view your collaboration requests, and also those that other users have made to you. All is done through user ids"""

        #Get the data of the request
        request_data = request.query_params

        #First check that you are logged in
        if not request.user.is_authenticated:
            return response_message(False, "You must be an authenticated user to view the collaborations")

        mode = ""
        if "mode" in request_data:
            mode = request_data["mode"]

        #Start without requests
        req = None

        #Check if you are viewing incoming requests
        if "incoming" in request_data:

            #Fetch all the request users have made to you
            req = app_models.CollaborationRequest.objects.filter(user_to=request.user)
        else:
            
            #See the outgoing requests
            req = app_models.CollaborationRequest.objects.filter(user_from=request.user)

        #Return the requests in the form of list
        return response_from_queryset(req,lambda x: self.convert_request_to_dictionary(x,mode))

    def post(self, request, format=None):
        """This allows for making collaboration requests, and also answering to requests made to you positively or negatively"""

        #Parse the request data
        request_data = request.data

        #See if the essential parameters are there
        if not check_dict_contains_one_key(request_data,["create","accept","decline","uncollab"]) or not check_dict_contains_keys(request_data,["user_email"]):
            return response_message(False,"One of the required paremeters is missing")

        #Get the user of the email
        user = None
        try:    
            user = app_models.User.objects.get(email=request_data['user_email'])
        except:
            return response_message(False, "User not found")

        #Check that you are authenticated
        if not request.user.is_authenticated:
            return response_message(False,"You are not logged in so you cannot deal with collaboration requests")

        if "uncollab" in request_data:

            #Check if you are collaborating with the user specified so you can end the collaboration
            if not user in request.user.collaborators.all():
                return response_message(False,"You are not collaborating with the user specified")
            
            #If you are collaborating, stop the collaboration and save the users
            request.user.collaborators.remove(user)
            user.collaborators.remove(request.user)

            request.user.save()
            user.save()

            #Return the ok message
            return response_message(True,"The collaboration has successfully ended")



        if "create" in request_data:
            
            #Check if a request to that user is already there
            if app_models.CollaborationRequest.objects.filter(user_from=request.user, user_to=user).count() != 0:
                return response_message(False,"You have already sent a request to that user")
            
            #Check if you are already collaborating with the user
            if check_users_collaboration(request.user,user):
                return response_message(False,"You are already in collaboration with that user")

            #If not create the request
            try:
                req = app_models.CollaborationRequest()
                req.user_from = request.user
                req.user_to = user
                req.save()
                return response_message(True, "Collaboration request send")
            except:
                return response_message(False,"Error saving the request to the database")

        #If you reached here, then you can only accept or decline the request

        #Check that such a request exists first
        req = None
        try:
            req = app_models.CollaborationRequest.objects.get(user_from=user,user_to=request.user)
        except:
            return response_message(False,"You don't have an incoming request from that user")

        #If you have a request, check if you need to make a collaborator
        text = "rejected"
        if "accept" in request_data:
            
            #Make collaborations
            request.user.collaborators.add(user)
            user.collaborators.add(request.user)

            #Save the users
            request.user.save()
            user.save()

            #Change the text
            text = "accepted"


        #Finally delete the collaboration request from the system
        try:
            req.delete()
            return response_message(True,"Success, the collaboration request was "+text)
        except:
            return response_message(False,"Error deleting collab request from database")

class SkillView(APIView):
    """This endpoint allows for users to specify their skills and get a skill list"""

    def convert_skill_to_dictionary(self,skill):

        #Basic representation of the skill
        return {
            'skill_id': skill.id,
            'skill_name': skill.name,
            'skill_description': skill.description
        }

    def convert_userskill_to_dictionary(self,uskill,mode):

        final_dict = {
            'user_email': uskill.user.email,
            'skill_id': uskill.skill.id,
            'skill_level': uskill.level,
        }

        if mode != "other":
            final_dict['skill_private'] = 'true' if uskill.private else 'false'
        
        return final_dict

    def get(self,request,format=None):
        """This will present a list of skills, which through their id's will be used by users to add them to their profile"""

        #Parse the data of the request
        request_data = request.query_params

        #Check that the essential parameters are there
        if not check_dict_contains_one_key(request_data,["all","user"]):
            return response_message(False, "A required parameter is missing")

        #Check if all the available skills need to be presented
        if "all" in request_data:
            
            #Get and return the list of all available skills
            return response_from_queryset(app_models.SkillType.objects.all(),self.convert_skill_to_dictionary)

        if "user" in request_data:

            #Check that you are logged in
            if not request.user.is_authenticated:
                return response_message(False,"You must be logged in to view your skills")
            
            user = request.user
            show_private = True
            mode = ""

            #Check if another user email is presented
            if "user_email" in request_data:


                #Try to differentiate the user from the one he is viewing
                try:
                    user = app_models.User.objects.get(user_email=request_data['user_email'])
                except:
                    return response_message(False,"The user specified does not exist")
                
                #If the user is you, or a collaborator you are allowed to show private skills
                show_private =  check_users_collaboration(request.user,user) or request.user == user
                    

            #Return a list of the skills you have added
            priv = [True,False] if show_private else [False]


            return response_from_queryset(app_models.UserSkill.objects.filter(user=request.user,private__in=priv),lambda x: self.convert_userskill_to_dictionary(x,mode))

    def post(self,request,format=None):
        """This allows users to add a skill from the available skills to their skillsets"""

        #Parse the request data
        request_data = request.data
    
        #Check that you are a logged in user
        if not request.user.is_authenticated:
            return response_message(False,"You must be an authenticated user to manage your skills")
        
        #Then check that the required parameters exists
        if not check_dict_contains_keys(['skill_id','level']):
            return response_message(False,"One of the required parameters is missiing")

        #Check that the skill you are trying to add exists
        skill = None
        try:
            skill = app_models.SkillType.objects.get(pk=int(request_data['skill_id']))
        except:
            return response_message(False,"The skill you are trying to add does not exist")

        #Check if you have already registered that skill
        uskill = None
        try:
            uskill = app_models.UserSkill.objects.get(skill=skill,user=request.user)
        except:
            #If it does not exist, create it at the spot
            uskill = app_models.UserSkill
            uskill.user = request.user
            uskill.skill = skill

        #Try to parse and add all the other parameters
        try:
            lv = int(request_data['level'])
            private = "private" in request_data
            if lv < 1 or lv > 10:
                return response_message(False,"Skill level should be an integer between 1 and 10")
            uskill.level = lv
            uskill.private = private

        except:
            return response_message(False,"Error when parsing the parameters")

        #Finally try to save to database
        try:
            uskill.save()
            return response_message(True,"Skill added/altered successfully")
        except:
            return response_message(False,"Error saving user skill to database")

    def delete(self, request,format=None):
        """This allows users to delete a specific skill set they say they have"""

        #Parse the request data
        request_data = request.data

        #Check that you are authenticated
        if not request.user.is_authenticated:
            return response_message(False,"You must be logged in to delete one of your skills")

        #Check that the parameter is present
        if not "skill_id" in request_data:
            return response_message(False,"The required parameter is missing")

        #Try to find the skill you are looking for
        uskill = None
        try:
            uskill = app_models.UserSkill.objects.filter(user=request.user,skill__id=int(request_data['skill_id']))
        except:
            return response_message(False,'You have not set the skill you are trying to delete')
        
        #Finally try to delete the skill
        try:
            uskill.delete()
            return response_message(True,"User skill deleted successfully")
        except:
            return response_message(False,"Error deleting user skill")