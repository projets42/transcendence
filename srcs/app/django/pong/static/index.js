//shortcuts
let gameBoard;
let context;
let scoreText;
let resetBtn;
let player1Btn;
let player2Btn;
let player3Btn;
let player4Btn;
let decreaseBalls;
let ballsLbl;
let increaseBalls;

//gameBoard
const gameWidth = 1000;
const gameHeight = 500;
const boardBackground = "white";
let intervalID;
const ACTUALISATIONIA = 1000;

//settings bigBoss in the channel
let nbrPlayers;
let player1Bot;
let player2Bot;
let player3Bot;
let player4Bot;
let ballNbr;
let scoreToWin;
let gameIsFinished = false;


//paddle
const TOP = 1;
const BOTTOM = 2;
const paddleColor = "white";
const paddleSpeed = 10;
const paddleWidth = 25;
const paddleHeight = 100;
const paddleHeight4Players = 80;
let paddleSpawn;
let paddleSpawnTop;
let paddleSpawnBottom;
class Paddle{
    constructor(width, height, x, y, yMin, yMax, keyUp, keyDown){
        this.width = width;
        this.height = height
        this.x = x;
        this.y = y;
        this.yMin = yMin;
        this.yMax = yMax;
        this.score = 0;
        this.keyUp = keyUp;
        this.keyDown = keyDown;
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
const ballInitialSpeed = 4;
const ballIncr = 2;
const maxSpeed = 10000;
// 100 put y axe incr at -1 to 1 
const ballFov = 90 / 100 * 2;
let ballSpawnX;
let ballSpawnY;
class Ball{
    constructor(speed, x, y, xDirection, yDirection){
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.xDirection = xDirection;
        this.yDirection = yDirection;
        this.arrivalTime = 0;
        this.tics = 0;
        this.index = -1;
    }
    setValues(speed, x, y, xDirection, yDirection){
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.xDirection = xDirection;
        this.yDirection = yDirection;
        this.arrivalTime = 0;
        this.tics = 0;
        this.index = -1;
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
window.addEventListener("keyup", keyIsNotPressed);

//settings players and IA
let time = -1000;

function gameInitPong(){
    // //shortcuts
    gameBoard = document.getElementById("gameBoard");
    context = gameBoard.getContext("2d");
    scoreText = document.getElementById("scoreText");
    resetBtn = document.getElementById("resetBtn");
    if (document.getElementById("btn-return"))
        btnReturn = document.getElementById("btn-return")
    player1Btn = document.getElementById("player1Btn");
    player2Btn = document.getElementById("player2Btn");
    player3Btn = document.getElementById("player3Btn");
    player4Btn = document.getElementById("player4Btn");
    decreaseBalls = document.getElementById("decreaseBalls");
    ballsLbl = document.getElementById("ballsLbl");
    increaseBalls = document.getElementById("increaseBalls");

    //gameBoard
    gameBoard.width = gameWidth;
    gameBoard.height = gameHeight;

    //settings bigBoss in the channel
    nbrPlayers = document.getElementById('nplayers').textContent;
    player1Bot = document.getElementById('bot1').textContent;
    player2Bot = document.getElementById('bot2').textContent;
    player3Bot = document.getElementById('bot3').textContent;
    player4Bot = document.getElementById('bot4').textContent;
    ballNbr = document.getElementById('balls').textContent;
    scoreToWin = document.getElementById('score').textContent;


    //paddle
    paddleSpawn = (gameHeight - paddleHeight) / 2;
    paddleSpawnTop = Math.floor((gameHeight - paddleHeight4Players) / 4 / 10) * 10;
    paddleSpawnBottom = Math.floor((gameHeight - paddleHeight4Players) * 3 / 4 / 10) * 10;


    //ball
    ballSpawnX = gameWidth / 2;
    ballSpawnY = gameHeight / 2;

    //choose player number
    if (nbrPlayers == "\"1v1\"")
        resetGame();
    else if (nbrPlayers == "\"2v2\"")
        reset4Players();
}


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
            // check to stop early
            if (gameIsFinished){
                while (i < balls.length){
                    drawBall(balls[i]);
                    i++;
                }
                break;
            }
            // check collision by step of size ballradius
            balls[i].step = Math.ceil(balls[i].speed / ballRadius);
            balls[i].xIncr = balls[i].xDirection / balls[i].step;
            balls[i].yIncr = balls[i].yDirection / balls[i].step;
            let goal = paddle1.score + paddle2.score;
            let currentBallSpeed = balls[i].speed
            for(let j = 0; j < balls[i].step; j++)
            {
                moveBall(balls[i]);
                checkCollision(balls[i], currentBallSpeed);
                // terminate if goal scored
                if (goal < paddle1.score + paddle2.score)
                    break;
            }
            drawBall(balls[i]);
        }
        if (!gameIsFinished)
            nextTick(balls, fakeballs);
    }, 10)
};
function drawPaddles(){
    //neon effect
    context.shadowColor = paddleColor;
    if (Math.random() > 0.02)
        context.shadowBlur = 10;

    context.fillStyle = paddleColor;
    context.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    context.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    context.shadowBlur = 0;
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
    //neon effect
    context.shadowColor = paddleColor;
    if (Math.random() > 0.03)
        context.shadowBlur = 10;
    
    context.fillStyle = ballColor;
    context.beginPath();
    context.arc(ball.x, ball.y, ballRadius, 0, 2 * Math.PI);
    context.fill();
    context.shadowBlur = 0;
};
function moveBall(ball){
    ball.x += ball.xIncr;
    ball.y += ball.yIncr;
};
function movePaddles(balls, fakeballs){
    //update ball position every 1 second
    if (Date.now() - time >= ACTUALISATIONIA)
    {
        //create ball simulation for IA
        fakeballs.length = 0;
        for (let i = 0; i < balls.length; i++)
        {
            let tempball = new Ball(0, 0, 0, 0, 0);
            tempball.setValues(balls[i].speed, balls[i].x, balls[i].y, balls[i].xDirection, balls[i].yDirection);
            tempball.index = i;
            fakeballs.push(tempball);
            checkBallDestination(balls[i], fakeballs[i], paddleHeight);
        }
        time = Date.now();
    }

    if (player1Bot == "true")
        movePaddlesIA(fakeballs, paddle1);
    if (player2Bot == "true")
        movePaddlesIA(fakeballs, paddle2);

    //remove fakeballs that belongs to the past
    for (let i = 0; i < fakeballs.length; i++)
    {
        if (fakeballs[0].tics <= 1)
            fakeballs.shift();
        else
            break;
    }

    //decrease fakeballs arrivalTime and tics
    for (let i = 0; i < fakeballs.length; i++){
        fakeballs[i].arrivalTime--;
        fakeballs[i].tics;
    }


    // move paddles
    if (keys[paddle1up] && paddle1.y >= paddle1.yMin)
        paddle1.y -= paddleSpeed;
    if (keys[paddle1down] && paddle1.y <= paddle1.yMax)
        paddle1.y += paddleSpeed;
    if (keys[paddle2up] && paddle2.y >= paddle2.yMin)
        paddle2.y -= paddleSpeed;
    if (keys[paddle2down] && paddle2.y <= paddle2.yMax)
        paddle2.y += paddleSpeed;

    //reset IA paddle movement value
    if (player1Bot == "true"){
        keys[paddle1up] = false;
        keys[paddle1down] = false;
    }
    if (player2Bot == "true"){
        keys[paddle2up] = false;
        keys[paddle2down] = false;
    }
};
function checkBallDestination(ball, fakeball, currentpaddleheight)
{
    fakeball.check = false;
    let lastxDirection = fakeball.xDirection;
    fakeball.arrivalTime = 0

    // check collision by step of size ballradius
    fakeball.step = Math.ceil(fakeball.speed / ballRadius);
    fakeball.xIncr = fakeball.xDirection / fakeball.step;
    fakeball.yIncr = fakeball.yDirection / fakeball.step;
    while (fakeball.check == false)
    {
        for(let j = 0; j < fakeball.step; j++)
        {
            moveBall(fakeball);
            checkCollisionFakeBall(fakeball);
            if (fakeball.check == true)
                break;
        }
        fakeball.arrivalTime++;
    }


    //compute tics to reach score zone and stock in fakeball.tics
    fakeball.tics = fakeball.arrivalTime;
    while (fakeball.xDirection * lastxDirection >= 0)
    {
        if (fakeball.x <= 0 || fakeball.x >= gameWidth)
            fakeball.xDirection *= -1;
        fakeball.x += fakeball.xDirection;
        fakeball.tics++;
    }

    
    // value rounded where ia will move to with angle variant
    fakeball.y = (Math.round((fakeball.y + (Math.random() * (currentpaddleheight - paddleSpeed)) - ((currentpaddleheight - paddleSpeed) / 2) ) / paddleSpeed) * paddleSpeed);
}
function checkCollisionFakeBall(fakeball){
    //ball bounced top and down
    if (fakeball.y <= 0 + ballRadius)
    {
        if (fakeball.yDirection < 0)
            fakeball.yDirection *= -1;
        if (fakeball.yIncr < 0)
            fakeball.yIncr *= -1
    }
    else if (fakeball.y >= gameHeight - ballRadius)
    {
        if (fakeball.yDirection > 0)
            fakeball.yDirection *= -1;
        if (fakeball.yIncr > 0)
            fakeball.yIncr *= -1
    }

    //ball score
    if (fakeball.x <= 0){
        fakeball.xDirection *= -1;
        fakeball.check = true;
        return;
    }
    if (fakeball.x >= gameWidth){
        fakeball.xDirection *= -1;
        fakeball.check = true;
        return;
    }
    
    //ball reach paddle
    if (fakeball.x <= (paddle1.x + paddle1.width + ballRadius)){
        if (fakeball.y >= paddle1.y && fakeball.y <= paddle1.y + paddle1.height)
            fakeball.check = true;
    }
    else if (fakeball.x >= (paddle2.x - ballRadius)){
        if (fakeball.y >= paddle2.y && fakeball.y <= paddle2.y + paddle2.height)
            fakeball.check = true;
    }
};
function movePaddlesIA(fakeballs, paddle)
{
    // search next target
    if (fakeballs.length == 0)
        return (movePaddleIaToSpawn(paddle));
    let targetball = fakeballs[0];
    for(let i = 1; i < fakeballs.length; i++)
    {
        // check priority ball
        if (fakeballs[i].arrivalTime > targetball.arrivalTime)
            continue;

        // check if ball in wrong direction
        if ((fakeballs[i].xDirection > 0 && paddle.x) || (fakeballs[i].xDirection < 0 && !paddle.x))
            continue;

        //check if ball accessible
        if ((paddle.y - fakeballs[i].y > 0) && ((paddle.y - fakeballs[i].y) / paddleSpeed > fakeballs[i].arrivalTime))
            continue;
        if ((paddle.y - fakeballs[i].y < 0) && (fakeballs[i].y > paddle.y + paddle.height) && ((fakeballs[i].y - paddle.y - paddle.height) / paddleSpeed > fakeballs[i].arrivalTime))
            continue;
        targetball = fakeballs[i];
    }


    // position paddle
    if ((targetball.xDirection > 0 && paddle.x) || (targetball.xDirection < 0 && !paddle.x))
        movePaddleIaToSpawn(paddle);
    else
        movePaddleIaToFakeball(targetball, paddle, fakeballs);
}
function movePaddleIaToSpawn(paddle){
    // go middle court (stand by)
    if (paddle.y < (gameHeight - paddle.height) / 2)
        keys[paddle.keyDown] = true;
    else if (paddle.y > (gameHeight - paddle.height) / 2)
        keys[paddle.keyUp] = true;
}
function movePaddleIaToFakeball(targetball, paddle, fakeballs){
    // position itself were the ball will arrive with random angle variant
    if (paddle.y >= paddle.yMin && (paddle.y + (paddle.height / 2) > targetball.y))
        keys[paddle.keyUp] = true;
    else if (paddle.y <= paddle.yMax && (paddle.y + (paddle.height / 2) < targetball.y))
        keys[paddle.keyDown] = true;
    else if (targetball.arrivalTime <= 0)
        fakeballs.splice(targetball.index, 1);
}
function checkCollision(ball, currentBallSpeed){
    //ball bounced top and down
    if (ball.y <= 0 + ballRadius)
    {
        if (ball.yDirection < 0)
            ball.yDirection *= -1;
        if (ball.yIncr < 0)
            ball.yIncr *= -1
    }
    else if (ball.y >= gameHeight - ballRadius)
    {
        if (ball.yDirection > 0)
            ball.yDirection *= -1;
        if (ball.yIncr > 0)
            ball.yIncr *= -1
    }
            
    //ball score
    if (ball.x <= 0){
        paddle2.score += 1;
        updateScore();
        createBall(ball);
        return;
    }
    if (ball.x >= gameWidth){
        paddle1.score += 1;
        updateScore();
        createBall(ball);
        return;
    }

    //ball bounced paddle
    if (ball.x <= (paddle1.x + paddle1.width + ballRadius)){
        if (ball.y >= paddle1.y && ball.y <= paddle1.y + paddle1.height){
            if (ball.speed < maxSpeed && ball.xDirection < 0)
                ball.speed += ballIncr;
            ball.x = paddle1.x + paddle1.width + ballRadius;
            ball.yDirection = (((ball.y - paddle1.y) / paddle1.height) -0.5) * ballFov * currentBallSpeed;
            ball.xDirection = Math.sqrt((currentBallSpeed ** 2) - (ball.yDirection ** 2));
            ball.xIncr = ball.xDirection / ball.step;
            ball.yIncr = ball.yDirection / ball.step;
        }
    }
    else if (ball.x >= (paddle2.x - ballRadius)){
        if (ball.y >= paddle2.y && ball.y <= paddle2.y + paddle2.height){
            if (ball.speed < maxSpeed && ball.xDirection > 0)
                ball.speed += ballIncr;
            ball.x = paddle2.x - ballRadius;
            ball.yDirection = (((ball.y - paddle2.y) / paddle2.height) -0.5) * ballFov * currentBallSpeed;
            ball.xDirection = -Math.sqrt((currentBallSpeed ** 2) - (ball.yDirection ** 2));
            ball.xIncr = ball.xDirection / ball.step;
            ball.yIncr = ball.yDirection / ball.step;
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
        if (document.getElementById("winnerForm"))
        {
            //hide exit button
            if (document.getElementById('btn-return'))
                btnReturn.style.display="none"
            setTimeout(() => {
                if (document.getElementById("winnerForm")){
                    if (paddle1.score > paddle2.score)
                    {
                        document.getElementById("winner").value = "player1";
                        document.getElementById("loserScore").value = paddle2.score;
                    }
                    else
                    {
                        document.getElementById("winner").value = "player2";
                        document.getElementById("loserScore").value = paddle1.score;
                    }
                    document.getElementById("result").click();
                }
            }, 1000);
        }
        else if (document.getElementById("winnerFormLocal"))
        {
            if (nbrPlayers == "\"1v1\""){
                //hide exit button
                if (document.getElementById('btn-return'))
                    btnReturn.style.display="none"
                setTimeout(() => {
                    if (document.getElementById("winnerFormLocal")){
                        if (paddle1.score > paddle2.score)
                        {
                            document.getElementById("winner").value = "player1";
                            document.getElementById("winnerScore").value = paddle1.score;
                            document.getElementById("loserScore").value = paddle2.score;
                        }
                        else
                        {
                            document.getElementById("winner").value = "player2";
                            document.getElementById("winnerScore").value = paddle2.score;
                            document.getElementById("loserScore").value = paddle1.score;
                        }
                        document.getElementById("result").click();
                    }
                }, 1000);
            }
            else if (nbrPlayers == "\"2v2\"")
            {
                resetBtn.addEventListener("click", reset4Players);
                drawPaddles4Players();
                resetBtn.style.display ="block";
            }
        }
        context.fillStyle = "tomato";
        context.font = "75px comic sans";
        if (paddle1.score > paddle2.score)
            context.fillText("Left Team WIN!", gameWidth / 4, gameHeight / 2);
        else
            context.fillText("Right Team WIN!", gameWidth / 4, gameHeight / 2);
        drawPaddles();
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
            // check to stop early
            if (gameIsFinished){
                while (i < balls.length){
                    drawBall(balls[i]);
                    i++;
                }
                break;
            }
            // check collision by step of size ballradius
            balls[i].step = Math.ceil(balls[i].speed / ballRadius);
            balls[i].xIncr = balls[i].xDirection / balls[i].step;
            balls[i].yIncr = balls[i].yDirection / balls[i].step;
            let goal = paddle1.score + paddle2.score;
            let currentBallSpeed = balls[i].speed
            for(let j = 0; j < balls[i].step; j++)
            {
                moveBall(balls[i]);
                checkCollision4Players(balls[i], currentBallSpeed);
                // terminate if goal scored
                if (goal < paddle1.score + paddle2.score)
                    break;
            }
            drawBall(balls[i]);
        }
        if (!gameIsFinished)
            nextTick4Players(balls, fakeballs);
    }, 10)
};
function drawPaddles4Players(){
    //neon effect
    context.shadowColor = paddleColor;
    if (Math.random() > 0.02)
        context.shadowBlur = 10;
    
    context.fillStyle = paddleColor;
    context.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    context.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    context.fillRect(paddle3.x, paddle3.y, paddle3.width, paddle3.height);
    context.fillRect(paddle4.x, paddle4.y, paddle4.width, paddle4.height);
    context.shadowBlur = 0;
};
function movePaddles4Players(balls, fakeballs){
    //check ball position every 1 second
    if (Date.now() - time >= ACTUALISATIONIA)
    {
        fakeballs.length = 0;
        for (let i = 0; i < balls.length; i++)
        {
            let tempball = new Ball(0, 0, 0, 0, 0);
            tempball.setValues(balls[i].speed, balls[i].x, balls[i].y, balls[i].xDirection, balls[i].yDirection);
            tempball.index = i;
            fakeballs.push(tempball);
            checkBallDestination(balls[i], fakeballs[i], paddleHeight4Players);
        }
        time = Date.now();
    }

    if (player1Bot == "true")
        movePaddlesIA4Players(fakeballs, paddle1, paddle3, paddleSpawnTop);
    if (player2Bot == "true")
        movePaddlesIA4Players(fakeballs, paddle2, paddle4, paddleSpawnTop);
    if (player3Bot == "true")
        movePaddlesIA4Players(fakeballs, paddle3, paddle1, paddleSpawnBottom);
    if (player4Bot == "true")
        movePaddlesIA4Players(fakeballs, paddle4, paddle2, paddleSpawnBottom);

    //remove fakeballs that belongs to the past
    for (let i = 0; i < fakeballs.length; i++)
        {
            if (fakeballs[0].tics <= 1)
                fakeballs.shift();
            else
                break;
        }
    
    //decrease fakeballs arrivalTime and tics
    for (let i = 0; i < fakeballs.length; i++){
        fakeballs[i].arrivalTime--;
        fakeballs[i].tics;
    }


    movePaddles4PlayersInput(paddle1, paddle3, paddle1up, paddle1down);
    movePaddles4PlayersInput(paddle2, paddle4, paddle2up, paddle2down);
    movePaddles4PlayersInput(paddle3, paddle1, paddle3up, paddle3down);
    movePaddles4PlayersInput(paddle4, paddle2, paddle4up, paddle4down);

    //reset IA paddle movement value
    if (player1Bot == "true"){
        keys[paddle1up] = false;
        keys[paddle1down] = false;
    }
    if (player2Bot == "true"){
        keys[paddle2up] = false;
        keys[paddle2down] = false;
    }
    if (player3Bot == "true"){
        keys[paddle3up] = false;
        keys[paddle3down] = false;
    }
    if (player4Bot == "true"){
        keys[paddle4up] = false;
        keys[paddle4down] = false;
    }
};
function movePaddles4PlayersInput(paddle, paddleally, paddleup, paddledown){
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
    if (fakeballs.length == 0)
        return (movePaddleToSpawn(currentSpwan, paddle, paddleally));

    //class all targetball in array by arrival time (first to last)
    let targetballs = [];
    getTargetBalls(paddle, fakeballs, targetballs);

    // position paddle
    if (targetballs.length)
        movePaddleIa(targetballs[0], paddle, paddleally, fakeballs);
    else
        movePaddleToSpawn(currentSpwan, paddle, paddleally);
}
function getTargetBalls(paddle, fakeballs, targetballs){
    for(let i = 0; i < fakeballs.length; i++)
    {
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
function movePaddleIa(targetball, paddle, paddleally, fakeballs){
    if (paddle.y >= paddle.yMin && (paddle.y + (paddle.height / 2) > targetball.y))
    {
        keys[paddle.keyUp] = true;
        //check if ally collision with friendly paddle
        if (paddle.position == BOTTOM && paddle.y < paddleally.y + paddleally.height)
            keys[paddleally.keyUp] = true;
    }
    else if (paddle.y <= paddle.yMax && (paddle.y + (paddle.height / 2) < targetball.y))
    {
        keys[paddle.keyDown] = true;
        //check if ally collision with friendly paddle
        if (paddle.position == TOP && paddle.y + paddle.height > paddleally.y)
            keys[paddleally.keyDown] = true;
    }
    else if (targetball.arrivalTime <= 0){
        fakeballs.splice(targetball.index, 1);
    }
}
function movePaddleToSpawn(spawn, paddle, paddleally){
    // go middle court (stand by)
    if (paddle.y >= paddle.yMin && paddle.y > spawn)
    {
        keys[paddle.keyUp] = true;
        //check if ally collision with friendly paddle
        if (paddle.position == BOTTOM && paddle.y < paddleally.y + paddleally.height)
            keys[paddleally.keyUp] = true;
    }
    else if (paddle.y <= paddle.yMax && paddle.y < spawn)
    {
        keys[paddle.keyDown] = true;
        //check if ally collision with friendly paddle
        if (paddle.position == TOP && paddle.y + paddle.height > paddleally.y)
            keys[paddleally.keyDown] = true;
    }
}
function checkCollision4Players(ball, currentBallSpeed){
    //ball bounced top and down
    if (ball.y <= 0 + ballRadius)
    {
        if (ball.yDirection < 0)
            ball.yDirection *= -1;
        if (ball.yIncr < 0)
            ball.yIncr *= -1
    }
    else if (ball.y >= gameHeight - ballRadius)
    {
        if (ball.yDirection > 0)
            ball.yDirection *= -1;
        if (ball.yIncr > 0)
            ball.yIncr *= -1
    }
    
    //ball score
    if (ball.x <= 0)
    {
        paddle2.score += 1;
        updateScore();
        createBall(ball);
        return;
    }
    if (ball.x >= gameWidth)
    {
        paddle1.score += 1;
        updateScore();
        createBall(ball);
        return;
    }
    
    //ball bounced paddle
    if (ball.x <= (paddle1.x + paddle1.width + ballRadius))
    {
        if (ball.y >= paddle1.y && ball.y <= paddle1.y + paddle1.height){
            ballBouncePaddleLeft(ball, currentBallSpeed, paddle1);
        }
        else if(ball.y >= paddle3.y && ball.y <= paddle3.y + paddle3.height){
            ballBouncePaddleLeft(ball, currentBallSpeed, paddle3);
        }
    }
    else if (ball.x >= (paddle2.x - ballRadius))
    {
        if (ball.y >= paddle2.y && ball.y <= paddle2.y + paddle2.height){
            ballBouncePaddleRight(ball, currentBallSpeed, paddle2)
        }
        else if (ball.y >= paddle4.y && ball.y <= paddle4.y + paddle4.height){
            ballBouncePaddleRight(ball, currentBallSpeed, paddle4)
        }
    }
};
function ballBouncePaddleLeft(ball, currentBallSpeed, paddle){
    if (ball.speed < maxSpeed && ball.xDirection < 0)
        ball.speed += ballIncr;
    ball.x = paddle.x + paddle.width + ballRadius;
    ball.yDirection = (((ball.y - paddle.y) / paddle.height) -0.5) * ballFov * currentBallSpeed;
    ball.xDirection = Math.sqrt((currentBallSpeed ** 2) - (ball.yDirection ** 2));
    ball.xIncr = ball.xDirection / ball.step;
    ball.yIncr = ball.yDirection / ball.step;
}
function ballBouncePaddleRight(ball, currentBallSpeed, paddle){
    if (ball.speed < maxSpeed && ball.xDirection > 0)
        ball.speed += ballIncr;
    ball.x = paddle.x - ballRadius;
    ball.yDirection = (((ball.y - paddle.y) / paddle.height) -0.5) * ballFov * currentBallSpeed;
    ball.xDirection = -Math.sqrt((currentBallSpeed ** 2) - (ball.yDirection ** 2));
    ball.xIncr = ball.xDirection / ball.step;
    ball.yIncr = ball.yDirection / ball.step;
}



//reset functions
function resetGame(){
    //remove reset button
    if (document.getElementById('resetBtn'))
    {
        resetBtn.removeEventListener("click", resetGame);
        resetBtn.style.display ="none";
    }

    //set event listeners
    if (player1Bot == "false")
        window.addEventListener("keydown", keyIsPressedPlayer1);
    else
        window.removeEventListener("keydown", keyIsPressedPlayer1);
    if (player2Bot == "false")
        window.addEventListener("keydown", keyIsPressedPlayer2);
    else
        window.removeEventListener("keydown", keyIsPressedPlayer2);

    
    //set paddles
    paddle1 = new Paddle(paddleWidth, paddleHeight, 0, paddleSpawn, paddleSpeed, gameHeight - paddleHeight - paddleSpeed, paddle1up, paddle1down);
    paddle2 = new Paddle(paddleWidth, paddleHeight, gameWidth - paddleWidth, paddleSpawn, paddleSpeed, gameHeight - paddleHeight - paddleSpeed, paddle2up, paddle2down);
    paddle1.score = 0;
    paddle2.score = 0;

    //set balls
    let balls = [];
    let fakeballs = [];
    for(let i = 0; i < ballNbr; i++)
    {
        let ball = new Ball(0, 0, 0, 0, 0);
        balls.push(ball);
    }


    gameIsFinished = false;
    updateScore();
    clearInterval(intervalID);
    gameStart(balls, fakeballs);
};
function reset4Players(){
    //remove reset button
    if (document.getElementById('resetBtn'))
    {
        resetBtn.removeEventListener("click", reset4Players);
        resetBtn.style.display ="none";
    }

    //set event listeners
    if (player1Bot == "false")
        window.addEventListener("keydown", keyIsPressedPlayer1);
    else
        window.removeEventListener("keydown", keyIsPressedPlayer1);
    if (player2Bot == "false")
        window.addEventListener("keydown", keyIsPressedPlayer2);
    else
        window.removeEventListener("keydown", keyIsPressedPlayer2);
    if (player3Bot == "false")
        window.addEventListener("keydown", keyIsPressedPlayer3);
    else
        window.removeEventListener("keydown", keyIsPressedPlayer3);
    if (player4Bot == "false")
        window.addEventListener("keydown", keyIsPressedPlayer4);
    else
        window.removeEventListener("keydown", keyIsPressedPlayer4);


    //set paddles
    paddle1 = new Paddle(paddleWidth, paddleHeight4Players, 0, paddleSpawnTop, paddleSpeed, gameHeight - paddleHeight4Players * 2 - paddleSpeed, paddle1up, paddle1down);
    paddle2 = new Paddle(paddleWidth, paddleHeight4Players, gameWidth - paddleWidth, paddleSpawnTop, paddleSpeed, gameHeight - paddleHeight4Players * 2 - paddleSpeed, paddle2up, paddle2down);
    paddle3 = new Paddle(paddleWidth, paddleHeight4Players, 0, paddleSpawnBottom, paddleSpeed + paddleHeight4Players, gameHeight - paddleHeight4Players - paddleSpeed, paddle3up, paddle3down);
    paddle4 = new Paddle(paddleWidth, paddleHeight4Players, gameWidth - paddleWidth, paddleSpawnBottom, paddleSpeed + paddleHeight4Players, gameHeight - paddleHeight4Players - paddleSpeed, paddle4up, paddle4down);
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