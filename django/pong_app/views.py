from django.shortcuts import render

def index(request):
    return render(request, "index.html")

def page2(request):
    return render(request, "page2.html")
