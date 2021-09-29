from rest_framework.views import APIView
from rest_framework.response import Response
from siteApp.rest_utility import *
import siteApp.models as app_models


def convert_message_to_dictionary(message):
    """This will convert a sent message to a dictionary to be returned as a response"""

    return {
        'message_id':message.id,
        'order_id':message.order_id,
        'user_from_email':message.user_from.email,
        'user_to_email':message.user_to.email,
    }

class MessengerView(APIView):
    """This will allow collaborators to exchange messages with one another"""

    def get(self,request,format=None):
        """This will return to you part of the conversation you have had with a specific user"""

        #Check if you are logged in
        if not request.user.is_authenticated:
            return response_message(False,"You are not logged in and can't see the conversation")

        #Parse the parameters
        request_data = request.data

        #Check if you have provided the required parameters
        if not check_dict_contains_keys(request_data,'user_email','conversation_from'):
            return response_message(False,"One of the required parameters is missing")

        #Check if you can get the other user
        user_other = None
        try:
            user_other = app_models.User.objects.get(email=request_data['user_email'])
        except:
            return response_message("The user_email does not correspond to a valid user")

        #Now that you have both, check that the other parameter is in a good format
        if not request_data['conversation_from'].isdigit():
            return response_message(False,"Parameter conversation_from must be a non-negative integer")

        #Then parse it
        conv_from = int(request_data['conversation_from'])


        #Then run the query to get the information back
        valid_users = [request.user,user_other]
        return response_from_queryset(app_models.Message.objects.filter(user_from__in=valid_users,user_to__in=valid_users,order_id__gte=conv_from),convert_message_to_dictionary)
    
    def post(self,request,format=None):
        """This will allow a user to send a message to another user"""

        #First check that you are logged in
        if not request.user.is_authenticated:
            return response_message(False,"You must be logged in to send messages")
        
        #Then parse the parameters
        request_data = request.data

        #Check if anything is missing
        if not check_dict_contains_keys(request_data,['user_email','content']):
            return response_message(False,"One of the required parameters is missing")
        
        #Try to find the other user that will receive the message
        user = None
        try:
            user = app_models.User.objects.get(email=request_data['user_email'])
        except:
            return response_message(False,"The user_email does not correspond to an active user")
        
        #Then check how many messages have been sent between you two
        valid_users = [request.user, user]
        message_no = app_models.Message.objects.filter(user_from__in=valid_users,user_to__in=valid_users).count()

        #With all this information, create a new message and save it to the database
        try:
            new_message = app_models.Message()
            new_message.user_from=request.user
            new_message.user_to=user
            new_message.content = request_data['content']
            new_message.order_id = message_no
            new_message.save()

            return response_message(True,"Message sent successfully")
        except:
            return response_message(False,"Message could not be sent")