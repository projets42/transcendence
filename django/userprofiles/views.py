from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import UserForm, ModificationForm
from .models import ProfileImg
from django.contrib.auth.decorators import login_required

def register_user(request):
    if request.method == 'POST':
        form = UserForm(request.POST, request.FILES)
        if form.is_valid():
            usr = form.save()
            img = ProfileImg(user=usr, picture=form.cleaned_data.get('picture'))
            img.save()
            messages.info(request, "Account created")
    else:
        form = UserForm()

    return render(request, "index.html", {"page": "register", "form": form})


def login_user(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username = username, password = password)

        if user is not None:
            login(request, user)
            return redirect("index")
        else:
            messages.info(request, "Wrong password or username")

    form = AuthenticationForm()
    return render(request, "index.html", {"page": "login", "form": form})


def logout_user(request):
    logout(request)
    return redirect("index")


@login_required
def show_profile(request):
    return render(request, "index.html", {"page": "profile"})


@login_required
def modify_user_infos(request):
    if request.method == 'POST':
        form = ModificationForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            messages.info(request, "Profile has been modified")
    else:
        form = ModificationForm()

    return render(request, "index.html", {"page": "modif_profile", "form": form})