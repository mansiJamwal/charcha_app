from rest_framework import serializers
from .models import Post, Likes, Comments, Categories


class PostSerializer(serializers.ModelSerializer):
    # username = serializers.CharField()
    # friendname = serializers.CharField()
    class Meta(object):
        model=Post
        fields=['id','username','post_val','sent_time','heading']


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['username'] = instance.username.username  # Get the actual username
        return representation


class CommentsSerializer(serializers.ModelSerializer):
    # username = serializers.CharField()
    # friendname = serializers.CharField()
    class Meta(object):
        model=Comments
        fields=['id','postId','username','sent_time','comment_val']


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['username'] = instance.username.username  # Get the actual username
        representation['postId'] =  instance.postId.id # Get the actual username
        return representation


class LikesSerializer(serializers.ModelSerializer):
    # username = serializers.CharField()
    # friendname = serializers.CharField()
    class Meta(object):
        model=Likes
        fields=['id','postId','username']


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['username'] = instance.username.username  # Get the actual username
        representation['postId'] =  instance.postId.id # Get the actual id
        return representation



class CategoriesSerializer(serializers.ModelSerializer):
    class Meta(object):
        model=Categories
        fields=['id','postId','category_name']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['postId'] = instance.postId.id  # Get the actual username
        return representation
