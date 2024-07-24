from django.db import models

class Bomberman(models.Model):
    winner = models.CharField(max_length = 255)
    loser = models.CharField(max_length = 255)
    winner_score = models.IntegerField(default = 0)
    looser_score = models.IntegerField(default = 0)
    date = models.DateField()
