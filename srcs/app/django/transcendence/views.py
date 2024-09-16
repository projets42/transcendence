from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.template.loader import render_to_string
from django.http import JsonResponse
from datetime import datetime
from userprofiles.models import Status
from django.contrib.auth.models import User

def index(request):
    if request.method == 'PUT':
        changeStatus(request)
    if request.method != 'GET':
        html_data = render_to_string('index.html')
        return JsonResponse({"success": True, "html_data": html_data})
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



import requests # allows to send HTTP requests in Python.

def test(request):
    if request.method == 'POST':

        if request.POST.get('token'):
            url = "https://api.intra.42.fr/oauth/token"
            params = {
                "grant_type": 'client_credentials',
                "client_id": 'u-s4t2ud-34134e67a8827ff2a35b81c9dd90550be95e01ca581ca6c3a51f26b8241b983b',
                "client_secret": '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'
            }
            response = requests.post(url, data=params)
            result = response.json()
            return render(request, "test.html", {"token": result["access_token"]})

        # curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" "https://api.intra.42.fr/v2/users"

        if request.POST.get('auth'):
            url = "https://api.intra.42.fr/oauth/authorize"
            params = {
                "client_id": 'u-s4t2ud-34134e67a8827ff2a35b81c9dd90550be95e01ca581ca6c3a51f26b8241b983b',
                "redirect_uri": 'https://localhost:8443/test/',
                "scope": 'public',
                "state": '_q)x2+7skd1fz!68g9pe_y^2nlw)n&@n^%01*y&x!_-g%k$$s',
                "response_type": 'code'
            }
            response = requests.get(url, data=params)
            result = response.json()
            return render(request, "test.html", {"token": "ok"})

        if request.POST.get('info'):
            url = "https://api.intra.42.fr/oauth/token"
            params = {
                "grant_type": 'client_credentials',
                "client_id": 'u-s4t2ud-34134e67a8827ff2a35b81c9dd90550be95e01ca581ca6c3a51f26b8241b983b',
                "client_secret": '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'
            }
            response = requests.post(url, data=params)
            result = response.json()
            token = result["access_token"]

            url = "https://api.intra.42.fr/v2/users"
            headers = {
                "Authorization": f"Bearer {token}"
            }
            response = requests.get(url, headers=headers)
            result = response.json()
            return render(request, "test.html", {"token": result})

    # print(token.get("/v2/cursus").parsed)
    return render(request, "test.html")
