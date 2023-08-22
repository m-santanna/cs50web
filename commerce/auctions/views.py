from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseNotFound
from django.shortcuts import render
from django.urls import reverse
from .models import *
from django.contrib.auth.decorators import login_required
from django import forms


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comments
        fields = ['text']
        widget = {
            'text' : forms.CharField(max_length=512, attrs = {
            'placeholder':'Add a comment',
            'name':'add_comment'
            })  
        }

class BidForm(forms.ModelForm):
    class Meta:
        model = Bid
        fields = ["bid_price"]
        widgets = {
            "bid_price": forms.NumberInput(attrs={
                "placeholder": "Bid",
                "class": "form-control"
            })
        }


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
        new_listing.category = categories.get(title = request.POST['category'])
        new_listing.save()
        return HttpResponseRedirect(reverse('index'))
    return render(request, 'auctions/create.html', {
        'categories':categories
    })

@login_required(login_url='login')
def listings(request, listing_id):
    try:
        listing = Listing.objects.get(pk=listing_id)
    except Listing.DoesNotExist:
        return HttpResponseNotFound("This listing is not available or doesn't exist.")
    comments = Comments.objects.filter(listing = listing)
    if request.method == 'POST':
        formComment = CommentForm()
        formBid = BidForm()
        if formComment.is_valid():
            data = formComment.cleaned_data['text']
            comment = Comments(
                user = request.user,
                text = data,
                listing = listing
            )
            comment.save()
        else:
            return HttpResponseNotFound('Comment not valid!')
        
        if formBid.is_valid():
            data = float(formComment.cleaned_data['bid_price'])
            if data > listing.price:
                bid = Bid(
                    current_bid = data,
                    user = request.user,
                    listing = listing
                )
                bid.save()
                listing.price = bid.current_bid
                listing.save()
            else:
                return HttpResponseNotFound('Bid must be greater than the current price!')

        if request.POST['close']:
            pass
    else:
        if request.user == listing.owner:
            return render(request, 'auctions/listing_owner.html', {
                'listing':listing,
                'user':request.user,
                'comments':comments
            })
        return render(request, 'auctions/listing_visitor.html', {
                'listing':listing,
                'user':request.user,
                'comments':comments
            })

def categories_index(request):
    return render(request, 'auctions/categories_index.html', {
        'categories':Category.objects.all()
    })


def categories_page(request, category_title):
    category = Category.objects.get(title = category_title)
    listings = Listing.objects.filter(category = category)
    return render(request, 'auctions/categories_page.html', {
        'listings':listings
    })