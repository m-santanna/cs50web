from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseNotFound
from django.shortcuts import render
from django.urls import reverse
from .models import *
from django.contrib.auth.decorators import login_required
from django import forms


class BidForm(forms.ModelForm):
    class Meta:
        model = Bid
        fields = ["current_bid"]
        labels = {
            "current_bid": ("")
        }
        widgets = {
            "current_bid": forms.NumberInput(attrs={
                "placeholder": "Bid",
                "class": "form-control"
            })
        }

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comments
        fields = ["text"]
        labels = {
            "text": ("")
        }
        widgets = {
            "text": forms.Textarea(attrs={
                "placeholder": "Add a comment here",
                "class": "form-control",
                "rows": 1
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
        return HttpResponseRedirect('/listing/' + str(new_listing.id))
    return render(request, 'auctions/create.html', {
        'categories':categories
    })

@login_required(login_url='login')
def listings(request, listing_id):
    try:
        listing = Listing.objects.get(pk=listing_id)
    except Listing.DoesNotExist:
        return HttpResponseRedirect('/listing/doesnt-exist')
    
    comments = Comments.objects.filter(listing = listing)

    if request.user == listing.owner:
        return render(request, 'auctions/listing_owner.html', {
            'listing':listing,
            'user':request.user,
            'comments':comments,
            'comment_form':CommentForm()
        })
    return render(request, 'auctions/listing_visitor.html', {
            'listing':listing,
            'user':request.user,
            'comments':comments,
            'comment_form':CommentForm(),
            'bid_form':BidForm()
        })

def close(request, listing_id):
    try:
        listing = Listing.objects.get(pk=listing_id)
    except Listing.DoesNotExist:
        return HttpResponseRedirect('/listing/doesnt-exist')
    
    if request.method == 'POST':
        listing.online = False
        listing.save()
        return HttpResponseRedirect("/listing/" + str(listing_id))
    return HttpResponseNotFound("This url does not support GET")

def reopen(request, listing_id):
    try:
        listing = Listing.objects.get(pk=listing_id)
    except Listing.DoesNotExist:
        return HttpResponseRedirect('listing/doesnt-exist')
    
    if request.method == 'POST':
        listing.online = True
        listing.save()
        return HttpResponseRedirect("/listing/" + str(listing_id))
    return HttpResponseNotFound("This url does not support GET")

def comments(request, listing_id):   
    try:
        listing = Listing.objects.get(pk=listing_id)
    except Listing.DoesNotExist:
        return HttpResponseRedirect('/listing/doesnt-exist')
    
    if request.method == 'POST':
        formComment = CommentForm(request.POST)
        
        if formComment.is_valid():
            data = formComment.cleaned_data['text']
            comment = Comments(
                user = request.user,
                text = data,
                listing = listing
            )
            comment.save()
            return HttpResponseRedirect("/listing/" + str(listing_id))
        else:
            return HttpResponseNotFound('Comment not valid!')
    else:
        return HttpResponseNotFound('This url does not support GET')
    

def bid(request, listing_id): 
    try:
        listing = Listing.objects.get(pk=listing_id)
    except Listing.DoesNotExist:
        return HttpResponseRedirect('/listing/doesnt-exist')

    formBid = BidForm(request.POST)
    if formBid.is_valid():
        data = float(formBid.cleaned_data['current_bid'])
        if data > listing.price:
            bid = Bid(
                current_bid = data,
                user = request.user,
                listing = listing
            )
            bid.save()
            listing.price = bid.current_bid
            listing.winner = bid.user
            listing.save()
            return HttpResponseRedirect("/listing/" + str(listing_id))
        else:
            return HttpResponseNotFound('Bid must be greater than the current price!')


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

def listingDoesntExist(request):
    return render(request, 'auctions/listingDoesntExist.html')