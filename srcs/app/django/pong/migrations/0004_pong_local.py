# Generated by Django 3.2.25 on 2024-09-12 11:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0003_auto_20240912_1321'),
    ]

    operations = [
        migrations.AddField(
            model_name='pong',
            name='local',
            field=models.BooleanField(default=True),
        ),
    ]
