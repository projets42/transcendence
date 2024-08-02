from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Bomberman, BombermanTournament
from .forms import ColorForm

@login_required
def start_game(request):
    n = 2
    players = []
    username = request.user.username

    if request.method == 'POST':

        # game running with chosen colors
        form = ColorForm(request.POST)
        if form.is_valid():
            return run_game(request)
            
        # game end
        if request.POST.get('send') == 'result':
            return end_game(request, username)

        # select number of players
        n = int(request.POST["players_number"])
        if request.POST.get('send') == '+' and n < 10:
            n += 1
        elif request.POST.get('send') == '-' and n > 2:
            n -= 1
        elif request.POST.get('send') == 'PLAY':
            create_tournament_tables(request, username)


    # display players subscription
    if BombermanTournament.objects.all().filter(creator = username).count() == 0:
        i = 1
        while i <= n:
            players.append("player" + str(i))
            i += 1
        return render(request, "index.html", {"page": "bomberman", "game": "off", "number": n, "players": players})
    

    # color selection
    form = ColorForm()
    games = BombermanTournament.objects.all().filter(creator = username, winner__isnull = True, player2__isnull = False)
    return render(request, "index.html", {"page": "bomberman", "game": "off", "form": form, "name1": games[0].player1, "name2": games[0].player2})


def run_game(request):
    color1 = request.POST["color1"]
    color2 = request.POST["color2"]
    return render(request, "index.html", {"page": "bomberman", "game": "on", "color1": color1, "color2": color2})


def end_game(request, username):
    form = ColorForm()
    games = BombermanTournament.objects.all().filter(creator = username, winner__isnull = True, player2__isnull = False)
    if games.count() == 0:
        return render(request, "index.html", {"page": "bomberman", "game": "off", "number": 2, "players": ["player1", "player2"]})
    pastGame = games[0]
    pastGame.winner = request.POST["winner"]
    pastGame.save()
    if request.POST["winner"] == "none":
        bombergame = Bomberman.objects.create(winner = pastGame.player1, loser = pastGame.player2)
    elif request.POST["winner"] == "player1":
        bombergame = Bomberman.objects.create(winner = pastGame.player1, loser = pastGame.player2, winner_score = 1)
    else:
        bombergame = Bomberman.objects.create(winner = pastGame.player2, loser = pastGame.player1, winner_score = 1)
    if games.count():
        return render(request, "index.html", {"page": "bomberman", "game": "off", "form": form, "name1": games[0].player1, "name2": games[0].player2})

    # delete draws
    draws = BombermanTournament.objects.all().filter(creator = username, winner = "none")
    while draws.count():
        draw = draws[0]
        draw.delete()

    # winner VS solo player (odd)
    pastGames = BombermanTournament.objects.all().filter(creator = username, winner__isnull = False)
    game = BombermanTournament.objects.all().filter(creator = username, player2__isnull = True)
    if game.count() and pastGames.count():
        nextGame = game[0]
        if pastGames[0].winner == "player1":
            winner = pastGames[0].player1
        else:
            winner = pastGames[0].player2
        nextGame.player2 = winner
        nextGame.save()
        toDelete = pastGames[0]
        toDelete.delete()

    # winner VS winner
    while pastGames.count() > 1:
        if pastGames[0].winner == "player1":
            winner1 = pastGames[0].player1
        else:
            winner1 = pastGames[0].player2
        if pastGames[1].winner == "player1":
            winner2 = pastGames[1].player1
        else:
            winner2 = pastGames[1].player2
        BombermanTournament.objects.create(creator = username, player1 = winner1, player2 = winner2)
        toDelete = pastGames[1]
        toDelete.delete()
        toDelete = pastGames[0]
        toDelete.delete()

    if pastGames.count() == 1:
        if pastGames[0].winner == "player1":
            winner = pastGames[0].player1
        else:
            winner = pastGames[0].player2
        BombermanTournament.objects.create(creator = username, player1 = winner)
        toDelete = pastGames[0]
        toDelete.delete()

    games = BombermanTournament.objects.all().filter(creator = username, winner__isnull = True, player2__isnull = False)
    if games.count():
        return render(request, "index.html", {"page": "bomberman", "game": "off", "form": form, "name1": games[0].player1, "name2": games[0].player2})

    # end of tournament
    tournaments = BombermanTournament.objects.all().filter(creator = username)
    if tournaments.count():
        winner = tournaments[0].player1
        toDelete = tournaments[0]
        toDelete.delete()
    else:
        winner = ""
    return render(request, "index.html", {"page": "bomberman", "game": "end", "winner": winner})


def create_tournament_tables(request, username):
    usernames = request.POST.getlist("names")
    i = 0
    while i + 1 < len(usernames):
        BombermanTournament.objects.create(creator = username, player1 = usernames[i], player2 = usernames[i + 1])
        i += 2
    if i < len(usernames):
        BombermanTournament.objects.create(creator = username, player1 = usernames[i])