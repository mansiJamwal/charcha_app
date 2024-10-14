from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import FriendSerializer,RoomSerializer,MessageSerializer
from django.contrib.auth.models import User
from .models import Friend,Message,Room
from rest_framework import status
# Create your views here.

#now that i have database setp i need to create views for requests
# Done====> first request is to add friends 
# Done====>second request is to add the room name
# third request is to make a websocket connection to send messages adn then store them as we go
# Done===> 4th request is to retrieve the messages according to the roomname and further according to the username

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

        friend_relation2=Friend(username=friend,friendname=user)
        friend_relation2.save()

        return Response({"message":"Letss goo!!!!!!"},status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def add_room(request):
    serializer=RoomSerializer(data=request.data)
    if serializer.is_valid():
        roomname=serializer.validated_data['roomname']
        try:
            username=roomname.split(" ")[0]
            friendname=roomname.split(" ")[1]
            user=User.objects.get(username=username)
            friend=User.objects.get(username=friendname)
        except User.DoesNotExist:
            return Response({"error":"One of the two users does not exist"},status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({"error":"Something unexpectod occurred"},status=status.HTTP_400_BAD_REQUEST)
        
        if Room.objects.filter(roomname=roomname).exists() or Room.objects.filter(roomname=f'{friendname} {username}').exists():
            return Response({"error":"Room already exists"},status=status.HTTP_400_BAD_REQUEST)
        
        room_relation=Room(roomname=roomname)
        room_relation.save()

        return Response({"message":"Room created Letsss Goooo!!!"},status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

# this is the request to get list of json object of messages that has message val and sent time
@api_view(["POST"])
def getmessages(request):
    try:
        user=User.objects.get(username=request.data['username'])
        roomname=request.data['roomname']
        try:
            room = Room.objects.get(roomname=roomname)
        except Room.DoesNotExist:
            # If the room doesn't exist, try the reversed room name
            reversed_roomname = f"{roomname.split(' ')[1]} {roomname.split(' ')[0]}"
            room = Room.objects.get(roomname=reversed_roomname)
    except Room.DoesNotExist:
        return Response({"error":"Room does not exist"})
    except User.DoesNotExist:
        return Response({"error":"User does not exist"})
    except:
        return Response({"error":"Something unexpected occured"})
    
    messages = Message.objects.filter(roomname=room, username=user)
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)





        


