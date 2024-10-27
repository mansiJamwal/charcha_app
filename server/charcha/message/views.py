from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import FriendSerializer,MessageSerializer
from django.contrib.auth.models import User
from .models import Friend,Message
from rest_framework import status
from django.db.models import Q
# Create your views here.

#now that i have database setp i need to create views for requests
# Done====> first request is to add friends 
# Done====>second request is to get friends
# third request is t store messages in the databases after creating a real time websocket connection
# Done===> 4th request is to retrieve the messages according to the username and friendname

@api_view(["GET"])
def index(request):
    return Response({
        "msg": "messages index"
    })

@api_view(["POST"])
def add_friend(request):
    serializer=FriendSerializer(data=request.data)
    if serializer.is_valid():
        username=serializer.validated_data['username']
        friendname=serializer.validated_data['friendname']

        try:
            user=User.objects.get(username=username)
            friend=User.objects.get(username=friendname)

        except User.DoesNotExist:
            return Response({"error":"One of the two users does not exist"},status=status.HTTP_404_NOT_FOUND)
        
        if Friend.objects.filter(username=user,friendname=friend).exists() or Friend.objects.filter(username=friend,friendname=user).exists() :
            return Response({"error":"The friendship already exits"},status=status.HTTP_400_BAD_REQUEST)
        
        friend_relation1=Friend(username=user,friendname=friend)
        friend_relation1.save()

        response_serializer = FriendSerializer(friend_relation1)
        return Response({"message":response_serializer.data},status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def get_friends(request):
    try:
        user=User.objects.get(username=request.data['username'])
    except User.DoesNotExist:
         return Response({"error":"The user does not exist"})
    except:
        return Response({"error":"Something unexpected occured"})
    
    friends=Friend.objects.filter(Q(username=user) | Q(friendname=user))
    serializer = FriendSerializer(friends, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)


# this is the request to get list of json object of messages that has message val and sent time
@api_view(["POST"])
def getmessages(request):
    try:
        user=User.objects.get(username=request.data['username'])
    except User.DoesNotExist:
        return Response({"error":"User does not exist"})
    except:
        return Response({"error":"Something unexpected occured"})
    
    messages = Message.objects.filter(Q(username=user)|Q(friendname=user))
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["PUT"]) 
def readmessage(request):
    try:
        message=Message.objects.get(id=request.data['message_id'])
    except Message.DoesNotExist:
        return Response({"error":"Message does not exist"},status=404)
    except:
        return Response({"error":"Something unexpected occured"},status=500)
    
    message.read = True  # Update the 'read' field
    message.save()  # Save the change to the database
    
    return Response({"message": "Message marked as read"})








        


