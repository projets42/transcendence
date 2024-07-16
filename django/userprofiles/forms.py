from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class UserForm(UserCreationForm):
    picture = forms.ImageField(label = "Profile picture:")
    username = forms.CharField(max_length = 15)
    password2 = forms.CharField(label = "Password confirmation:", widget = forms.PasswordInput)

    class Meta:
        model = User
        fields = ('picture', 'username', 'password1', 'password2')