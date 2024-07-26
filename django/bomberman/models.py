from django.db import models

class Bomberman(models.Model):
    winner = models.CharField(max_length = 255, null = True, blank = True)
    loser = models.CharField(max_length = 255, null = True, blank = True)
    winner_score = models.IntegerField(default = 0)
    loser_score = models.IntegerField(default = 0)
    date = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return "Bomberman"

    class Meta:
        verbose_name = "game"
        verbose_name_plural = "Bomberman games"
