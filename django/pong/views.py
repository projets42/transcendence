from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def start_local_game(request):
    nballs = 1
    score = 3
    nplayers = "1v1"
    bots = []
    bot1 = False
    bot2 = False
    bot3 = False
    bot4 = False
    if request.method == 'POST':
        nplayers = request.POST["number"]

        bots = request.POST.getlist("botplayers")
        i = 1
        while i < len(bots):
            if bots[i] == '1':
                bot1 = True
            if bots[i] == '2':
                bot2 = True
            if bots[i] == '3':
                bot3 = True
            if bots[i] == '4':
                bot4 = True
            i += 1

        score = int(request.POST["score_to_win"])
        if request.POST.get('sendScore') == '+' and score < 100:
            score += 1
        elif request.POST.get('sendScore') == '-' and score > 1:
            score -= 1

        nballs = int(request.POST["balls_number"])
        if request.POST.get('send') == '+' and nballs < 100:
            nballs += 1
        elif request.POST.get('send') == '-' and nballs > 1:
            nballs -= 1
        elif request.POST.get('send') == 'PLAY':
            return render(request, "index.html", {"page": "pong", "game": "on", "score": score, "nplayers": nplayers, "bot1": bot1, "bot2": bot2, "bot3": bot3, "bot4": bot4,"balls": nballs})
    return render(request, "index.html", {"page": "pong", "game": "off", "score": score, "nplayers": nplayers, "bot1": bot1, "bot2": bot2, "bot3": bot3, "bot4": bot4, "balls": nballs})


@login_required
def start_tournament(request):
    return render(request, "index.html", {"page": "pong_tournament"})
