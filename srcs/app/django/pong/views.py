from django.shortcuts import render

def start_local_game(request):
    return render(request, "index.html", {"page": "pong_local"})


def start_tournament(request):
    return render(request, "index.html", {"page": "pong_tournament"})
