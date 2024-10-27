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


class Message(models.Model):
    username=models.ForeignKey(User,null=False,on_delete=models.CASCADE,related_name='message_sent_by')
    friendname=models.ForeignKey(User,null=False,on_delete=models.CASCADE,related_name='message_recieved_by')
    message_val=models.TextField()
    sent_time=models.CharField(max_length=255)
    read=models.BooleanField(default=False)
