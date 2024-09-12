from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.template.loader import render_to_string
from django.http import JsonResponse
from .models import Pong, PongTournament
from django.contrib.auth.models import User
from transcendence.views import changeStatus

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

    if request.method == 'PUT':
        changeStatus(request)

    if request.method != 'GET':

        # access game
        if request.POST.get('score_to_win'):
            score = int(request.POST["score_to_win"])
        if request.POST.get('number'):
            nplayers = request.POST["number"]
        if request.POST.get('botplayers'):
            bots = request.POST.getlist("botplayers")
            i = 0
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
        if request.POST.get('balls_number'):
            nballs = int(request.POST["balls_number"])
            html_data = render_to_string('game_local.html', {"score": score, "nplayers": nplayers, "bot1": bot1, "bot2": bot2, "bot3": bot3, "bot4": bot4,"balls": nballs})
            return JsonResponse({"success": True, "html_data": html_data})

        # display settings form
        html_data = render_to_string('game_settings.html', {"score": score})
        return JsonResponse({"success": True, "html_data": html_data})

    # METHOD GET (with url)
    return render(request, "game_settings_full.html", {"score": score})


@login_required
def start_tournament(request):
    user_id = request.user.id

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

        # submit player announcement form
        if request.POST.get('play'):
            html_data = render_to_string('pong_game.html')
            return JsonResponse({"success": True, "html_data": html_data})

        # cancel tournament
        if request.POST.get('cancel'):
            tournament = PongTournament.objects.all().filter(creator = user_id)
            while tournament.count():
                game = tournament[0]
                game.delete()

        # end of game
        if request.POST.get('winner'):
            return end_game(request, user_id)

        # display subscription
        if PongTournament.objects.all().filter(creator = user_id).count() == 0:
            html_data = render_to_string('pong_subscribe.html')
            return JsonResponse({"success": True, "html_data": html_data})

        # players announcement
        games = PongTournament.objects.all().filter(creator = user_id, winner__isnull = True, player2__isnull = False)
        html_data = render_to_string('pong_players_intro.html', {"p1": games[0].player1, "p2": games[0].player2})
        return JsonResponse({"success": True, "html_data": html_data})


    # METHOD GET (with url)

    # display subscription full html
    if PongTournament.objects.all().filter(creator = user_id).count() == 0:
        return render(request, "pong_subscribe_full.html")

    # players announcement full html
    games = PongTournament.objects.all().filter(creator = user_id, winner__isnull = True, player2__isnull = False)
    return render(request, "pong_players_intro_full.html", {"p1": games[0].player1, "p2": games[0].player2})


def create_tournament_tables(request, players):
    user_id = request.user.id
    i = 0
    while i + 1 < len(players):
        PongTournament.objects.create(creator = user_id, player1 = players[i], player2 = players[i + 1])
        i += 2
    if i < len(players):
        PongTournament.objects.create(creator = user_id, player1 = players[i])


def end_game(request, user_id):

    # check if there is games to play (2 players and winner empty)
    games = PongTournament.objects.all().filter(creator = user_id, winner__isnull = True, player2__isnull = False)
    if games.count() == 0:
        html_data = render_to_string('pong_subscribe.html')
        return JsonResponse({"success": True, "html_data": html_data})

    # register winner of the game which just ended
    pastGame = games[0]
    pastGame.winner = request.POST["winner"]
    pastGame.loser_score = request.POST["loserScore"]
    pastGame.save()
    if request.POST["winner"] == "player1":
        Pong.objects.create(creator = pastGame.creator, winner = pastGame.player1, loser = pastGame.player2, loser_score = pastGame.loser_score, local = False)
    else:
        Pong.objects.create(creator = pastGame.creator, winner = pastGame.player2, loser = pastGame.player1, loser_score = pastGame.loser_score, local = False)

    # check if there is games to play (2 players and winner empty)
    if games.count():
        html_data = render_to_string('pong_players_intro.html', {"p1": games[0].player1, "p2": games[0].player2})
        return JsonResponse({"success": True, "html_data": html_data})

    # winner VS solo player (odd)
    pastGames = PongTournament.objects.all().filter(creator = user_id, winner__isnull = False)
    game = PongTournament.objects.all().filter(creator = user_id, player2__isnull = True)
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
        PongTournament.objects.create(creator = user_id, player1 = winner1, player2 = winner2)
        toDelete = pastGames[1]
        toDelete.delete()
        toDelete = pastGames[0]
        toDelete.delete()

    if pastGames.count() == 1:
        if pastGames[0].winner == "player1":
            winner = pastGames[0].player1
        else:
            winner = pastGames[0].player2
        PongTournament.objects.create(creator = user_id, player1 = winner)
        toDelete = pastGames[0]
        toDelete.delete()

    # check if there is games to play (2 players and winner empty)
    games = PongTournament.objects.all().filter(creator = user_id, winner__isnull = True, player2__isnull = False)
    if games.count():
        html_data = render_to_string('pong_players_intro.html', {"p1": games[0].player1, "p2": games[0].player2})
        return JsonResponse({"success": True, "html_data": html_data})

    # end of tournament
    tournaments = PongTournament.objects.all().filter(creator = user_id)
    if tournaments.count():
        winner = tournaments[0].player1
        toDelete = tournaments[0]
        toDelete.delete()
    else:
        winner = ""
    html_data = render_to_string('pong_winner.html', {"winner": winner})
    return JsonResponse({"success": True, "html_data": html_data})
