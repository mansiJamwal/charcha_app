from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Notification(models.Model):
    notification_val=models.CharField(max_length=255)
    notification_type=models.CharField(max_length=255)
    username=models.ForeignKey(User,null=False,on_delete=models.CASCADE,related_name='notification_sent_by')
    friendname=models.ForeignKey(User,null=False,on_delete=models.CASCADE,related_name='notification_received_by')
    sent_time=models.CharField(max_length=255)

class Follower(models.Model):
    follower = models.ForeignKey(User,null=False,on_delete=models.CASCADE,related_name='followrequest_sent_by')
    followed = models.ForeignKey(User,null=False,on_delete=models.CASCADE,related_name='followrequest_received_by')