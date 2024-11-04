from django.urls import path
from . import views
urlpatterns = [
    path("addnotification/", views.addnotification, name="addnotification"),
    path("getnotifications/",views.getnotifications,name="getnotifications"),
    path("deletenotification/",views.deletenotification,name="deletenotification"),
    path('followers/', views.followers, name='followers' )
    
]