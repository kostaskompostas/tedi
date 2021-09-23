#THESE ARE VIEWS ASSOCIATED WITH MAKING OFFERS, TAKING INTEREST AT OFFERS, AND ACCEPTING
#SOMEONE TO WORK ON YOUR OFFER

from ..rest_utility import *
import siteApp.models as app_models
from rest_framework.views import APIView
from rest_framework.response import Response
from .user_views import convert_user_to_dictionary, check_users_collaboration

def convert_offer_to_dictionary(offer,mode):
    """This will convert an offer into a dictionary so it can be responded"""

    final_dict = {
        'offer_id':offer.id,
        'offer_name':offer.name,
        'offer_description':offer.description,
        'offer_user':offer.author,
        'offer_price':offer.price,
        'offer_paymethod':offer.pay_method.name,
        'offer_filled': 'true' if offer.filled != None else 'false'
    }

    if mode == "showfilled":
        final_dict['offer_filled'] = offer.field.email if offer.filled != None else 'false'

    return final_dict

class OfferView(APIView):
    """This endpoint allows users to get the available offers,
    make offers themselves. Or delete one of their offers"""

    def get(self,request,format=None):
        """This allows for retrieval of all the offers, or offers issued by
        a specific user. This user can be the logged in user or a different user"""

        #Parse the parameters
        request_data = request.query_params

        #Check that at least one of the modes are there
        if not check_dict_contains_one_key(request_data,['all','user']):
            return response_message(False,"One of the required parameters is missing")
        
        #Check if you want to retrieve all the offers
        if "all" in request_data:

            #Just fetch the whole of every offer
            return response_from_queryset(app_models.Offer.objects.all(),lambda x:convert_offer_to_dictionary(x,''))
        
        #Check if you want to retrieve a specific user's data
        if "user" in request_data:

            user = None

            #Check if you are authenticated so you return your own data
            if request.user.is_authenticated:
                user = request.user
            
            #Check if you have specified an email of the user you wanna retrieve the data from
            if "user_email" in request_data:
                try:
                    user = app_models.User.objects.get(email=request_data['user_email'])
                except:
                    return response_message(False,"The user_email does not correspond to a user")

            #Check if you are not logged in and havent specified an email
            if user == None:
                return response_message(False, "You need to specify a user or log in to see specific offers")

            #Determine the mode of operation
            mode = "showfilled" if user == request.user else ""

            #Fetch and return the appropriate offers
            return response_from_queryset(app_models.Offer.objects.filter(author=user),lambda x: convert_offer_to_dictionary(x,mode))

    def post(self, request, format = None):
        """This will allow users to create their offers"""

        #Check if you are an authenticated user
        if not request.user.is_authenticated:
            return response_message(False,"You must be logged in to create an offer")

        #Parse the parameters
        request_data = request.data

        #Check that all the required parameters are there
        if not check_dict_contains_keys(request_data,['offer_name','offer_description','offer_price']):
            return response_message(False,"One of the required parameters is missing")

        #Check if the price specified is a valid positive integer
        if not request_data['offer_price'].isdigit():
            return response_message(False,"The price must be a non-negative integer")

        #Check if the pay method is specified
        paymethod = None
        if "offer_paymethod" in request_data:

            #Try to find the payment method
            try:
                paymethod = app_models.PayMethod.objects.get(codename = request_data['offer_paymethod'])                
            except:
                return response_message(False,"The payment method stated does not exist in the database")
        
        #Finally create the offer and save it to the database
        try:
            new_offer = app_models.Offer()
            new_offer.author = request.user
            new_offer.name = request_data['offer_name']
            new_offer.description = request_data['offer_description']
            new_offer.price = int(request_data['offer_price'])
            if paymethod != None:
                new_offer.pay_method = paymethod

            new_offer.save()
            return response_message(True,"New offer was successfully saved")
        except:
            return response_message(False,"Error while saving the new offer to the database")

    def get_offer_of_user(self,request):
        """This will return an offer if you are the logged in user and the request contained the offer_id, else it will return an appropriate fail response"""

        #Check that you are logged in
        if not request.user.is_authenticated:
            return response_message(False,"You must be authenticated to delete or alter the details of one of your offers")
        
        #Parse the request data
        request_data = request.data

        #Check that the offer id is included
        if "offer_id" not in request_data:
            return response_message(False,"Parameter offer_id is required")

        #Try to see if you can find the offer specified
        offer = None
        try:
            offer = app_models.Offer.objects.get(pk=int(request_data['offer_id']))
        except:
            return response_message(False,"The offer_id does not correspond to an offer")

        #Check if you are the owner of the offer
        if offer.author.id != request.user.id:
            return response_message(False,"You are not the author of the specified offer")

        #If you are, just return the offer
        return offer

    def put(self,request, format=None):
        """This is used for altering an existing offer"""

        #First get the offer of the user
        offer = self.get_offer_of_user(request)

        #Check if that failed
        if type(offer) == Response:
            return offer

        #Then get the request data
        request_data = request.data

        #Try to alter every specified parameter
        if "offer_name" in request_data:
            offer.name = request_data['offer_name']
        if "offer_description" in request_data:
            offer.description = request_data['offer_description']
        if "offer_price" in request_data:
            #Check that the price is non-negative integer
            if not request_data['offer_price'].isdigit():
                return response_message(False,"Parameter offer_price must be a non-negative integer")
        if "offer_paymethod" in request_data:
            #Try to get the pay method from the database
            paymethod = None
            try:
                paymethod = app_models.PayMethod.objects.get(codename=request_data['paymethod'])
                offer.pay_method = paymethod
            except:
                return response_message("The offer_paymethod does not corrrespond to a payment method")
        
        #After all the editing try to save the offer
        try:
            offer.save()
            return response_message(True,"Successfully altered the offer specified")
        except:
            return response_message(False,"Error while saving offer to database")
    
    def delete(self,request,format=None):
        """This will allow users to delete their offers at will"""

        #Get the offer you are trying to delete
        offer = self.get_offer_of_user(request)

        #Try to delete the offer
        try:
            offer.delete()
            return response_message(True,"Offer deleted successfully")
        except:
            return response_message(False,"Error while deleting offer from the database")
        
             
class OfferInterestView(APIView):
    """This endpoint will allow users to express interest in the various offers
    , see who is interested for one of their offers, and select an interested party to fill their offer or reject them"""

    def get(self, request, format = None):
        """This is for viewing who is interested in your offers,
        and also which offers are you interested in"""

        #First check that you are logged in
        if not request.user.is_authenticated:
            return response_message(False,"Viewing offer interests requires being authenticated")

        #Then parse the parameters
        request_data = request.data

        #Check if the required parameters are there
        if not check_dict_contains_one_key(request_data,['my_interest','offer_interest']):
            return response_message(False,"One of the required parameters is missing")

        #Check if you want to see the offers you are interested in
        if "my_interest" in request_data:

            #Return a list of offers you are interested in
            return response_from_queryset(app_models.OfferInterest.objects.filter(user=request.user).prefetch_related('offer'),lambda x:convert_offer_to_dictionary(x,""))

        if "offer_interest" in request_data:

            #Check which parties are interested in one of your offers
            #First, this requires the offer_id
            if "offer_id" not in request_data:
                return response_message(False, "Parameter offer_id is required to see the offer")
            
            #Fetch the offer
            try:
                offer = app_models.Offer.objects.get(pk=int(request_data['offer_id']))
            except:
                return response_message(False,"The offer id provided does not correspond to an offer")
            
            #Check that you are the author
            if offer.author.id != request.user.id:
                return response_message(False,"You are not the author of the offer you are trying to get the intersted users of")
            
            #Finally return the list of users interested
            return response_from_queryset(app_models.OfferInterest.objects.filter(offer=offer).prefetch_related('user'),lambda x: convert_user_to_dictionary(x,check_users_collaboration(request.user,x)))

    def post(self, request, format=None):
        """This will allow users to accept offer requests, or reject them, or make their own requests"""

        #Check that you are authenticated
        if not request.user.is_authenticated:
            return response_message(False,"You must be authenticated in order to manage offer interests")

        #Parse the parameters
        request_data = request.data

        #Check that the required parameters are there
        if not check_dict_contains_one_key(request_data,['accept_interest','reject_interest','make_interest']):
            return response_message(False,"One of the required parameters are missing")

        #Check if you are making the offer interest
        if "make_interest" in request_data:

            #Check that the offer_id is there
            if "offer_id" not in request_data:
                return response_message(False,"Parameter offer_id is required")

            #Try to fetch the offer
            offer = None
            try:
                offer = app_models.Offer.objects.get(pk=int(request_data['offer_id']))
            except:
                return response_message(False,"The offer_id does not correspond to an offer")
            
            #Check that you are not the owner of the offer
            if offer.author.id == request.user.id:
                return response_message(False,"You cannot express interest in your own offer")
            
            #Check if you have already an OfferInterest
            if app_models.OfferInterest.objects.filter(user=request.user,offer=offer).count() != 0:
                return response_message(True,"You have already expressed interest in that offer")
            
            #Create the offer interest and try to save it
            try:
                offer_interest = app_models.OfferInterest()
                offer_interest.user=request.user
                offer_interest.offer=offer
                offer_interest.save()

                return response_message(True,"The interest in the offer was established")
            except:
                return response_message(False,"Error while saving offer interest to database")

        else:
            #Naturally this is where you approve or reject an offer interest

            #Check that the interest_id is there
            if "interest_id" not in request_data:
                return response_message(False,"Parameter interest_id is required")
            
            #Fetch the specific interest
            interest = None
            try:
                interest = app_models.OfferInterest.objects.get(pk=int(request_data['interest_id']))
            except:
                return response_message(False,"The interest_id does not correspond to an offer interest")

            #Check that you are the owner of the interest offer
            if not interest.offer.author.id == request.user.id:
                return response_message(False,"You cannot approve or reject interest on offers you don't own")
            
            #If the offer is approved, then add the filled position on the offer
            text = "rejected"
            if "approve_interest" in request_data:
                try:
                    interest.offer.filled = interest.user
                    text = "approved"
                except:
                    return response_message(False,"Error saving offer to database")
            
            #When all is done, delete the interest
            try:
                interest.delete()
                return response_message(True,"The offer interest was "+text+" successfully")
            except:
                return response_message(False,"Error while deleting offer interest")

    def delete(self,request,format=None):
        """Delete an interest of yours on an offer"""

        #Check that you are authenticated
        if not request.user.is_authenticated:
            return response_message(False,"You must be authenticated to delete your offer interests")

        #Parse the parameters
        request_data = request.data

        #Check that the offer_id exists there
        if 'offer_id' not in request_data:
            return response_message(False,"Parameter offer_id is required")

        #Try to find the specified interest
        interest = None
        try:
            interest = app_models.OfferInterest.objects.get(user=request.user,offer__id=int(request_data['offer_id']))
        except:
            return response_message(False,"The interest with offer_id provided could not be resolved")

        #If you have found the interest, delete it
        try:
            interest.delete()
            return response_message(True,"Offer interest deleted successfully")
        except:
            return response_message(False,"Error while deleting offer interest")
