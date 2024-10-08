from django.db import models

class Pong(models.Model):
    local = models.BooleanField(default = True)
    creator = models.IntegerField(default = 0)
    winner = models.CharField(max_length = 15, default = "player1")
    loser = models.CharField(max_length = 15, default = "player2")
    winner_score = models.IntegerField(default = 3)
    loser_score = models.IntegerField(default = 0)
    date = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return "Pong"

    class Meta:
        verbose_name = "game"
        verbose_name_plural = "Pong games"


class PongTournament(models.Model):
    creator = models.IntegerField(default = 0)
    player1 = models.CharField(max_length = 15)
    player2 = models.CharField(max_length = 15, null = True, blank = True)
    winner = models.CharField(max_length = 15, null = True, blank = True)
    loser_score = models.IntegerField(default = 0)

    def __str__(self):
        return "Pong Tournament"

    class Meta:
        verbose_name = "Tournament"
        verbose_name_plural = "Tournaments"
