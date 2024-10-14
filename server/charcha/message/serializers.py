from rest_framework import serializers
from .models import Room,Message,Friend

class FriendSerializer(serializers.ModelSerializer):
    username=serializers.CharField()
    friendname=serializers.CharField()
    class Meta(object):
        model=Friend
        fields=['username','friendname']

class RoomSerializer(serializers.ModelSerializer):
    roomname=serializers.CharField()
    class Meta(object):
        model=Room
        fields=['roomname']

class MessageSerializer(serializers.ModelSerializer):
    class Meta(object):
        model=Message
        fields=['id','roomname','username','message_val','sent_time']
