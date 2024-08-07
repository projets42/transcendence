from django.contrib import admin
from django.urls import path
from .views import *

app_name = "userprofiles"

urlpatterns = [
    path('login/', login_user, name = 'login'),
    path('register/', register_user, name = 'register'),
    path('profile/', show_profile, name = 'profile'),
    path('modif/', modify_user_infos, name = 'modif'),
    path('logout/', logout_user, name = 'logout'),
]
