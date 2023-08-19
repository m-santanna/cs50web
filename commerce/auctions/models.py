from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Category(models.Model):
    title = models.CharField(max_length=64)


class Listing(models.Model):
    title = models.CharField(max_length=64)
    image = models.URLField(blank=True)
    description = models.CharField(max_length=512)
    online = models.BooleanField(default=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(User, on_delete=models.CASCADE)


class Bid(models.Model):
    current_bid = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_bids')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='listing_bid')


class Comments(models.Model):
    text = models.CharField(max_length=512)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_comments')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='listing_comments')
