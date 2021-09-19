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
            