from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Notification, Follower
from .serializers import NotificationSerializer, FollowerSerializer
from datetime import datetime
from django.contrib.auth.models import User
import logging
from message.models import Friend
from rest_framework.decorators import authentication_classes,permission_classes
from rest_framework.authentication import SessionAuthentication,TokenAuthentication
from rest_framework.permissions import IsAuthenticated


logger = logging.getLogger(__name__)

# Create your views here.
@api_view(["POST"])
def addnotification(request):
   
    username = request.data.get('username')
    friendname = request.data.get('friendname')

   
    if not User.objects.filter(username=username).exists():
        return Response({"message": "This username does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    if not User.objects.filter(username=friendname).exists():
        return Response({"message": "This username does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    serializer=NotificationSerializer(data=request.data)

    if serializer.is_valid():
        notification_val=serializer.validated_data['notification_val']
        notification_type=serializer.validated_data['notification_type']
        sent_time=datetime.now().strftime("%d/%m/%Y:%H:%M:%S")
        try:
            user=User.objects.get(username=username)
            friend=User.objects.get(username=friendname)
            if not Notification.objects.filter(notification_type=notification_type,notification_val=notification_val,username=user,friendname=friend).exists():
                if not Friend.objects.filter(username=user, friendname=friend).exists() and not Friend.objects.filter(username=friend, friendname=user).exists():
                    notification=Notification(
                        notification_type=notification_type,
                        notification_val=notification_val,
                        sent_time=sent_time,
                        username=user,
                        friendname=friend
                    )
                    notification.save()
                    response_serializer=NotificationSerializer(notification)
                    return Response({"notification":response_serializer.data,"message_success":"Request Sent"},status=status.HTTP_201_CREATED)
                else:
                    return Response({"message":"The user has already been added as a friend"})
            else:
                return Response({"message":"Request already sent"},status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response({"message": "Something unexpected occurred. Please try again"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["GET"])
def getnotifications(request):
    username = request.query_params.get('username')
    try:
        user=User.objects.get(username=username)
        allnotifications=Notification.objects.filter(friendname=user)
        serializer=NotificationSerializer(allnotifications,many=True)
            
        return Response({"notifications":serializer.data},status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"message": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message":"something unexpected occured"})


@api_view(["DELETE"])
def deletenotification(request):

    notification=Notification.objects.filter(id=request.query_params['id'])
    notification.delete()
    return Response({"message":"deleted"},status=status.HTTP_200_OK)
    


@api_view(['GET','POST'])
@authentication_classes([SessionAuthentication,TokenAuthentication])
@permission_classes([IsAuthenticated])
def followers(request):
    if request.method == 'GET':
        print("yes")
        user = User.objects.get(username =request.query_params["follower"] )
        followingObj = Follower.objects.filter(follower = user.id)
        followingSerializer = FollowerSerializer(followingObj, many=True)

        return Response({"followed": followingSerializer.data}, status=status.HTTP_200_OK)
    
    elif request.method=='POST':
        try:
            follower = User.objects.get(username = request.data['follower']) 
            followed = User.objects.get(username = request.data['followed']) 
            print("fine till here", followed, follower)
        except User.DoesNotExist:  
            return Response({"message":"User Does not exist"}, status=status.HTTP_404_NOT_FOUND)

        if Follower.objects.filter(follower = follower, followed = followed).exists():
            return Response({"message":"Already Followed"}, status=status.HTTP_200_OK)
        followingObj = Follower.objects.create(
            followed = followed,
            follower = follower
        )
        followingData=FollowerSerializer(followingObj).data
        return Response({
                "message":"Follower Added",
                "followed":followingData
            }, status=status.HTTP_201_CREATED)