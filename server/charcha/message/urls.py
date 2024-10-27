from django.urls import path
from . import views
urlpatterns = [
    path("", views.index, name='message_index'),
    path("addfriend/",views.add_friend,name='add_friend'),
    path("getfriends/",views.get_friends,name="getfriends"),
    path("getmessages/",views.getmessages,name="getmessages"),
    path("readmessage/",views.readmessage,name="readmessage")
]
