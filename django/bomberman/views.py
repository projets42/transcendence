from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Bomberman, BombermanTournament
from .forms import ColorForm
from django.db.models import Q

@login_required
def start_game(request):
    n = 2
    username = request.user.username
    if request.method == 'POST':
        form = ColorForm(request.POST)
        if form.is_valid():
            # bombergame = Bomberman.objects.create(winner = username)
            color1 = request.POST["color1"]
            color2 = request.POST["color2"]
            return render(request, "index.html", {"page": "bomberman", "game": "on", "color1": color1, "color2": color2})
            
        n = int(request.POST["players_number"])
        if request.POST.get('send') == '+' and n < 10:
            n += 1
        elif request.POST.get('send') == '-' and n > 2:
            n -= 1
        elif request.POST.get('send') == 'PLAY':
            last = 1
            if BombermanTournament.objects.all().count():
                last = BombermanTournament.objects.last().tournament + 1
            usernames = request.POST.getlist("names")
            i = 0
            while i + 1 < len(usernames):
                BombermanTournament.objects.create(tournament = last, player1 = usernames[i], player2 = usernames[i + 1])
                i += 2
            if i < len(usernames):
                BombermanTournament.objects.create(tournament = last, player1 = usernames[i])

    tournament = BombermanTournament.objects.all().filter(Q(player1 = username) | Q(player2 = username)).count()
    # players subscription
    if tournament == 0:
        players = []
        i = 2
        while i <= n:
            players.append("player" + str(i))
            i += 1
        return render(request, "index.html", {"page": "bomberman", "game": "off", "number": n, "players": players})

    # color selection
    form = ColorForm()
    return render(request, "index.html", {"page": "bomberman", "game": "off", "form": form})