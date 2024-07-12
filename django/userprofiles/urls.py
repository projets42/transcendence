from django.contrib import admin
from django.urls import path
from .views import *

app_name = "userprofiles"

urlpatterns = [
    path('login/', login_user, name = 'login'),
    path('register/', register_user, name = 'register'),
    path('logout/', logout_user, name = 'logout'),
    path('profile/', show_profile, name = 'profile'),
]
