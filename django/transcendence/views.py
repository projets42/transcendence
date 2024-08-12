from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def index(request):
    context = {"page": "homepage"}
    if request.GET.get('play') == 'PLAY':
        context = {"page": "modeSelection"}
    return render(request, "index.html", context)


@login_required
def selection(request):
    return render(request, "index.html", {"page": "modeSelection"})
