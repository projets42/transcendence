import Bomberman from "./bomberman.js";
import TileMap from "./TileMap.js";

const velocity = 3;
const tileSize = 50;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
tileMap.setCanvasSize(canvas);

let players = [];

let p1_controls = {up: 38, down: 40, left: 37, right: 39, action: 96};
let p2_controls = {up: 87, down: 83, left: 65, right: 68, action: 32};

var button = document.getElementById("startGame"); 
            
button.addEventListener("click", function() {
    let c1 = document.querySelector('input[name="color1"]:checked').value;
    let c2 = document.querySelector('input[name="color2"]:checked').value;
    let p1_color = c1;
    let p2_color = c2;
    let player1 = new Bomberman(1 * tileSize, 1 * tileSize, tileSize, velocity, tileMap, p1_controls, p1_color);
    let player2 = new Bomberman(13 * tileSize, 13 * tileSize, tileSize, velocity, tileMap, p2_controls, p2_color);
    players.push(player1);
    players.push(player2);
    document.getElementById("btContainer").style.display = "none";
    document.getElementById("selection").style.display = "none";
    document.getElementById("game_container").style.display = "block";
    setInterval(gameLoop, 1000 / 60);
});

function gameLoop()
{
    tileMap.draw(canvas, ctx);

    if (gameEnd(alivePlayers()))
        return ;

    for (let i = 0; i < players.length; i++)
    {
        players[i].drawBombs(ctx);
        if (players[i].lives)
            players[i].draw(ctx);
    }
}

function alivePlayers()
{
    let n = 0;
    for (let i = 0; i < players.length; i++)
        if (players[i].lives)
            n++;
    return n;
}

function gameEnd(n)
{
    if (n > 1)
        return false;

    let p = 0;
    for (let i = 0; i < players.length; i++)
    {
        if (players[i].lives)
            p = i + 1;
        for (let j = 0; j < players[i].bombs.length; j++)
            players[i].bombs[j] = null;
    }

    let text = "Player " + p + " wins";
    if (n == 0)
        text = "Game Over";

    ctx.fillStyle = "black";
    ctx.font = "75px comic sans";
    ctx.fillText(text, canvas.width / 4, canvas.height / 2);
    return true;
}