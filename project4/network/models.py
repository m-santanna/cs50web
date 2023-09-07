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
    
    def serialize(self):
        return {
            'id': self.id,
            'text': self.text,
            'owner': self.owner.username,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            'likes': [like.username for like in self.likes.all()]
        }

    
class Follow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_following')
    follows = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following_users')

    def __str__(self):
        return f'The user: {self.user} follows: {self.follows}'
    
    def serialize(self):
        return {
            'follower': self.user.username,
            'follows': self.follows.username
        }
    