from django.contrib import admin
from django.urls import path
from .views import *

app_name = "bomberman"

urlpatterns = [
    path('', game, name = 'game'),
]
