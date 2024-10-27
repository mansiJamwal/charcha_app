from django.contrib import admin
from django.urls import path,re_path, include
from . import views


urlpatterns = [
    path("admin/", admin.site.urls),
    re_path("signup",views.signup),
    re_path("signin",views.signin),
    re_path("test_token",views.test_token),
    path("users/", views.users),
    path("posts/", include('posts.urls')),
    path("message/", include('message.urls')),
    path("notification/",include('notifications.urls'))
]
