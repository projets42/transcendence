# Generated by Django 3.2.25 on 2024-09-12 11:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pong',
            name='creator',
            field=models.IntegerField(default=0),
        ),
    ]