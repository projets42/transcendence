from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages


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


def register_user(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)

        if form.is_valid():
            form.save()
            messages.info(request, "Account created")
    else:
        form = UserCreationForm()

    return render(request, "index.html", {"page": "register", "form": form})


def logout_user(request):
    logout(request)
    return redirect("index")


def show_profile(request):
    return render(request, "index.html", {"page": "profile"})