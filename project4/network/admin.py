from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(User)
admin.site.register(Posts)
admin.site.register(Likes)
admin.site.register(Comments)
admin.site.register(Follow)