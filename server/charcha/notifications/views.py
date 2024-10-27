from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Notification
from .serializers import NotificationSerializer
from datetime import datetime
from django.contrib.auth.models import User
import logging

logger = logging.getLogger(__name__)

# Create your views here.
@api_view(["POST"])
def addnotification(request):
    serializer=NotificationSerializer(data=request.data)
    if serializer.is_valid():
        notification_val=serializer.validated_data['notification_val']
        notification_type=serializer.validated_data['notification_type']
        sent_time=datetime.now().strftime("%d/%m/%Y:%H:%M:%S")
        username=serializer.validated_data['username']
        friendname=serializer.validated_data['friendname']
        try:
            user=User.objects.get(username=username)
            friend=User.objects.get(username=friendname)
            notification=Notification(notification_type=notification_type,notification_val=notification_val,sent_time=sent_time,username=user,friendname=friend)
            notification.save()

            response_serializer=NotificationSerializer(notification)
            return Response({"notification":response_serializer.data},status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({"message":"either user or the friend does not exist"},status=status.HTTP_404_NOT_FOUND) 
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response({"message": "Something unexpected occurred. Please try again"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
#by friend id we meant the notifaction was sent to
# when sending the request we will send it under user_id only so that we dont confuse it
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
    
