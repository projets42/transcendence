from django.db import models
from django.contrib.auth.models import User


class ProfileImg(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    picture = models.ImageField(null=True, blank=True, upload_to="images/")

    class Meta:
        verbose_name = "Profile Picture"
        verbose_name_plural = "Profile Pictures"


class Friend(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    friend = models.IntegerField(default = -1)
    confirmed = models.BooleanField(default = False)


class Status(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    state = models.IntegerField(default = 0)
    date = models.DateTimeField(auto_now_add = True)

    class Meta:
        verbose_name = "Status"
        verbose_name_plural = "Status"


class Student42(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    login42 = models.CharField(max_length = 16, default = "")
    picture = models.CharField(max_length = 255, default = "")

    class Meta:
        verbose_name = "42 Student"
        verbose_name_plural = "42 Students"
