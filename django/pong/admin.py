from django.contrib import admin
from .models import Pong, PongTournament

@admin.register(Pong)
class PongAdmin(admin.ModelAdmin):
	list_display = ('id', 'date', 'winner', 'loser', 'winner_score', 'loser_score')

@admin.register(PongTournament)
class PongTournamentAdmin(admin.ModelAdmin):
	list_display = ('creator', 'player1', 'player2', 'winner')