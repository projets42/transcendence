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
    path('bombermangames/', bbm_games, name = 'bbm_games'),
    path('bombermanvictories/', bbm_victories, name = 'bbm_victories'),
    path('bombermandefeats/', bbm_defeats, name = 'bbm_defeats'),
    path('bombermandraws/', bbm_draws, name = 'bbm_draws'),
]
