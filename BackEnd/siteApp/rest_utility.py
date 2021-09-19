#This will contain a lot of functions that are useful when creating endpoints
#It will also include standard responses to specific instances

from rest_framework.response import Response

def response_from_queryset(qset, converter):
    """This will create a list response from a queryset of items
    
    The function 'converter' will be converting django models into python dictionaries
    acting as a custom serialiser"""

    #Create the list of converted items
    item_list = []
    for item in qset:
        item_list.append(converter(item))

    final_response = {
        'success':'true',
        'item_no':qset.count(),
        'items':item_list
    }



def response_message(success, message):
    """This will create a response that will contain a success boolean and an appropriate message"""

    return Response({
        'success': 'true' if success else 'false',
        'message': message
    })


#BELOW ARE SOME FUNCTIONS FOR SAFE CONVERSION AND OTHER VALIDATION CHECKS ON COMMON DATA

def check_dict_contains_keys(dict,list):
    """Checks and returns true if all the keys on the list exist
    in the dictionary"""

    for k in list:
        if k not in dict:
            return False
    
    return True

def check_dict_contains_one_key(dict,list):
    """Checks that at least one of the keys on the list exists
    in the dictionary"""

    for k in list:
        if k in dict:
            return True

    return False