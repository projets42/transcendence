from django.db import models
from django.contrib.auth.models import User


class ProfileImg(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    picture = models.ImageField(null=True, blank=True, upload_to="images/")
