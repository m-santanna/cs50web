from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('create', views.create_listing, name='create'),
    path('listing/<int:listing_id>', views.listings, name='listings'),
    path('categories', views.categories_index, name='categories_index'),
    path('categories/<str:category_title>', views.categories_page, name='categories_page'),
    path('comments/<int:listing_id>', views.comments, name='comments'),
    path('close/<int:listing_id>', views.close, name='close'),
    path('reopen/<int:listing_id>', views.reopen, name='reopen'),
    path('bid/<int:listing_id>', views.bid, name='bid'),
    path('listing-not-found', views.listingNotFound, name='listing_not_found')
]
