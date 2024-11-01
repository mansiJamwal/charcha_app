from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Post(models.Model):
    heading = models.TextField(default='No Heading')
    username= models.ForeignKey(User,null=False,on_delete=models.CASCADE,related_name='post_created_by')
    post_val = models.TextField() 
    sent_time = models.CharField(max_length=255)


class Likes(models.Model):
    postId = models.ForeignKey(Post, null=False , on_delete=models.CASCADE, related_name='postid_like')
    username = models.ForeignKey(User,null=False,on_delete=models.CASCADE,related_name='post_liked_by')

class Comments(models.Model):
    postId = models.ForeignKey(Post, null=False , on_delete=models.CASCADE, related_name='postid_comment')
    username = models.ForeignKey(User,null=False,on_delete=models.CASCADE,related_name='post_comment_by')
    comment_val = models.TextField()
    sent_time = models.CharField(max_length=255)

class Categories(models.Model):
    postId = models.ForeignKey(Post, null=False , on_delete=models.CASCADE, related_name='postid_category') 
    category_name = models.CharField(max_length=255)
