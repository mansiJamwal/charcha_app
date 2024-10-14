from django.contrib import admin

# Register your models here.
from .models import Room, Friend ,Message

admin.site.register(Room)
admin.site.register(Friend)
admin.site.register(Message)
