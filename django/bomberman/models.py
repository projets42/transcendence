from django.db import models

class Bomberman(models.Model):
    winner = models.CharField(max_length = 15, default = "winner")
    loser = models.CharField(max_length = 15, default = "loser")
    winner_score = models.IntegerField(default = 0)
    loser_score = models.IntegerField(default = 0)
    date = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return "Bomberman"

    class Meta:
        verbose_name = "game"
        verbose_name_plural = "Bomberman games"


class BombermanTournament(models.Model):
    creator = models.CharField(max_length = 15)
    player1 = models.CharField(max_length = 15)
    player2 = models.CharField(max_length = 15, null = True, blank = True)
    winner = models.CharField(max_length = 15, null = True, blank = True)

    def __str__(self):
        return "Bomberman Tournament"

    class Meta:
        verbose_name = "Tournament"
        verbose_name_plural = "Tournaments"