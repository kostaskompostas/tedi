from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from . import models as app_models

# Create your views here.


#Create an APIView for signing up
class UserView(APIView):

    def get(self,request,format = None):

        #Return a list of users as well as the number of users

        #First get all the users of the application
        app_users = app_models.User.objects.all();

        #Then get all the ids and the emails of the users one by one
        u_list = [];
        for u in app_users:
            u_list.append({'user_id':u.id,'user_email':u.email});

        return Response({'user_number':str(app_users.count()),'user_list':u_list});
    
    def post(self, request, format = None):

        #Try to create a new user based on the data provided

        #First try to parse the data from the request
        try:
            email = request.data['email'];
            password = request.data['password'];
        except:
            return Response({'status':'failed','message':'Bad data'});

        #Then check if the user already exists
        users = app_models.User.objects.filter(email=email);
        if users.count() != 0 :
            return Response({'status':'failed','message':'Email already taken'});
        
        #If all is correct, create the new user and save him
        new_user = app_models.User.objects.create_user(email,password);
        #new_user.save(); already done in create_user

        #Send success response
        return Response({'status':'ok','message':'User created successfully'});
    