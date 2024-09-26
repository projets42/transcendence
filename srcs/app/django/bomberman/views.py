from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.template.loader import render_to_string
from django.http import JsonResponse
from .models import Bomberman, BombermanTournament
from django.contrib.auth.models import User
from .forms import ColorForm
from transcendence.views import changeStatus

@login_required
def game(request):
    user_id = request.user.id
    form = ColorForm()
    if request.method == 'PUT':
        changeStatus(request)
        
    if request.method != 'GET':

        # submit subscription form
        if request.POST.get('players_number'):
            n = int(request.POST["players_number"])
            names = request.POST.getlist("names")
            players = names[:n]
            if len(players) == len(set(players)):
                create_tournament_tables(request, players)
            else:
                return JsonResponse({"success": False, "message": "usernames must be unique"})

        # submit color form
        form = ColorForm(request.POST)
        if form.is_valid():
            color1 = request.POST["color1"]
            color2 = request.POST["color2"]
            html_data = render_to_string('game.html', {"color1": color1, "color2": color2})
            return JsonResponse({"success": True, "html_data": html_data})

        # cancel tournament
        if request.POST.get('cancel'):
            tournament = BombermanTournament.objects.all().filter(creator = user_id)
            while tournament.count():
                game = tournament[0]
                game.delete()

        # end of game
        if request.POST.get('winner'):
            return end_game(request, user_id)

        # display subscription
        if BombermanTournament.objects.all().filter(creator = user_id).count() == 0:
            html_data = render_to_string('subscribe.html')
            return JsonResponse({"success": True, "html_data": html_data})

        # color selection
        games = BombermanTournament.objects.all().filter(creator = user_id, winner__isnull = True, player2__isnull = False)
        html_data = render_to_string('players_intro.html', {"form": form, "p1": games[0].player1, "p2": games[0].player2})
        return JsonResponse({"success": True, "html_data": html_data})


    # METHOD GET (with url)

    # display subscription full html
    if BombermanTournament.objects.all().filter(creator = user_id).count() == 0:
        return render(request, "full.html", {"page": "subscribe.html"})

    # color selection full html
    games = BombermanTournament.objects.all().filter(creator = user_id, winner__isnull = True, player2__isnull = False)
    return render(request, "full.html", {"page": "players_intro.html", "form": form, "p1": games[0].player1, "p2": games[0].player2})


def create_tournament_tables(request, players):
    user_id = request.user.id
    i = 0
    while i + 1 < len(players):
        BombermanTournament.objects.create(creator = user_id, player1 = players[i], player2 = players[i + 1])
        i += 2
    if i < len(players):
        BombermanTournament.objects.create(creator = user_id, player1 = players[i])


def end_game(request, user_id):

    # check if there is games to play (2 players and winner empty)
    games = BombermanTournament.objects.all().filter(creator = user_id, winner__isnull = True, player2__isnull = False)
    if games.count() == 0:
        html_data = render_to_string('subscribe.html')
        return JsonResponse({"success": True, "html_data": html_data})

    # register winner of the game which just ended
    pastGame = games[0]
    pastGame.winner = request.POST["winner"]
    pastGame.save()
    if request.POST["winner"] == "none":
        Bomberman.objects.create(creator = pastGame.creator, winner = pastGame.player1, loser = pastGame.player2)
    elif request.POST["winner"] == "player1":
        Bomberman.objects.create(creator = pastGame.creator, winner = pastGame.player1, loser = pastGame.player2, winner_score = 1)
    else:
        Bomberman.objects.create(creator = pastGame.creator, winner = pastGame.player2, loser = pastGame.player1, winner_score = 1)

    # check if there is games to play (2 players and winner empty)
    form = ColorForm()
    if games.count():
        html_data = render_to_string('players_intro.html', {"form": form, "p1": games[0].player1, "p2": games[0].player2})
        return JsonResponse({"success": True, "html_data": html_data})

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

    # check if there is games to play (2 players and winner empty)
    games = BombermanTournament.objects.all().filter(creator = user_id, winner__isnull = True, player2__isnull = False)
    if games.count():
        html_data = render_to_string('players_intro.html', {"form": form, "p1": games[0].player1, "p2": games[0].player2})
        return JsonResponse({"success": True, "html_data": html_data})

    # end of tournament
    tournaments = BombermanTournament.objects.all().filter(creator = user_id)
    if tournaments.count():
        winner = tournaments[0].player1
        toDelete = tournaments[0]
        toDelete.delete()
    else:
        winner = ""
    html_data = render_to_string('winner.html', {"winner": winner})
    return JsonResponse({"success": True, "html_data": html_data})
