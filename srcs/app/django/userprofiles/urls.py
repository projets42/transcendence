from django.contrib import admin
from django.urls import path
from .views import *

app_name = "userprofiles"

urlpatterns = [
    path('login/', login_user, name = 'login'),
    path('register/', register_user, name = 'register'),
    path('profile/', show_profile, name = 'show_profile'),
    path('modif_username/', modify_username, name = 'modif_name'),
    path('modif_picture/', modify_userpicture, name = 'modify_userpicture'),
    path('logout/', logout_user, name = 'logout'),
    path('ponggames/', pong_games, name = 'pong_games'),
    path('pongtournaments/', pong_tournaments, name = 'pong_tournaments'),
    path('bombermangames/', bbm_games, name = 'bbm_games'),
	path('friends/', friends, name = 'friends'),
    path('request/', show_friend_request, name = 'friend_request'),
    path('userinfo/', userinfo, name='userinfo'),
]
