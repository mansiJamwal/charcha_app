from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Post, Comments, Likes, Categories
from django.contrib.auth.models import User
from .serializers import PostSerializer, CommentsSerializer, LikesSerializer, CategoriesSerializer
from datetime import datetime
from django.db.models import Count
from django.contrib.postgres.aggregates import ArrayAgg
from rest_framework.decorators import authentication_classes,permission_classes
from rest_framework.authentication import SessionAuthentication,TokenAuthentication
from rest_framework.permissions import IsAuthenticated
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
    likes_grouped_by_post = Likes.objects.values('postId').annotate(like_count = Count('id'))
    likes_dict = {item['postId']: item['like_count'] for item in likes_grouped_by_post}
    print(likes_dict)
    all_posts = []
    for post in serializer.data:
        if post['id'] in likes_dict:
            post['likes'] = likes_dict[post['id']]
        else:
            post['likes'] = 0
    
        all_posts.append(post)
    return Response({ "posts":all_posts }, status=status.HTTP_200_OK)
    

@api_view(["GET"])
def post(request):
    try:
        print(request.query_params["postId"])
        # user = User.objects.get(username = request.query_params["username"])
        postObj = Post.objects.get( id =  int(request.query_params["postId"]) )
        postSer = PostSerializer(postObj)
        likes_grouped_by_post = Likes.objects.values('postId').annotate(like_count = Count('id'))
        likes_dict = {item['postId']: item['like_count'] for item in likes_grouped_by_post}
        
        updated_post = postSer.data.copy()
        print("hi", updated_post)
        if updated_post['id'] in likes_dict :
            updated_post["likes"] = likes_dict[updated_post['id']] 
        else:
           updated_post["likes"] = 0
        
        return Response(updated_post)
    except:
        return Response({"message":"Post Not Found"},status=status.HTTP_404_NOT_FOUND)
        



@api_view(["GET"])
def categories(request):
    allCategories = Categories.objects.all()
    serializer = CategoriesSerializer(allCategories, many=True)

    return Response({ "categories":serializer.data }, status=status.HTTP_200_OK)



@api_view(["GET", "POST"])
def comments(request):
    if request.method == "GET":
        try:
            print(request.query_params["postId"])

            allCommentsObj = Comments.objects.filter(postId = int(request.query_params['postId']))
            serializer = CommentsSerializer(allCommentsObj, many=True)
            
            return Response({
                "comments": serializer.data
            }, status=status.HTTP_200_OK)
        except:
            return Response({"message":"Comments Not Found"},status=status.HTTP_404_NOT_FOUND)
        
    
    if request.method == "POST":
        try:
            print("hello")
            postObj = Post.objects.get( id = int(request.data["postId"]) )
            user=User.objects.get(username = request.data['username'])
            print(postObj, user)

            serializer = CommentsSerializer(data = {
                'postId': postObj.id,
                'username': user.id ,
                'comment_val': request.data['comment_val'],
                'sent_time': datetime.now().strftime("%d/%m/%Y:%H:%M:%S")
            })
            if serializer.is_valid():
                # comment = Comments(request.data)
                commentObj = Comments.objects.create(
                    postId = postObj,
                    username = user,
                    comment_val = serializer.validated_data["comment_val"],
                    sent_time = serializer.validated_data['sent_time']
                )

                comment=CommentsSerializer(commentObj).data

                return Response({"comment":comment}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors,status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET","POST", "DELETE"])
@authentication_classes([SessionAuthentication,TokenAuthentication])
@permission_classes([IsAuthenticated])
def like(request):
    # print("hello")
    if request.method == "GET":
        # print(request.query_params['username'], int(request.query_params['postId']), "hello wassup")
        user = User.objects.get(username = request.query_params['username'])
        post = Post.objects.get(id = int(request.query_params['postId']))
        # print(user.id, post.id)
        serializer =  LikesSerializer(data = { 
            "postId" : post.id,
            "username" : user.id
        })

        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
        liked = Likes.objects.filter(postId=post.id, username = user.id ).exists()
        return Response({"message": "Liked" if liked else "Unliked"}, status=status.HTTP_200_OK)

    elif request.method == "POST":
        user = User.objects.get(username = request.data['username'])
        post = Post.objects.get(id = int(request.data['postId']))
        serializer =  LikesSerializer(data = { 
            "postId" : post.id,
            "username" : user.id
        })

        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        newLikeRow = Likes(postId = post, username = user)
        newLikeRow.save()
        return Response({"message":"Added"},status=status.HTTP_200_OK)


    elif request.method == "DELETE":
        user = User.objects.get(username = request.query_params['username'])
        post = Post.objects.get(id = int(request.query_params['postId']))
        # print(user.id, post.id)
        serializer =  LikesSerializer(data = { 
            "postId" : post.id,
            "username" : user.id
        })

        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
        likedRow = Likes.objects.filter(postId = post.id, username = user.id)
        if likedRow.exists():
            likedRow.delete()
        return Response({"message":"Deleted"},status=status.HTTP_200_OK)
    
        