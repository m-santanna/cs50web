from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Posts(models.Model):
    text = models.CharField(max_length=280)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post_owner')
    image = models.URLField(blank=True)
    def __str__(self):
        return f'Text: {self.text}, from: {self.owner} with image: {self.image}'
    

class Likes(models.Model):
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name='posts_likes')
    users = models.ManyToManyField(User, blank=True, related_name='users_likes')
    def __str__(self):
        return f'The post: {self.post} was liked by: {self.users}'
    
class Comments(models.Model):
    text = models.CharField(max_length=280)
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name='posts_comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_comments')
    def __str__(self):
        return f'The post: {self.post} was commented by: {self.users} with the following message: {self.text}'
    
class Follow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_following')
    following = models.ManyToManyField(User, blank=True, related_name='following_users')
    def __str__(self):
        return f'The user: {self.user} follows: {self.following}'
    