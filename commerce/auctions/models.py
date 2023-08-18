from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    username = models.CharField(max_length=32)
    password = models.CharField(max_length=64)
    email = models.EmailField()

class Listing(models.Model):
    title = models.CharField(max_length=64)
    image = models.ImageField(upload_to='listings', blank=True)
    description = models.CharField()
    price = models.IntegerField()

class Bid(models.Model):
    current_bid = models.IntegerField()
