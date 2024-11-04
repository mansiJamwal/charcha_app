from django.urls import path
from . import views
urlpatterns = [
    path("", views.index, name="posts_index"),
    path("posts/", views.posts, name="get_posts"),
    path("post/", views.post, name="get_post"),
    path("categories/", views.categories, name="get_posts"),
    path("comments/", views.comments, name="add_or_get_comments"),
    path("like/",views.like, name='like_unlike'),
]
