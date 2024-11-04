from rest_framework import serializers
from .models import Notification, Follower
from django.contrib.auth.models import User

class NotificationSerializer(serializers.ModelSerializer):

    username = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='username')
    friendname = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='username')
    sent_time = serializers.CharField(read_only=True)
    class Meta(object):
        model=Notification
        fields=['id','notification_type','notification_val','username','friendname','sent_time']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['username'] = instance.username.username  
        representation['friendname'] = instance.friendname.username  
        return representation

class FollowerSerializer(serializers.ModelSerializer):

    
    class Meta(object):
        model=Follower
        fields=['id','follower','followed']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['follower'] = instance.follower.username
        representation['followed'] = instance.followed.username  
        return representation

