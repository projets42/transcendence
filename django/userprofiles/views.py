from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import UserForm, ModificationForm, ModificationPictureForm
from .models import ProfileImg, Friend
from django.contrib.auth.decorators import login_required
from bomberman.models import Bomberman
from pong.models import Pong
from django.db.models import Q
from django.contrib.auth.models import User

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
    user_id = request.user.id

    friends = Friend.objects.all().filter(user = request.user, confirmed = True).count()

    bbm_games = Bomberman.objects.all().filter(Q(winner_id = user_id) | Q(loser_id = user_id)).count()
    bbm_victories = Bomberman.objects.all().filter(winner_id = user_id, winner_score = 1).count()
    bbm_defeats = Bomberman.objects.all().filter(loser_id = user_id, winner_score = 1).count()
    bbm_draws = Bomberman.objects.all().filter(Q(winner_id = user_id) | Q(loser = user_id), winner_score = 0, loser_score = 0).count()

    games = Pong.objects.all().filter(Q(winner_id = user_id) | Q(loser_id = user_id)).count()
    victories = Pong.objects.all().filter(winner_id = user_id).count()
    defeats = Pong.objects.all().filter(loser_id = user_id).count()

    return render(request, "index.html", {"page": "profile", "friends": friends, "games": games, "victories": victories, "defeats": defeats, "bbm_games": bbm_games, "bbm_victories": bbm_victories, "bbm_defeats": bbm_defeats, "bbm_draws": bbm_draws})


@login_required
def modify_username(request):
    if request.method == 'POST':
        form = ModificationForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.info(request, "Username has been modified")
    else:
        form = ModificationForm()

    return render(request, "index.html", {"page": "modif_username", "form": form})


@login_required
def modify_userpicture(request):
    if request.method == 'POST':
        form = ModificationPictureForm(request.POST, request.FILES, instance=request.user)
        if (request.FILES):
            picture = ProfileImg.objects.all().filter(user = request.user)
            if picture:
                user = picture[0]
                user.picture = request.FILES["picture"]
                user.save()
            else:
                new_picture = ProfileImg.objects.create(user = request.user, picture = request.FILES["picture"])
            messages.info(request, "Picture has been modified")
    else:
        form = ModificationPictureForm()

    return render(request, "index.html", {"page": "modif_picture", "form": form})


@login_required
def pong_games(request):
    user_id = request.user.id
    games = Pong.objects.all().filter(Q(winner_id = user_id) | Q(loser_id = user_id))
    return render(request, "index.html", {"page": "pong_games", "game_name": "Pong", "title": "history", "games": games})


@login_required
def pong_victories(request):
    user_id = request.user.id
    games = Pong.objects.all().filter(winner_id = user_id, winner_score = 1)
    return render(request, "index.html", {"page": "pong_games", "game_name": "Pong", "title": "victories", "games": games})


@login_required
def pong_defeats(request):
    user_id = request.user.id
    games = Pong.objects.all().filter(loser_id = user_id, winner_score = 1)
    return render(request, "index.html", {"page": "pong_games", "game_name": "Pong", "title": "defeats", "games": games})


@login_required
def bbm_games(request):
    user_id = request.user.id
    games = Bomberman.objects.all().filter(Q(winner_id = user_id) | Q(loser_id = user_id))
    return render(request, "index.html", {"page": "bbm_games", "game_name": "Bomberman", "title": "history", "games": games})


@login_required
def bbm_victories(request):
    user_id = request.user.id
    games = Bomberman.objects.all().filter(winner_id = user_id, winner_score = 1)
    return render(request, "index.html", {"page": "bbm_games", "game_name": "Bomberman", "title": "victories", "games": games})


@login_required
def bbm_defeats(request):
    user_id = request.user.id
    games = Bomberman.objects.all().filter(loser_id = user_id, winner_score = 1)
    return render(request, "index.html", {"page": "bbm_games", "game_name": "Bomberman", "title": "defeats", "games": games})


@login_required
def bbm_draws(request):
    user_id = request.user.id
    games = Bomberman.objects.all().filter(Q(winner_id = user_id) | Q(loser_id = user_id), winner_score = 0, loser_score = 0)
    return render(request, "index.html", {"page": "bbm_games", "game_name": "Bomberman", "title": "draws", "games": games})


@login_required
def list_friends(request):
    if request.method == 'POST':
        if request.POST.get('send') == 'add friend':
            username = request.POST["name"]
            user = User.objects.all().filter(username = username)
            if username == request.user.username:
                messages.info(request, "Are you that desperate ?")
            elif user:
                friend = Friend.objects.all().filter(user = user[0], friend = request.user.id)
                friendship = Friend.objects.all().filter(user = request.user, friend = user[0].id)
                if friend | friendship:
                    messages.info(request, "Request was already sent")
                else:
                    Friend.objects.create(user = user[0], friend = request.user.id)
                    messages.info(request, "Request has been sent")
            else:
                messages.info(request, "User not found")

    friends = Friend.objects.all().filter(user = request.user, confirmed = True)
    usernames = []
    for friend in friends:
        user = User.objects.all().filter(id = friend.friend)
        usernames.append(user[0].username)
    demands = Friend.objects.all().filter(user = request.user, confirmed = False).count()
    return render(request, "index.html", {"page": "friends_list", "friends": usernames, "friend_request": demands})


@login_required
def show_friend_request(request):
    if request.method == 'POST':
        username = request.POST["name"]
        user = User.objects.all().filter(username = username)
        if user:
            friend = Friend.objects.all().filter(user = request.user, friend = user[0].id)
            friendship = friend[0]
            if request.POST.get('send') == 'yes':
                friendship.confirmed = True
                friendship.save()
                Friend.objects.create(user = user[0], friend = request.user.id, confirmed = True)
            if request.POST.get('send') == 'no':
                friendship.delete()
    demands = Friend.objects.all().filter(user = request.user, confirmed = False)
    usernames = []
    for req in demands:
        user = User.objects.all().filter(id = req.friend)
        if user:
            usernames.append(user[0].username)
    return render(request, "index.html", {"page": "friend_request", "friend_request": usernames})
