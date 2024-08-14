//shortcuts
const gameBoard = document.getElementById("gameBoard");
const context = gameBoard.getContext("2d");
const scoreText = document.getElementById("scoreText");
const resetBtn = document.getElementById("resetBtn");
const reset4PlayersBtn = document.getElementById("reset4PlayersBtn");
const player1Btn = document.getElementById("player1Btn");
const player2Btn = document.getElementById("player2Btn");
const player3Btn = document.getElementById("player3Btn");
const player4Btn = document.getElementById("player4Btn");
const decreaseBalls = document.getElementById("decreaseBalls");
const ballsLbl = document.getElementById("ballsLbl");
const increaseBalls = document.getElementById("increaseBalls");

//gameBoard
const gameWidth = 1500;
const gameHeight = 800;
gameBoard.width = gameWidth;
gameBoard.height = gameHeight;
const boardBackground = "white";
let intervalID;
const ACTUALISATIONIA = 1000;

//settings bigBoss in the channel
const nbrPlayers = document.getElementById('nplayers').textContent;
const player1Bot = document.getElementById('bot1').textContent;
const player2Bot = document.getElementById('bot2').textContent;
const player3Bot = document.getElementById('bot3').textContent;
const player4Bot = document.getElementById('bot4').textContent;
const ballNbr = document.getElementById('balls').textContent;
const scoreToWin = document.getElementById('score').textContent;
let gameIsFinished = false;


//paddle
const TOP = 1;
const BOTTOM = 2;
const paddleColor = "white";
// const paddleBorder = "black";
const paddleSpeed = 10;
const paddleWidth = 25;
const paddleHeight = 100;
const paddleHeight4Players = 70;
const paddleSpawn = (gameHeight - paddleHeight) / 2;
const paddleSpawnTop = Math.floor((gameHeight - paddleHeight4Players) / 4 / 10) * 10;
const paddleSpawnBottom = Math.floor((gameHeight - paddleHeight4Players) * 3 / 4 / 10) * 10;
class Paddle{
    constructor(width, height, x, y, yMin, yMax){
        this.width = width;
        this.height = height
        this.x = x;
        this.y = y;
        this.yMin = yMin;
        this.yMax = yMax;
        this.score = 0;
    }
    setPositionComparedWithAlly(position){
        this.position = position;
    }
}
let paddle1 = new Paddle(0, 0, 0, 0);
let paddle2 = new Paddle(0, 0, 0, 0);
let paddle3 = new Paddle(0, 0, 0, 0);
let paddle4 = new Paddle(0, 0, 0, 0);


//ball
const ballColor = "orange";
//const ballBorder = "black";
const ballRadius = 10;
const ballInitialSpeed = 2.2;
const ballIncr = 0.2;
// 100 put y axe incr at -1 to 1 
const ballFov = 90 / 100 * 2;
let ballSpawnX = gameWidth / 2;
let ballSpawnY = gameHeight / 2;
class Ball{
    constructor(speed, x, y, xDirection, yDirection){
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.xDirection = xDirection;
        this.yDirection = yDirection;
        this.arrivalTime = 0;
        this.ignore = true;
    }
    setValues(speed, x, y, xDirection, yDirection){
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.xDirection = xDirection;
        this.yDirection = yDirection;
        this.arrivalTime = 0;
        this.ignore = false;
    }
}


//keyboard controls
const spaceBar = 32;
const paddle1up = 87;
const paddle1down = 83;
const paddle2up = 38;
const paddle2down = 40;
const paddle3down = 72;
const paddle3up = 89;
const paddle4down = 34;
const paddle4up = 33;
let keys = [];

//set events
if (resetBtn)
    resetBtn.addEventListener("click", resetGame);
if (reset4PlayersBtn)
    reset4PlayersBtn.addEventListener("click", reset4Players);
window.addEventListener("keyup", keyIsNotPressed);

//settings players and IA
let time = -1000;


if (nbrPlayers == "\"1v1\"")
    resetGame();
else if (nbrPlayers == "\"2v2\"")
    reset4Players();


// Pong for two Players
function gameStart(balls, fakeballs){
    drawPaddles();
    for(let i = 0; i < balls.length; i++)
        createBall(balls[i]);
    drawBall(balls[0]);
    nextTick(balls, fakeballs);
};
function nextTick(balls, fakeballs){
    intervalID = setTimeout(() => {
        clearBoard();
        movePaddles(balls, fakeballs);
        drawPaddles();
        for(let i = 0; i < balls.length; i++)
        {
            moveBall(balls[i]);
            drawBall(balls[i]);
            checkCollision(balls[i], fakeballs[i]);
        }
        if (!gameIsFinished)
            nextTick(balls, fakeballs);
        else
        {
            let text = "END";
            context.fillStyle = "red";
            context.font = "75px comic sans";
            context.fillText(text, gameBoard.width / 4, gameBoard.height / 2);
        }
    }, 10)
};
function drawPaddles(){
    context.fillStyle = paddleColor;
    context.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    context.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
};
function createBall(ball){
    ball.x = ballSpawnX;
    ball.y = ballSpawnY;
    ball.speed = ballInitialSpeed;
    // put random angle on y axis
    ball.yDirection = (Math.random() - 0.5) * ballFov * ball.speed;
    // pythagore calcul base on yDirection and paddleSpeed (paddleSpeed = hypothenus)
    ball.xDirection = Math.sqrt((ball.speed ** 2) - (ball.yDirection ** 2));
    if (Math.round(Math.random()) == 1)
        ball.xDirection *= -1;
};
function drawBall(ball){
    context.fillStyle = ballColor;
    context.beginPath();
    context.arc(ball.x, ball.y, ballRadius, 0, 2 * Math.PI);
    context.fill();
};
function moveBall(ball){
    ball.x += (ball.speed * ball.xDirection);
    ball.y += (ball.speed * ball.yDirection);
};
function movePaddles(balls, fakeballs){
    // human paddles
    if (keys[paddle1up] && paddle1.y >= paddle1.yMin)
        paddle1.y -= paddleSpeed;
    if (keys[paddle1down] && paddle1.y <= paddle1.yMax)
        paddle1.y += paddleSpeed;
    if (keys[paddle2up] && paddle2.y >= paddle2.yMin)
        paddle2.y -= paddleSpeed;
    if (keys[paddle2down] && paddle2.y <= paddle2.yMax)
        paddle2.y += paddleSpeed;
    

    //update ball position every 1 second
    if (Date.now() - time >= ACTUALISATIONIA)
    {
        for (let i = 0; i < balls.length; i++)
            checkBallDestination(balls[i], fakeballs[i], paddleHeight);
    }

    if (player1Bot == "true")
        movePaddlesIA(fakeballs, paddle1);
    if (player2Bot == "true")
        movePaddlesIA(fakeballs, paddle2);
};
function checkBallDestination(ball, fakeball, currentpaddleheight)
{
    time = Date.now();
    fakeball.setValues(ball.speed, ball.x, ball.y, ball.xDirection, ball.yDirection);
    let check = fakeball.xDirection;
    fakeball.arrivalTime = 0
    while (fakeball.xDirection * check >= 0)
    {
        moveBall(fakeball);
        checkCollisionFakeBall(fakeball);
        fakeball.arrivalTime++;
    }

    // value rounded where ia will move to with angle variant
    fakeball.y = Math.round(fakeball.y / paddleSpeed) * paddleSpeed + ((Math.round(Math.random()) - 0.5) * (currentpaddleheight - paddleSpeed * 4));
}
function checkCollisionFakeBall(fakeball){
    //ball bounced top and down
    if (fakeball.y <= 0 + ballRadius)
    {
        if (fakeball.yDirection < 0)
            fakeball.yDirection *= -1;
    }
    else if (fakeball.y >= gameHeight - ballRadius)
    {
        if (fakeball.yDirection > 0)
            fakeball.yDirection *= -1;
    }

    //ball score
    if (fakeball.x <= 0){
        fakeball.xDirection *= -1;
        return;
    }
    if (fakeball.x >= gameWidth){
        fakeball.xDirection *= -1;
        return;
    }
    
    //ball reach paddle
    if (fakeball.x <= (paddle1.x + paddle1.width + ballRadius)){
        if (fakeball.y >= paddle1.y && fakeball.y <= paddle1.y + paddle1.height)
            fakeball.xDirection *= -1;
    }
    else if (fakeball.x >= (paddle2.x - ballRadius)){
        if (fakeball.y >= paddle2.y && fakeball.y <= paddle2.y + paddle2.height)
            fakeball.xDirection *= -1;
    }
};
function movePaddlesIA(fakeballs, paddle)
{
    // search next target
    let targetball = fakeballs[0];
    for(let i = 1; i < fakeballs.length; i++)
    {
        if (targetball.ignore == false)
        {
            // check priority ball
            if (fakeballs[i].ignore == true || fakeballs[i].arrivalTime > targetball.arrivalTime)
                continue;
    
            // check if ball in wrong direction
            if ((fakeballs[i].xDirection > 0 && paddle.x) || (fakeballs[i].xDirection < 0 && !paddle.x))
                continue;

            //check if ball accessible
            if ((paddle.y - fakeballs[i].y > 0) && ((paddle.y - fakeballs[i].y) / paddleSpeed > fakeballs[i].arrivalTime))
                continue;
            if ((paddle.y - fakeballs[i].y < 0) && (fakeballs[i].y > paddle.y + paddle.height) && ((fakeballs[i].y - paddle.y - paddle.height) / paddleSpeed > fakeballs[i].arrivalTime))
                continue;
        }
        targetball = fakeballs[i];
    }


    // position paddle
    if (targetball.ignore == true || (targetball.xDirection > 0 && paddle.x) || (targetball.xDirection < 0 && !paddle.x) || ((Math.abs(paddle.y - targetball.y) / paddleSpeed) > targetball.arrivalTime))
    {
        // go middle court (stand by)
        if (paddle.y < (gameHeight - paddle.height) / 2)
            paddle.y += paddleSpeed;
        else if (paddle.y > (gameHeight - paddle.height) / 2)
            paddle.y -= paddleSpeed;
    }
    else
    {
        // position itself were the ball will arrive with random angle variant
        if (paddle.y >= paddle.yMin && (paddle.y + (paddle.height / 2) > targetball.y))
            paddle.y -= paddleSpeed;
        else if (paddle.y <= paddle.yMax && (paddle.y + (paddle.height / 2) < targetball.y))
            paddle.y += paddleSpeed;
    }
}
function checkCollision(ball, fakeball){
    //ball bounced top and down
    if (ball.y <= 0 + ballRadius)
    {
        if (ball.yDirection < 0)
            ball.yDirection *= -1;
    }
    else if (ball.y >= gameHeight - ballRadius)
    {
        if (ball.yDirection > 0)
            ball.yDirection *= -1;
    }
            
    //ball score
    if (ball.x <= 0){
        paddle2.score += 1;
        updateScore();
        createBall(ball);
        fakeball.ignore = true;
        return;
    }
    if (ball.x >= gameWidth){
        paddle1.score += 1;
        updateScore();
        createBall(ball);
        fakeball.ignore = true;
        return;
    }

    //ball bounced paddle
    if (ball.x <= (paddle1.x + paddle1.width + ballRadius)){
        if (ball.y >= paddle1.y && ball.y <= paddle1.y + paddle1.height){
            ball.speed += ballIncr;
            ball.x = paddle1.x + paddle1.width + ballRadius;
            ball.yDirection = (((ball.y - paddle1.y) / paddle1.height) -0.5) * ballFov * ball.speed;
            ball.xDirection = Math.sqrt((ball.speed ** 2) - (ball.yDirection ** 2));
            fakeball.ignore = true;
        }
    }
    else if (ball.x >= (paddle2.x - ballRadius)){
        if (ball.y >= paddle2.y && ball.y <= paddle2.y + paddle2.height){
            ball.speed += ballIncr;
            ball.x = paddle2.x - ballRadius;
            ball.yDirection = (((ball.y - paddle2.y) / paddle2.height) -0.5) * ballFov * ball.speed;
            ball.xDirection = -Math.sqrt((ball.speed ** 2) - (ball.yDirection ** 2));
            fakeball.ignore = true;
        }
    }
};
function clearBoard(){
    context.clearRect(0, 0, gameWidth, gameHeight);
};
function updateScore(){
    scoreText.textContent = `${paddle1.score} : ${paddle2.score}`;
    if (paddle1.score >= scoreToWin || paddle2.score >= scoreToWin)
    {
        clearInterval(intervalID);
        gameIsFinished = true;
    }
};




// Pong for four Players

function gameStart4Players(balls, fakeballs){
    drawPaddles4Players(balls, fakeballs);
    for(let i = 0; i < balls.length; i++)
        createBall(balls[i]);
    drawBall(balls[0]);
    nextTick4Players(balls, fakeballs);
};
function nextTick4Players(balls, fakeballs){
    intervalID = setTimeout(() => {
        clearBoard();
        movePaddles4Players(balls, fakeballs);
        drawPaddles4Players();
        for(let i = 0; i < balls.length; i++)
        {
            moveBall(balls[i]);
            drawBall(balls[i]);
            checkCollision4Players(balls[i], fakeballs[i]);
        }
        if (!gameIsFinished)
            nextTick4Players(balls, fakeballs);
    }, 10)
};
function drawPaddles4Players(){
    context.fillStyle = paddleColor;
    context.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    context.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    context.fillRect(paddle3.x, paddle3.y, paddle3.width, paddle3.height);
    context.fillRect(paddle4.x, paddle4.y, paddle4.width, paddle4.height);
};
function movePaddles4Players(balls, fakeballs){
    //check ball position every 1 second
    if (Date.now() - time >= ACTUALISATIONIA)
    {
        for (let i = 0; i < balls.length; i++)
            checkBallDestination(balls[i], fakeballs[i], paddleHeight4Players);
    }

    if (player1Bot == "true")
        movePaddlesIA4Players(fakeballs, paddle1, paddle3, paddleSpawnTop);
    if (player2Bot == "true")
        movePaddlesIA4Players(fakeballs, paddle2, paddle4, paddleSpawnTop);
    if (player3Bot == "true")
        movePaddlesIA4Players(fakeballs, paddle3, paddle1, paddleSpawnBottom);
    if (player4Bot == "true")
        movePaddlesIA4Players(fakeballs, paddle4, paddle2, paddleSpawnBottom);


    movePaddles4PlayersHuman(paddle1, paddle3, paddle1up, paddle1down);
    movePaddles4PlayersHuman(paddle2, paddle4, paddle2up, paddle2down);
    movePaddles4PlayersHuman(paddle3, paddle1, paddle3up, paddle3down);
    movePaddles4PlayersHuman(paddle4, paddle2, paddle4up, paddle4down);
};
function movePaddles4PlayersHuman(paddle, paddleally, paddleup, paddledown){
    // move humans top paddles (paddle 1 and 3)
    if (!keys[paddleup] || !keys[paddledown])
    {
        if (keys[paddleup] && paddle.y >= paddle.yMin)
        {
            paddle.y -= paddleSpeed;
            //check if ally collision with friendly paddle
            if (paddle.position == BOTTOM && paddle.y < paddleally.y + paddleally.height)
                paddleally.y -= paddleSpeed;
        }
        else if (keys[paddledown] && paddle.y <= paddle.yMax)
        {
            paddle.y += paddleSpeed;
            //check if ally collision with friendly paddle
            if (paddle.position == TOP && paddle.y + paddle.height > paddleally.y)
                paddleally.y += paddleSpeed;
        }
    }
}
function movePaddlesIA4Players(fakeballs, paddle, paddleally, currentSpwan){
    //class all targetball in array by arrival time (first to last)
    let targetballs = [];
    getTargetBalls(paddle, fakeballs, targetballs);

    // position where the ball go
    if (targetballs.length)
        movePaddleIa(targetballs[0], paddle, paddleally);
    else
        movePaddleToSpawn(currentSpwan, paddle, paddleally);
}
function getTargetBalls(paddle, fakeballs, targetballs){
    for(let i = 0; i < fakeballs.length; i++)
    {
        // check if ball ignored
        if (fakeballs[i].ignore == true)
            continue;

        // check if ball in wrong direction
        if ((fakeballs[i].xDirection > 0 && paddle.x) || (fakeballs[i].xDirection < 0 && !paddle.x))
            continue;

        //check if ball on top half
        if (paddle.position == TOP && fakeballs[i].y > gameHeight / 2)
            continue
        if (paddle.position == BOTTOM && fakeballs[i].y <= gameHeight / 2)
            continue

        //check if ball accessible
        if ((paddle.y - fakeballs[i].y > 0) && ((paddle.y - fakeballs[i].y) / paddleSpeed > fakeballs[i].arrivalTime))
            continue;
        if ((paddle.y - fakeballs[i].y < 0) && (fakeballs[i].y > paddle.y + paddle.height) && ((fakeballs[i].y - paddle.y - paddle.height) / paddleSpeed > fakeballs[i].arrivalTime))
            continue;
        ballAddAscendedSort(targetballs, fakeballs[i]);
    }
}
function ballAddAscendedSort(targetballs, newtargetball){
    let i = 0;
    while (i < targetballs.length)
    {
        if (newtargetball.arrivalTime <= targetballs[i].arrivalTime)
            break;
        i++;
    }
    targetballs.splice(i, 0, newtargetball);
}
function movePaddleIa(fakeball, paddle, paddleally){
    if (paddle.y >= paddle.yMin && (paddle.y + (paddle.height / 2) > fakeball.y))
    {
        paddle.y -= paddleSpeed;
        //check if ally collision with friendly paddle
        if (paddle.position == BOTTOM && paddle.y < paddleally.y + paddleally.height)
            paddleally.y -= paddleSpeed;        
    }
    else if (paddle.y <= paddle.yMax && (paddle.y + (paddle.height / 2) < fakeball.y))
    {
        paddle.y += paddleSpeed;
        //check if ally collision with friendly paddle
        if (paddle.position == TOP && paddle.y + paddle.height > paddleally.y)
            paddleally.y += paddleSpeed;
    }
}
function movePaddleToSpawn(spawn, paddle, paddleally){
    // go middle court (stand by)
    if (paddle.y >= paddle.yMin && paddle.y > spawn)
    {
        paddle.y -= paddleSpeed;
        //check if ally collision with friendly paddle
        if (paddle.position == BOTTOM && paddle.y < paddleally.y + paddleally.height)
            paddleally.y -= paddleSpeed;
    }
    else if (paddle.y <= paddle.yMax && paddle.y < spawn)
    {
        paddle.y += paddleSpeed;
        //check if ally collision with friendly paddle
        if (paddle.position == TOP && paddle.y + paddle.height > paddleally.y)
            paddleally.y += paddleSpeed;
    }
}
function checkCollision4Players(ball, fakeball){
    //ball bounced top and down
    if (ball.y <= 0 + ballRadius)
    {
        if (ball.yDirection < 0)
            ball.yDirection *= -1;
    }
    else if (ball.y >= gameHeight - ballRadius)
    {
        if (ball.yDirection > 0)
            ball.yDirection *= -1;
    }
    
    //ball score
    if (ball.x <= 0)
    {
        paddle2.score += 1;
        updateScore();
        createBall(ball);
        fakeball.ignore = true;
        return;
    }
    if (ball.x >= gameWidth)
    {
        paddle1.score += 1;
        updateScore();
        createBall(ball);
        fakeball.ignore = true;
        return;
    }
    
    //ball bounced paddle
    if (ball.x <= (paddle1.x + paddle1.width + ballRadius))
    {
        if (ball.y >= paddle1.y && ball.y <= paddle1.y + paddle1.height){
            ball.speed += ballIncr;
            ball.x = paddle1.x + paddle1.width + ballRadius;
            ball.yDirection = (((ball.y - paddle1.y) / paddle1.height) -0.5) * ballFov * ball.speed;
            ball.xDirection = Math.sqrt((ball.speed ** 2) - (ball.yDirection ** 2));
            fakeball.ignore = true;
        }
        else if(ball.y >= paddle3.y && ball.y <= paddle3.y + paddle3.height){
            ball.speed += ballIncr;
            ball.x = paddle3.x + paddle3.width + ballRadius;
            ball.yDirection = (((ball.y - paddle3.y) / paddle3.height) -0.5) * ballFov * ball.speed;
            ball.xDirection = Math.sqrt((ball.speed ** 2) - (ball.yDirection ** 2));
            fakeball.ignore = true;
        }
    }
    else if (ball.x >= (paddle2.x - ballRadius))
    {
        if (ball.y >= paddle2.y && ball.y <= paddle2.y + paddle2.height){
            ball.speed += ballIncr;
            ball.x = paddle2.x - ballRadius;
            ball.yDirection = (((ball.y - paddle2.y) / paddle2.height) -0.5) * ballFov * ball.speed;
            ball.xDirection = -Math.sqrt((ball.speed ** 2) - (ball.yDirection ** 2));
            fakeball.ignore = true;
        }
        else if (ball.y >= paddle4.y && ball.y <= paddle4.y + paddle4.height){
            ball.speed += ballIncr;
            ball.x = paddle4.x - ballRadius;
            ball.yDirection = (((ball.y - paddle4.y) / paddle4.height) -0.5) * ballFov * ball.speed;
            ball.xDirection = -Math.sqrt((ball.speed ** 2) - (ball.yDirection ** 2));
            fakeball.ignore = true;
        }
    }
};



//reset functions
function resetGame(){
    //set event listeners
    if (player1Bot == "false")
        window.addEventListener("keydown", keyIsPressedPlayer1);
    if (player2Bot == "false")
        window.addEventListener("keydown", keyIsPressedPlayer2);
    
    //set paddles
    paddle1 = new Paddle(paddleWidth, paddleHeight, 0, paddleSpawn, paddleSpeed, gameHeight - paddleHeight - paddleSpeed);
    paddle2 = new Paddle(paddleWidth, paddleHeight, gameWidth - paddleWidth, paddleSpawn, paddleSpeed, gameHeight - paddleHeight - paddleSpeed);
    paddle1.score = 0;
    paddle2.score = 0;

    //set balls
    let balls = [];
    let fakeballs = [];
    for(let i = 0; i < ballNbr; i++)
    {
        let ball = new Ball(0, 0, 0, 0, 0);
        balls.push(ball);
        let fakeball = new Ball(0, 0, 0, 0, 0);
        fakeballs.push(fakeball);
    }


    gameIsFinished = false;
    updateScore();
    clearInterval(intervalID);
    gameStart(balls, fakeballs);
};
function reset4Players(){
    //set event listeners
    if (player1Bot == "false")
        window.addEventListener("keydown", keyIsPressedPlayer1);
    if (player2Bot == "false")
        window.addEventListener("keydown", keyIsPressedPlayer2);
    if (player3Bot == "false")
        window.addEventListener("keydown", keyIsPressedPlayer3);
    if (player4Bot == "false")
        window.addEventListener("keydown", keyIsPressedPlayer4);

    //set paddles
    paddle1 = new Paddle(paddleWidth, paddleHeight4Players, 0, paddleSpawnTop, paddleSpeed, gameHeight - paddleHeight4Players * 2 - paddleSpeed);
    paddle2 = new Paddle(paddleWidth, paddleHeight4Players, gameWidth - paddleWidth, paddleSpawnTop, paddleSpeed, gameHeight - paddleHeight4Players * 2 - paddleSpeed);
    paddle3 = new Paddle(paddleWidth, paddleHeight4Players, 0, paddleSpawnBottom, paddleSpeed + paddleHeight4Players, gameHeight - paddleHeight4Players - paddleSpeed);
    paddle4 = new Paddle(paddleWidth, paddleHeight4Players, gameWidth - paddleWidth, paddleSpawnBottom, paddleSpeed + paddleHeight4Players, gameHeight - paddleHeight4Players - paddleSpeed);
    paddle1.setPositionComparedWithAlly(TOP);
    paddle2.setPositionComparedWithAlly(TOP);
    paddle3.setPositionComparedWithAlly(BOTTOM);
    paddle4.setPositionComparedWithAlly(BOTTOM);
    paddle1.score = 0;
    paddle2.score = 0;

    //set balls
    let balls = [];
    let fakeballs = [];
    for(let i = 0; i < ballNbr; i++)
    {
        let ball = new Ball(0, 0, 0, 0, 0);
        balls.push(ball);
        let fakeball = new Ball(0, 0, 0, 0, 0);
        fakeballs.push(fakeball);
    }

    gameIsFinished = false;
    updateScore();
    clearInterval(intervalID);
    gameStart4Players(balls, fakeballs);
};


// Event functions
function keyIsPressedPlayer1(event){
    switch(event.keyCode){
        case(paddle1up):
        keys[paddle1up] = true;
        break;
        case(paddle1down):
        keys[paddle1down] = true;
        break;
    }
};
function keyIsPressedPlayer2(event){
    switch(event.keyCode){
        case(paddle2up):
        keys[paddle2up] = true;
        break;
        case(paddle2down):
        keys[paddle2down] = true;
        break;
    }
};
function keyIsPressedPlayer3(event){
    switch(event.keyCode){
        case(paddle3up):
        keys[paddle3up] = true;
        break;
        case(paddle3down):
        keys[paddle3down] = true;
        break;
    }
}
function keyIsPressedPlayer4(event){
    switch(event.keyCode){
        case(paddle4up):
        keys[paddle4up] = true;
        break;
        case(paddle4down):
        keys[paddle4down] = true;
        break;
    }
}
function keySpaceBar(event){
    if (event.keyCode == spaceBar)
        keys[spaceBar] = true;
}
function keyIsNotPressed(event){
    switch(event.keyCode){
        case(paddle1up):
            keys[paddle1up] = false;
        break;
        case(paddle1down):
            keys[paddle1down] = false;
        break;
        case(paddle2up):
            keys[paddle2up] = false;
        break;
        case(paddle2down):
            keys[paddle2down] = false;
        break;
        case(paddle3up):
            keys[paddle3up] = false;
        break;
        case(paddle3down):
            keys[paddle3down] = false;
        break;
        case(paddle4up):
            keys[paddle4up] = false;
        break;
        case(paddle4down):
            keys[paddle4down] = false;
        break;
        case(spaceBar):
            keys[spaceBar] = false;
        break;
    }
};