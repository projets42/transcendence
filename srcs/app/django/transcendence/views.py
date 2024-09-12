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
