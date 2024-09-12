function initPlayerInput()
{
    maxPlayers = 10;

    for (let i = 2; i < maxPlayers; i++)
    {
        document.getElementById("playersList").innerHTML += "<input class='plst neon-input' type='text' name='names' value='player" + (i + 1) + "' required maxlength='15'>";
        document.getElementsByClassName("plst")[i].style.display = "none";
    }
}

function display_player_list()
{
    maxPlayers = 10;

    for (let i = 0; i < maxPlayers; i++)
        document.getElementsByClassName("plst")[i].style.display = "none";
    var nbPlayer = parseInt(document.getElementById("nplayers").value);
    if (!nbPlayer || nbPlayer > maxPlayers)
        return ;
    for (let i = 0; i < nbPlayer; i++)
        document.getElementsByClassName("plst")[i].style.display = "inline";
}

let nplayers = 2;
let nballs = 1;
let score = 3;

function initValues()
{
    nplayers = 2;
    nballs = 1;
    score = 3;
}

function changeValue(sign)
{
    if (sign == '-' && nplayers > 2)
        nplayers--;
    else if (sign == '+' && nplayers < 10)
        nplayers++;

    document.getElementById("nplayers").value = nplayers;
    display_player_list();
}

function submitSubscriptionForm()
{
    document.getElementById("nplayers").value = nplayers;
}

function changeBallsNumber(sign)
{
    if (sign == '-' && nballs > 1)
        nballs--;
    else if (sign == '+' && nballs < 1000)
        nballs++;

    document.getElementById("nballs").value = nballs;
}

function changeScoreToWin(sign)
{
    if (sign == '-' && score > 1)
        score--;
    else if (sign == '+')
        score++;

    document.getElementById("score").value = score;
}

function submitGameSettings()
{
    document.getElementById("nballs").value = nballs;
    document.getElementById("score").value = score;
}
