# Generated by Django 5.0.6 on 2024-08-22 18:41

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Bomberman',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('winner', models.CharField(default='winner', max_length=15)),
                ('loser', models.CharField(default='loser', max_length=15)),
                ('winner_id', models.IntegerField(default=-1)),
                ('loser_id', models.IntegerField(default=-1)),
                ('winner_score', models.IntegerField(default=0)),
                ('loser_score', models.IntegerField(default=0)),
                ('date', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'game',
                'verbose_name_plural': 'Bomberman games',
            },
        ),
        migrations.CreateModel(
            name='BombermanTournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creator', models.IntegerField(default=0)),
                ('player1', models.CharField(max_length=15)),
                ('player2', models.CharField(blank=True, max_length=15, null=True)),
                ('winner', models.CharField(blank=True, max_length=15, null=True)),
            ],
            options={
                'verbose_name': 'Tournament',
                'verbose_name_plural': 'Tournaments',
            },
        ),
    ]
