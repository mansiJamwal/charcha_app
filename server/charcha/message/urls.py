from django.urls import path
from . import views
urlpatterns = [
    path("", views.index, name='message_index'),
    path("addfriend/",views.add_friend,name='add_friend'),
    path("addroom/",views.add_room,name="add_room"),
    path("getmessages/",views.getmessages,name="getmessages"),
]
