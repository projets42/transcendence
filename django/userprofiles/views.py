from django.shortcuts import render

def index(request):
    context = {"page": 1}
    if request.GET.get('play') == 'PLAY':
        context = {"page": 2}
    return render(request, "index.html", context)
