from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Posts(models.Model):
    text = models.CharField(max_length=280)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post_owner')
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, blank=True, related_name='likes')

    def __str__(self):
        return f'Text: {self.text}, from: {self.owner}'

    
class Follow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_following')
    following = models.ManyToManyField(User, blank=True, related_name='following_users')
    def __str__(self):
        return f'The user: {self.user} follows: {self.following}'
    