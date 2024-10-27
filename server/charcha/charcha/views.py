from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.decorators import authentication_classes,permission_classes
from rest_framework.authentication import SessionAuthentication,TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import Http404 


@api_view(["GET"])
def users(request):
    allUsers = User.objects.all()
    serializer = UserSerializer(allUsers, many=True)

    limitedData = []
    for user in serializer.data:
        print(user)
        newUser = {
            "username":user["username"],
            "email":user["email"],
            "id":user["id"]
        }

        limitedData.append(newUser)
    return Response({ "users": limitedData })

@api_view(['POST'])
def signin(request):
    try:
        # Try to find the user by email
        user = User.objects.get(email=request.data['email'])
    except User.DoesNotExist:
        # Return a general error if user is not found
        return Response({"detail": "Invalid email or password."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the password is correct
    if not user.check_password(request.data['password']):
        return Response({"detail": "Invalid email or password."}, status=status.HTTP_400_BAD_REQUEST)

    # If authentication is successful, create or get the token
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({"token": token.key, "user": serializer.data})


@api_view(['POST'])
def signup(request):
    if User.objects.filter(email=request.data['email']).exists():
        return Response({"detail": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)
    serializer=UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user=User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token=Token.objects.create(user=user)
        return Response({"token":token.key,"user":serializer.data})
    
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([SessionAuthentication,TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response({"email":request.user.email,"username":request.user.username,"id":request.user.id})




