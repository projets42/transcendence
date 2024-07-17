from django.shortcuts import render

def start_game(request):
    return render(request, "index.html", {"page": "bomberman"})
