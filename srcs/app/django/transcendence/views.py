from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.template.loader import render_to_string
from django.http import JsonResponse
from datetime import datetime
from userprofiles.models import Status, Student42
from django.contrib.auth.models import User

from django.contrib.auth import login
from django.conf import settings
import os
import requests
import json
import random
import string
state = ""


def login_user_42(request, username, picture):
    student = Student42.objects.all().filter(login42 = username).first()
    if student:
        try:
            login(request, student.user, backend=settings.AUTHENTICATION_BACKENDS[0])
        except Exception as e:
            print(e)
        return

    login42 = username
    while User.objects.all().filter(username = username).first():
        username = username + "_"
    user = User.objects.create_user(username)
    user.set_unusable_password()
    user.save()
    Student42.objects.create(user = user, login42 = login42, picture = picture)
    Status.objects.create(user = user)
    try:
        login(request, user, backend=settings.AUTHENTICATION_BACKENDS[0])
    except Exception as e:
        print(e)


def authenticate_with_42(request):
    global state
    temp = request.GET["state"]

    # check if state is the same as previously sent
    if temp == state:
        code = request.GET["code"]

        # get access token
        url = "https://api.intra.42.fr/oauth/token"
        params = {
            'grant_type': 'authorization_code',
            'client_id': os.getenv('CLIENT_ID'),
            'client_secret': os.getenv('CLIENT_SECRET'),
            'code': code,
            'redirect_uri': 'https://localhost:8443/',
            'state': state
        }
        response = json.loads(requests.post(url = url, params = params).text)
        if ('access_token' in response.keys()):
            access_token = response['access_token']

            # use access token to get public user infos
            url = "https://api.intra.42.fr/v2/me"
            headers = {
                'Authorization': f"Bearer {access_token}"
            }
            response = json.loads(requests.get(url = url, headers = headers).text)
            if ('login' in response and 'image' in response and 'versions' in response['image'] and 'medium' in response['image']['versions']):
                login = response['login']
                picture = response['image']['versions']['medium']
                login_user_42(request, login, picture)


def authorize_42(request):
    global state
    client_id = os.getenv('CLIENT_ID')
    redirect_uri = "https://localhost:8443/"
    response_type = "code"
    scope = "public"
    state = get_random_string()
    url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type={response_type}&scope={scope}&state={state}"
    return redirect(url)


def index(request):

    if request.method == 'PUT':
        changeStatus(request)

    if request.method != 'GET':

        # authenticate with 42
        if request.POST.get('auth'):
            # login_user_42(request, "smalloir", "https://cdn.intra.42.fr/users/3a0086ca405d47d215796a68c6eda55e/medium_smalloir.jpg")
            # return redirect(index)
            return authorize_42(request)
        
        # access index from another page
        html_data = render_to_string('index.html')
        return JsonResponse({"success": True, "html_data": html_data})

    # verify if get response from 42
    if request.GET.get('state') and request.GET.get('code'):
        authenticate_with_42(request)

    # access index by url
    return render(request, "index_full.html")


@login_required
def selection(request):
    if request.method == 'PUT':
        changeStatus(request)
    if request.method != 'GET':
        html_data = render_to_string('selection.html')
        return JsonResponse({"success": True, "html_data": html_data})
    return render(request, "selection_full.html")


def changeStatus(request):
    if User.objects.all().filter(username = request.user):
        status = Status.objects.all().filter(user = request.user)
        if status:
            user = status[0]
            user.date = datetime.now()
            user.save()
        else:
            new_status = Status.objects.create(user = request.user, state = 1)


def load_sidebar(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        sidebar_html = render_to_string('sidebar.html', context={'user': request.user}, request=request)
        return JsonResponse({'html': sidebar_html})
    else:
        return redirect('index')


def get_random_string(length=70):
    characters = string.ascii_letters + string.digits + "_"
    random_str = ''.join(random.choice(characters) for i in range(length))
    return random_str
