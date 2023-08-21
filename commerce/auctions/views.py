from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import *
from django.contrib.auth.decorators import login_required

def index(request):
    listings = Listing.objects.all()
    return render(request, "auctions/index.html", {
        'listings': listings
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


def create_listing(request):
    new_listing = Listing()
    categories = Category.objects.all()
    if request.method == 'POST':
        new_listing.title = request.POST['title'] 
        new_listing.description = request.POST['description']
        new_listing.owner = request.user
        new_listing.image = request.POST['image']
        new_listing.price = request.POST['price']
        new_listing.category = Category.objects.get(title = request.POST['category'])
        new_listing.save()
        return HttpResponseRedirect(reverse('index'))
    return render(request, 'auctions/create.html', {
        'categories':categories
    })

@login_required(login_url='login')
def listings(request, listing_id):
    listing = Listing.objects.get(pk=listing_id)
    this_bid = Bid.objects.get(user=request.user)
    comments = Comments.objects.get(listing=listing)
    if request.method == 'POST':
        if request.POST['bid'] <= listing.price:
            return render(request, 'auctions/listing.html', {
                'message':'You must bid more than the current price!'
            })
    return render(request, 'auctions/listing.html', {
        'listing':listing,
        'user_id':request.user.id,
        'this_bid':this_bid,
        'comments':comments
    })


def categories_index(request):
    return render(request, 'auctions/categories_index.html', {
        'categories':Category.objects.all()
    })


def categories_page(request):
    pass