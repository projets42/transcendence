from django.db import models

class Pong(models.Model):
    winner = models.CharField(max_length = 15, default = "winner")
    loser = models.CharField(max_length = 15, default = "loser")
    winner_id = models.IntegerField(default = -1)
    loser_id = models.IntegerField(default = -1)
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
