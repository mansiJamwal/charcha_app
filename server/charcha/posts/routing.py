from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/posts/(?P<room_name>\w+)/$", consumers.PostsConsumer.as_asgi()),
]