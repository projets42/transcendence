from django.contrib import admin
from django.urls import path
from .views import *

app_name = "pong"

urlpatterns = [
    path('local/', start_local_game, name = 'play_local'),
    path('tournament/', start_tournament, name = 'play_tournament'),
]
