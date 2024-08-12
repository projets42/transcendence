from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def start_local_game(request):
    return render(request, "index.html", {"page": "pong_local"})


@login_required
def start_tournament(request):
    return render(request, "index.html", {"page": "pong_tournament"})
