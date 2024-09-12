from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import UserForm, ModificationForm, ModificationPictureForm
from .models import ProfileImg, Friend, Status
from django.contrib.auth.decorators import login_required
from bomberman.models import Bomberman
from pong.models import Pong
from django.db.models import Q
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.template.loader import render_to_string
from transcendence.views import changeStatus
import pytz
from django.middleware.csrf import get_token
from datetime import datetime
import logging

def register_user(request):
    if request.method != 'GET':
        form = UserForm(request.POST, request.FILES)
        if form.is_valid():
            usr = form.save()
            img = ProfileImg(user=usr, picture=form.cleaned_data.get('picture'))
            img.save()
            Status.objects.create(user = usr)
            messages.success(request, "Account created successfully!")
            return JsonResponse({"success": True})
        else:
            """ Creation of a dictionary to store validation errors. """
            errors = {}
            for field, field_errors in form.errors.items():
                errors[field] = field_errors
            return JsonResponse({"success": False, "errors": errors})
    else:
        form = UserForm()

    return redirect("index")

def login_user(request):
    if request.method != 'GET':

        # Extraction of data
        username = request.POST["username"]
        password = request.POST["password"]

        # Authentificate the user, if correct this return a 'user' object
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            # Update user status
            status, created = Status.objects.get_or_create(user=user)
            status.state = 1
            status.save()

            # Génération of the new CSRF token
            csrf_token = get_token(request)

            # Generates HTML fragments using the userinfos.html and profile.html templates,
            # which are then sent to the frontend to dynamically update the user interface.
            # 'user' is passed to the context to enable templates to generate content specific to the logged-in user
            header_html = render_to_string('userinfos.html', {'user': user})
            sidebar_html = render_to_string('profile.html', {'user': user})

            return JsonResponse({
                "success": True,
                "header_html": header_html,
                "sidebar_html": sidebar_html,
                "csrf_token": csrf_token
            })
        else:
            return JsonResponse({"success": False, "message": "Wrong username or password"})

    return redirect("index")

def logout_user(request):

    if request.method != 'GET':
        logout(request)
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            header_html = render_to_string('header.html', {'user': None}, request=request)
            sidebar_html = render_to_string('sidebar.html', request=request)
            return JsonResponse({'success': True, 'header_html': header_html, 'sidebar_html': sidebar_html})

    return redirect("index")


@login_required
def show_profile(request):

    user = request.user
    user_id = user.id

    friends = Friend.objects.all().filter(user = user, confirmed = True).count()

    games = Pong.objects.all().filter(creator=user_id, local=False).count()
    local_games = Pong.objects.all().filter(creator=user_id, local=True).count()
    bbm_games = Bomberman.objects.all().filter(creator=user_id).count()

    """ AJAX Response """
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        html = render_to_string("profile.html", {
            "user": user,
            "local_games": local_games,
            "games": games,
            "bbm_games": bbm_games,
            "friends": friends
        })
        return JsonResponse({"html": html})

    return redirect("index")


logger = logging.getLogger(__name__)

def userinfo(request):
    try:
        user = request.user
        if not user.is_authenticated:
            return redirect("index")

        fromJS = request.GET.get('fromJS', False)

        if fromJS:
            # Request is coming from JavaScript
            profile_img_url = user.profileimg.picture.url if hasattr(user, 'profileimg') and hasattr(user.profileimg, 'picture') else None

            result = {
                'username': user.username,
                'profileImgUrl': profile_img_url
            }
        else:
            # Request is coming from manual URL access
            return redirect("index")

        logger.info(f"Returning user info for {user.username}")
        return JsonResponse(result)
    except Exception as e:
        logger.error(f"Error in userinfo view: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)


@login_required
def modify_username(request):
    if request.method == 'POST':
        form = ModificationForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True, 'message': "Profile has been modified"})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    else:
        form = ModificationForm(instance=request.user)
    return redirect("index")

@login_required
def modify_userpicture(request):
    if request.method == 'POST':
        form = ModificationPictureForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            if request.FILES.get('picture'):
                picture = ProfileImg.objects.filter(user=request.user).first()
                if picture:
                    picture.picture = request.FILES['picture']
                    picture.save()
                else:
                    ProfileImg.objects.create(user=request.user, picture=request.FILES['picture'])
            messages.info(request, "Picture has been modified")
            return JsonResponse({'success': True, 'message': 'Picture updated successfully'})
        else:
            errors = form.errors.as_json()
            return JsonResponse({'success': False, 'errors': errors})
    else:
        form = ModificationPictureForm()

    return redirect("index")


@login_required
def pong_games(request):
    """ TEST GAME GENERATOR """
    if request.method == 'POST' and request.POST.get('test'):
        Pong.objects.create(creator = request.user.id, winner = "Sam", loser = "Sio", loser_score = 0)

    user_id = request.user.id
    games = Pong.objects.all().filter(creator=user_id, local=True)
    context = {"page": "pong_games", "game_name": "Pong", "title": "history", "games": games}

    if request.method == 'PUT':
        changeStatus(request)
    if request.method != 'GET':
        html_data = render_to_string('game_history.html', context, request=request)
        return JsonResponse({"success": True, "html_data": html_data})

    return render(request, "game_history_full.html", context)


@login_required
def pong_tournaments(request):
    user_id = request.user.id
    games = Pong.objects.all().filter(creator=user_id, local=False)
    context = {"page": "pong_games", "game_name": "Pong", "title": "history", "games": games}

    if request.method == 'PUT':
        changeStatus(request)
    if request.method != 'GET':
        html_data = render_to_string('game_history.html', context, request=request)
        return JsonResponse({"success": True, "html_data": html_data})

    return render(request, "game_history_full.html", context)



@login_required
def bbm_games(request):
    user_id = request.user.id
    games = Bomberman.objects.all().filter(creator=user_id)
    context = {"page": "bbm_games", "game_name": "Bomberman", "title": "history", "games": games}

    if request.method == 'PUT':
        changeStatus(request)
    if request.method != 'GET':
        html_data = render_to_string('game_history.html', context, request=request)
        return JsonResponse({"success": True, "html_data": html_data})

    return render(request, "game_history_full.html", context)


@login_required
def friends(request):
    friends = Friend.objects.all().filter(user = request.user, confirmed = True)
    users = []
    for friend in friends:
        user = User.objects.all().filter(id = friend.friend)
        users.append(user[0])
    demands = Friend.objects.all().filter(user = request.user, confirmed = False).count()

    if request.method == 'PUT':
        changeStatus(request)
    if request.method != 'GET':

        # add friend
        if request.POST.get('friend_name'):
            username = request.POST["friend_name"]
            user = User.objects.all().filter(username = username)
            if not user:
                return JsonResponse({"success": False, "message": "User not found"})
            if username == request.user.username:
                return JsonResponse({"success": False, "message": "Are you that desperate ?"})
            
            friend = Friend.objects.all().filter(user = user[0], friend = request.user.id)
            friendship = Friend.objects.all().filter(user = request.user, friend = user[0].id)
            if friend | friendship:
                return JsonResponse({"success": False, "message": "Request was already sent"})
            else:
                Friend.objects.create(user = user[0], friend = request.user.id)
                return JsonResponse({"success": False, "message": "Request has been sent"})

        # display friend profile
        if request.POST.get('friend_id'):
            friend_id = request.POST["friend_id"]
            friend = User.objects.all().filter(id = friend_id)
            if friend:
                games = Pong.objects.all().filter(Q(winner_id = friend_id) | Q(loser_id = friend_id)).count()
                victories = Pong.objects.all().filter(winner_id = friend_id).count()
                defeats = Pong.objects.all().filter(loser_id = friend_id).count()
                bbm_games = Bomberman.objects.all().filter(Q(winner_id = friend_id) | Q(loser_id = friend_id)).count()
                bbm_victories = Bomberman.objects.all().filter(winner_id = friend_id, winner_score = 1).count()
                bbm_defeats = Bomberman.objects.all().filter(loser_id = friend_id, winner_score = 1).count()
                bbm_draws = Bomberman.objects.all().filter(Q(winner_id = friend_id) | Q(loser = friend_id), winner_score = 0, loser_score = 0).count()

                tz = pytz.timezone('UTC')
                current_time = datetime.now()
                current_time = tz.localize(current_time)
                last_connection = friend[0].status.date
                diff = current_time - last_connection

                html_data = render_to_string('friend_profile.html', {"friend": friend[0], "last_connection": diff.seconds - 7200, "games": games, "victories": victories, "defeats": defeats, "bbm_games": bbm_games, "bbm_victories": bbm_victories, "bbm_defeats": bbm_defeats, "bbm_draws": bbm_draws})
                return JsonResponse({"success": True, "html_data": html_data})

            return JsonResponse({"success": False, "message": "User profile cannot be accessed :("})

        # display friend requests
        if request.POST.get('request'):
            html_data = render_to_string('friend_request.html')
            return JsonResponse({"success": True, "html_data": html_data})

        # display list of friends and number of requests
        html_data = render_to_string('friends.html', {"user": request.user, "friends": users, "friend_request": demands})
        return JsonResponse({"success": True, "html_data": html_data})

    # method GET (url)
    return render(request, "full.html", {"page": "friends.html", "friends": users, "friend_request": demands})


@login_required
def show_friend_request(request):
    if request.method == 'PUT':
        changeStatus(request)
    if request.method != 'GET':
        if request.POST.get('name'):
            username = request.POST["name"]
            user = User.objects.all().filter(username = username)
            if user:
                friend = Friend.objects.all().filter(user = request.user, friend = user[0].id)
                friendship = friend[0]
                if request.POST.get('answer') == 'yes':
                    friendship.confirmed = True
                    friendship.save()
                    Friend.objects.create(user = user[0], friend = request.user.id, confirmed = True)
                if request.POST.get('answer') == 'no':
                    friendship.delete()

    demands = Friend.objects.all().filter(user = request.user, confirmed = False)
    usernames = []
    for req in demands:
        user = User.objects.all().filter(id = req.friend)
        if user:
            usernames.append(user[0].username)

    if request.method != 'GET':
        html_data = render_to_string('friend_request.html', {"user": request.user, "friend_request": usernames})
        return JsonResponse({"success": True, "html_data": html_data})

    # method GET (url)
    return render(request, "full.html", {"page": "friend_request.html", "friend_request": usernames})


