from django.contrib import admin
from .models import Bomberman, BombermanTournament

@admin.register(Bomberman)
class BombermanAdmin(admin.ModelAdmin):
	list_display = ('id', 'date', 'winner', 'loser', 'winner_score', 'loser_score')

@admin.register(BombermanTournament)
class BombermanTournamentAdmin(admin.ModelAdmin):
	list_display = ('creator', 'player1', 'player2', 'winner')
