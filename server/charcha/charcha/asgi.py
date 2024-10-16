import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

from posts.routing import websocket_urlpatterns as posts_websocket_urlpatterns
from message.routing import websocket_urlpatterns as message_websocket_urlpatterns

combined_websocket_urlpatterns = posts_websocket_urlpatterns + message_websocket_urlpatterns


application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(combined_websocket_urlpatterns))
        ),
})