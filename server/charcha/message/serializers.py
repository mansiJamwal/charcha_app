from rest_framework import serializers
from .models import Message,Friend


class FriendSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    friendname = serializers.CharField()
    class Meta(object):
        model=Friend
        fields=['id','username','friendname']

class MessageSerializer(serializers.ModelSerializer):
    class Meta(object):
        model=Message
        fields=['id','username','friendname','message_val','sent_time','read']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['username'] = instance.username.username  # Get the actual username
        representation['friendname'] = instance.friendname.username  # Get the actual friend's username
        return representation
