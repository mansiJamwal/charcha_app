from django.contrib import admin

# Register your models here.
from .models import  Post ,Comments, Likes, Categories
admin.site.register(Post)
admin.site.register(Comments)
admin.site.register(Likes)
admin.site.register(Categories)
