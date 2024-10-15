from django.contrib import admin

# Register your models here.
from .models import  Friend ,Message
admin.site.register(Friend)
admin.site.register(Message)
