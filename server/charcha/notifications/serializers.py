from rest_framework import serializers
from .models import Notification
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
        representation['username'] = instance.username.username  # Get the actual username
        representation['friendname'] = instance.friendname.username  # Get the actual friend's username
        return representation

