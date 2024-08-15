from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Bomberman, BombermanTournament
from django.contrib.auth.models import User
from .forms import ColorForm

@login_required
def start_game(request):
    n = 2
    players = ["player1", "player2"]
    user_id = request.user.id

    if request.method == 'POST':

        # game running with chosen colors
        form = ColorForm(request.POST)
        if form.is_valid():
            return run_game(request)

        if request.POST.get('send') == 'Cancel':
            tournament = BombermanTournament.objects.all().filter(creator = user_id)
            while tournament.count():
                game = tournament[0]
                game.delete()
            return render(request, "index.html", {"page": "bomberman", "game": "off", "number": 2, "players": ["player1", "player2"]})
            
        # game end
        if request.POST.get('send') == 'result':
            return end_game(request, user_id)

        # select number of players
        n = int(request.POST["players_number"])
        players = request.POST.getlist("names")
        if request.POST.get('send') == '+' and n < 10:
            n += 1
        elif request.POST.get('send') == '-' and n > 2:
            n -= 1
        elif request.POST.get('send') == 'PLAY':
            if len(players) == len(set(players)):
                create_tournament_tables(request, user_id)
            else:
                return render(request, "index.html", {"page": "bomberman", "game": "off", "number": n, "players": players, "error": "usernames must be unique"})


    # display players subscription
    if BombermanTournament.objects.all().filter(creator = user_id).count() == 0:
        i = len(players) + 1
        if n == i:
            players.append("player" + str(i))
        if n == len(players) - 1:
            players.pop()
        return render(request, "index.html", {"page": "bomberman", "game": "off", "number": n, "players": players})
    

    # color selection
    form = ColorForm()
    games = BombermanTournament.objects.all().filter(creator = user_id, winner__isnull = True, player2__isnull = False)
    return render(request, "index.html", {"page": "bomberman", "game": "off", "form": form, "name1": games[0].player1, "name2": games[0].player2})


def run_game(request):
    color1 = request.POST["color1"]
    color2 = request.POST["color2"]
    return render(request, "index.html", {"page": "bomberman", "game": "on", "color1": color1, "color2": color2})


def create_tournament_tables(request, user_id):
    usernames = request.POST.getlist("names")
    i = 0
    while i + 1 < len(usernames):
        BombermanTournament.objects.create(creator = user_id, player1 = usernames[i], player2 = usernames[i + 1])
        i += 2
    if i < len(usernames):
        BombermanTournament.objects.create(creator = user_id, player1 = usernames[i])


def end_game(request, user_id):
    form = ColorForm()
    games = BombermanTournament.objects.all().filter(creator = user_id, winner__isnull = True, player2__isnull = False)
    if games.count() == 0:
        return render(request, "index.html", {"page": "bomberman", "game": "off", "number": 2, "players": ["player1", "player2"]})
    pastGame = games[0]
    pastGame.winner = request.POST["winner"]
    pastGame.save()
    id1 = -1
    id2 = -1
    user1 = User.objects.all().filter(username = pastGame.player1)
    if (user1):
        id1 = user1[0].id
    user2 = User.objects.all().filter(username = pastGame.player2)
    if (user2):
        id2 = user2[0].id
    if request.POST["winner"] == "none":
        Bomberman.objects.create(winner = pastGame.player1, loser = pastGame.player2, winner_id = id1, loser_id = id2)
    elif request.POST["winner"] == "player1":
        Bomberman.objects.create(winner = pastGame.player1, loser = pastGame.player2, winner_score = 1, winner_id = id1, loser_id = id2)
    else:
        Bomberman.objects.create(winner = pastGame.player2, loser = pastGame.player1, winner_score = 1, winner_id = id2, loser_id = id1)
    if games.count():
        return render(request, "index.html", {"page": "bomberman", "game": "off", "form": form, "name1": games[0].player1, "name2": games[0].player2})

    # delete draws
    draws = BombermanTournament.objects.all().filter(creator = user_id, winner = "none")
    while draws.count():
        draw = draws[0]
        draw.delete()

    # winner VS solo player (odd)
    pastGames = BombermanTournament.objects.all().filter(creator = user_id, winner__isnull = False)
    game = BombermanTournament.objects.all().filter(creator = user_id, player2__isnull = True)
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
        BombermanTournament.objects.create(creator = user_id, player1 = winner1, player2 = winner2)
        toDelete = pastGames[1]
        toDelete.delete()
        toDelete = pastGames[0]
        toDelete.delete()

    if pastGames.count() == 1:
        if pastGames[0].winner == "player1":
            winner = pastGames[0].player1
        else:
            winner = pastGames[0].player2
        BombermanTournament.objects.create(creator = user_id, player1 = winner)
        toDelete = pastGames[0]
        toDelete.delete()

    games = BombermanTournament.objects.all().filter(creator = user_id, winner__isnull = True, player2__isnull = False)
    if games.count():
        return render(request, "index.html", {"page": "bomberman", "game": "off", "form": form, "name1": games[0].player1, "name2": games[0].player2})

    # end of tournament
    tournaments = BombermanTournament.objects.all().filter(creator = user_id)
    if tournaments.count():
        winner = tournaments[0].player1
        toDelete = tournaments[0]
        toDelete.delete()
    else:
        winner = ""
    return render(request, "index.html", {"page": "bomberman", "game": "end", "winner": winner})