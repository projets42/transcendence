from django.contrib import admin
from django.urls import path
from .views import *

app_name = "userprofiles"

urlpatterns = [
    path('login/', login_user, name = 'login'),
    path('register/', register_user, name = 'register'),
    path('profile/', show_profile, name = 'profile'),
    path('modif_username/', modify_username, name = 'modif_name'),
    path('modif_picture/', modify_userpicture, name = 'modif_picture'),
    path('logout/', logout_user, name = 'logout'),
    path('ponggames/', pong_games, name = 'pong_games'),
    path('pongvictories/', pong_victories, name = 'pong_victories'),
    path('pongdefeats/', pong_defeats, name = 'pong_defeats'),
    path('bombermangames/', bbm_games, name = 'bbm_games'),
    path('bombermanvictories/', bbm_victories, name = 'bbm_victories'),
    path('bombermandefeats/', bbm_defeats, name = 'bbm_defeats'),
    path('bombermandraws/', bbm_draws, name = 'bbm_draws'),
    path('friends/', list_friends, name = 'friends'),
    path('request/', show_friend_request, name = 'friend_request'),
]
