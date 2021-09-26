#THIS CONTAINS THE API VIEW FOR UPLOADING AN ARTICLE AS A USER

from rest_framework.views import APIView
from rest_framework.response import Response
from ..rest_utility import *
import siteApp.models as app_models
from .user_views import * 
from siteApp.serializers import ArticleImageSerializer

def convert_article_to_dictionary(article,addons):
    """This will convert an article model into a python dictionary
    addons should be a list of addons for all articles to avoid fetching them
    over and over"""

    final_dict = {
        'article_id':article.id,
        'user_email':article.author.email,
        'user_first_name':article.author.first_name,
        'user_last_name':article.author.last_name,
        'article_content':article.content,
        'created_on': str(article.created_on),
    }

    #Get the list of article image urls that belong to this article
    img_list = []

    for addon in addons:
        if addon.article == article:
            img_list.append(addon.data.url)
    
    #Add the addons to the dictionary and return it
    final_dict['images'] = img_list
    return final_dict

class ArticleView(APIView):
    """This endpoint allows users to retrieve articles by other users
    and also to post their own articles"""



    def get(self,request, format=None):
        """This will return a list of articles either by everyone or by a specific user"""

        #Parse the data
        request_data = request.query_params

        #Then check if the essential parameters are there
        if not check_dict_contains_one_key(request_data,['all','user']):
            return response_message(False,"One of the required parameters is missing")

        #Then fetch the article addons to use in conversions
        article_addons = app_models.ArticleImage.objects.all()

        #Set the variable for retrieving articles
        articles = []

        #Then check if you are reporting all the articles
        if "all" in request_data:

            #Fetch all the articles
            articles = app_models.Article.objects.filter(finalized = True)
        
        if "user" in request_data:

            #Assume it is the logged in user
            user = None
            if request.user.is_authenticated:
                user = request.user

            #Check if another email is specified
            if 'user_email' in request_data:
                #Try to fetch another user
                user = app_models.User.objects.filter(email=request_data['user_email'])[0]
            
            #Check if you still don't have a user
            if user == None:
                return response_message(False,"No user specified! Login or use parameter user_email with a valid email")

            #Fetch the articles of that user only
            articles = app_models.Article.objects.filter(author=user,finalized=True)
        
        #Now that you have the article create the final article response, by checking which articles are for showing
        show_private = request.user.is_authenticated

        #Then loop through the articles to create the final list
        final_list = []
        for article in articles:

            #Check if it is public
            if article.private:
                if show_private:
                    if check_users_collaboration(article.author,request.user):
                        final_list.append(convert_article_to_dictionary(article,article_addons))
            else:
                #If it is public add it immediately
                final_list.append(convert_article_to_dictionary(article,article_addons))
        
        #After the final list has been created, return the response
        return Response({
            'success':'true',
            'item_no':len(final_list),
            'items':final_list
        })

    def post(self, request, format=None):
        """This will allow a user to create an article,
        add addons to an article and finalize the article
        
        So there are three modes to this"""

        #First check if the user is logged in
        if not request.user.is_authenticated:
            return response_message(False,"You must be logged in to create/augment an article")

        #Parse the parameters
        request_data = request.data

        #Check if the essentrial parameters are there
        if not check_dict_contains_one_key(request_data,['create','add_image','finalize']):
            return response_message(False,"One of the required parameteres is missing")
        
        if 'create' in request_data:

            #Check that there is content on the article
            if "content" not in request_data:
                return response_message(False,"Parameter content is required")
            
            #Try to create a new article
            article = app_models.Article()
            article.author = request.user
            article.content = request_data['content']
            article.private = "private" in request_data
            article.finalized = False

            #Then save the article and return
            try:
                article.save()
                return Response({
                    'success':'true',
                    'article_id':article.id
                })
            except:
                return response_message(False,"Could not save article to database")
        
        if 'add_image' in request_data:

            #Check if the article id is missing
            if not check_dict_contains_keys(request_data,['article_id','image_file']):
                return response_message(False,"One of the required parameters is missing")
            
            #Fetch the article that you are adding an image to
            article = None
            try:
                article = app_models.Article.objects.get(author=request.user,pk=int(request_data['article_id']),finalized=False)
            except:
                return response_message(False,"The article_id does not correspond to an article you have posted that is not finalized")
            

            #Then check if the image_file can be validated with the serializer
            checkser = ArticleImageSerializer(data={"data":request_data['image_file']})
            if not checkser.is_valid():
                return response_message(False,"There was a problem with the picture you posted")
            
            #If all went well, create the addon and add the article and save it
            try:
                addon = app_models.ArticleImage()
                addon.article = article
                addon.data = request_data['image_file']
                addon.save()

                return response_message(True,"An addon was successfully added to the article")
            except:
                return response_message(False,"Error saving article image to database")

        if 'finalize' in request_data:
            
            #This will only finalize articles, meaning that they can be visible and no other data can be added to them

            #Check if the article id is missing
            if "article_id" not in request_data:
                return response_message(False,"One of the required parameters is missing")
            
            #Try and fetch the article
            article = None
            try:
                article = app_models.Article.objects.get(author=request.user,pk=int(request_data['article_id']),finalized=False)
            except:
                return response_message(False,"The article_id does not correspond to an article you have posted that is not finalized")
            
            #If that worked, just finalize and save
            try:
                article.finalized = True
                article.save()

                return response_message(True,'The article was successfully finalized')
            except:
                return response_message(False,"Could not save the article to database")
    
    def delete(self, request,format=None):
        """This will allow users to delete articles they have
        previously posted"""


        #Check that you are logged in
        if not request.user.is_authenticated:
            return response_message(False,"You must be logged in to delete an article")
        
        #Parse the parameters
        request_data = request.data

        #Check if the article id is missing
        if "article_id" not in request_data:
            return response_message(False,"One of the required parameters is missing")
        
        #Try and fetch the article
        article = None
        try:
            article = app_models.Article.objects.get(author=request.user,pk=int(request_data['article_id']))
        except:
            return response_message(False,"The article_id does not correspond to an article you have posted")

        #If you have the article try and delete it
        try:
            article.delete()

            return response_message(True,"Article deleted successfully")
        except:
            return response_message(False,"Error while deleting article")

        