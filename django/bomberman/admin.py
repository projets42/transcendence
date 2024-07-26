from django.contrib import admin
from .models import Bomberman

@admin.register(Bomberman)
class BombermanAdmin(admin.ModelAdmin):
	list_display = ('id', 'date', 'winner', 'loser', 'winner_score', 'loser_score')