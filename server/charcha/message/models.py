from django.db import models

# Create your models here.
from django.contrib.auth.models import User

# Create your models here.
# friends
# rooms
# messages

class Friend(models.Model):
    username=models.ForeignKey(User,null=False,on_delete=models.CASCADE,related_name='friends_as_username')
    friendname=models.ForeignKey(User,null=False,on_delete=models.CASCADE,related_name='friends_as_friendname')

class Room(models.Model):
    roomname=models.CharField(max_length=255)

    def __str__(self):
        return self.roomname


class Message(models.Model):
    roomname=models.ForeignKey(Room,null=False,on_delete=models.CASCADE)
    username=models.ForeignKey(User,null=False,on_delete=models.CASCADE)
    message_val=models.TextField()
    sent_time=models.CharField(max_length=255)
