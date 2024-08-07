from django.shortcuts import render

def index(request):
    context = {"page": "homepage"}
    if request.GET.get('play') == 'PLAY':
        context = {"page": "modeSelection"}
    return render(request, "index.html", context)
