from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import UserForm, ModificationForm
from .models import ProfileImg
from django.contrib.auth.decorators import login_required
from bomberman.models import Bomberman
from pong.models import Pong
from django.db.models import Q

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
    username = request.user.username

    bbm_games = Bomberman.objects.all().filter(Q(winner = username) | Q(loser = username)).count()
    bbm_victories = Bomberman.objects.all().filter(winner = username, winner_score = 1).count()
    bbm_defeats = Bomberman.objects.all().filter(loser = username, winner_score = 1).count()
    bbm_draws = Bomberman.objects.all().filter(Q(winner = username) | Q(loser = username), winner_score = 0, loser_score = 0).count()

    games = Pong.objects.all().filter(Q(winner = username) | Q(loser = username)).count()
    victories = Pong.objects.all().filter(winner = username).count()
    defeats = Pong.objects.all().filter(loser = username).count()

    return render(request, "index.html", {"page": "profile", "games": games, "victories": victories, "defeats": defeats, "bbm_games": bbm_games, "bbm_victories": bbm_victories, "bbm_defeats": bbm_defeats, "bbm_draws": bbm_draws})


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


@login_required
def pong_games(request):
    username = request.user.username
    games = Pong.objects.all().filter(Q(winner = username) | Q(loser = username))
    return render(request, "index.html", {"page": "pong_games", "game_name": "Pong", "title": "history", "games": games})


@login_required
def pong_victories(request):
    username = request.user.username
    games = Pong.objects.all().filter(winner = username, winner_score = 1)
    return render(request, "index.html", {"page": "pong_games", "game_name": "Pong", "title": "victories", "games": games})


@login_required
def pong_defeats(request):
    username = request.user.username
    games = Pong.objects.all().filter(loser = username, winner_score = 1)
    return render(request, "index.html", {"page": "pong_games", "game_name": "Pong", "title": "defeats", "games": games})


@login_required
def bbm_games(request):
    username = request.user.username
    games = Bomberman.objects.all().filter(Q(winner = username) | Q(loser = username))
    return render(request, "index.html", {"page": "bbm_games", "game_name": "Bomberman", "title": "history", "games": games})


@login_required
def bbm_victories(request):
    username = request.user.username
    games = Bomberman.objects.all().filter(winner = username, winner_score = 1)
    return render(request, "index.html", {"page": "bbm_games", "game_name": "Bomberman", "title": "victories", "games": games})


@login_required
def bbm_defeats(request):
    username = request.user.username
    games = Bomberman.objects.all().filter(loser = username, winner_score = 1)
    return render(request, "index.html", {"page": "bbm_games", "game_name": "Bomberman", "title": "defeats", "games": games})


@login_required
def bbm_draws(request):
    username = request.user.username
    games = Bomberman.objects.all().filter(Q(winner = username) | Q(loser = username), winner_score = 0, loser_score = 0)
    return render(request, "index.html", {"page": "bbm_games", "game_name": "Bomberman", "title": "draws", "games": games})