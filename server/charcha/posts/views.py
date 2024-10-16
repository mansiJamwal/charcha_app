from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Post, Comments, Likes, Categories
from .serializers import PostSerializer, CommentsSerializer, LikesSerializer, CategoriesSerializer
from datetime import datetime
from django.db.models import Count
from django.contrib.postgres.aggregates import ArrayAgg
# Create your views here.


@api_view(["GET"])
def index(request):
    return Response({
        "msg": "posts index"
    })

# return post in json format with post object, no comments, number of likes, all categories
@api_view(["GET"])
def posts(request):
    allPostsObj = Post.objects.all()
    serializer = PostSerializer(allPostsObj, many=True)
    if serializer.is_valid():
        likes_grouped_by_post = Likes.objects.values('postId').annotate(like_count = Count('id'))
        categories_grouped_by_post = Categories.objects.values('postId').annotate(category_names=ArrayAgg('category_name'))
        
        likes_dict = {item['postId']: item['like_count'] for item in likes_grouped_by_post}
        categories_dict = {item['postId']: item['category_names'] for item in categories_grouped_by_post}

        all_posts = []
        for post in allPostsObj:
            all_posts.append({
                "id": post.id,
                "username": post.username,
                "post_val": post.post_val,
                "sent_time":post.sent_time,
                "likes": likes_dict.get(post.id, 0),
                "categories":categories_dict.get(post.id, [])
            })

        return Response({ "posts":all_posts }, status=status.HTTP_200_OK)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST"])
def comments(request):
    if request.method == "GET":
        allCommentsObj = Comments.objects.filter(postId = request.data['postId'])
        serializer = CommentsSerializer(allCommentsObj, many=True)
        if serializer.is_valid():
            return Response({ "comments":serializer.data }, status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    reqComment = {
        'postId': request.data['postId'],
        'username': request.data['username'],
        'comment_val': request.data['comment_val'],
        'sent_time': datetime.now().strftime("%d/%m/%Y:%H:%M:%S")
    }
    serializer = CommentsSerializer(data = reqComment)
    if serializer.is_valid():
        # comment = Comments(request.data)
        serializer.save()
        return Response({"message":"Added Comment!!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
def like(request):
    serializer =  LikesSerializer(data = { 
        "postId" : request.data['postId'], 
        "username" : request.data['username'] 
    })

    if not serializer.is_valid():
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

    likedRow = Likes.objects.filter(postId = request.data['postId'], username = request.data['username'])
    if request.data['status']==True and not likedRow.exists():
        newLikeRow = Likes(postId = serializer.validated_data['postId'], username = serializer.validated_data['username'])
        newLikeRow.save()
    elif request.data['status']==False and likedRow.exists():
        likedRow.delete()
    
    return Response({"message":"Updated!"},status=status.HTTP_200_OK)
        