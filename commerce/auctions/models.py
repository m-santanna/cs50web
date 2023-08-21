from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Category(models.Model):
    title = models.CharField(max_length=64)
    def __str__(self):
        return f'{self.title}'


class Listing(models.Model):
    title = models.CharField(max_length=64)
    image = models.URLField(blank=True, max_length=512)
    description = models.CharField(max_length=512)
    online = models.BooleanField(default=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField(default=0)
    def __str__(self):
        return f'{self.title} owned by {self.owner}'

class Bid(models.Model):
    current_bid = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_bids')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='listing_bid')
    def __str__(self):
        return f'Current bid for {self.listing} is {self.current_bid} by {self.user}'

class Comments(models.Model):
    text = models.CharField(max_length=512)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_comments')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='listing_comments')
    def __str__(self):
        return f'Commented by {self.user} on {self.listing}: {self.text}'
    
class Watchlist(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watchlist")
    def __str__(self):
        return f"{self.listing} is in {self.user}'s watchlist"