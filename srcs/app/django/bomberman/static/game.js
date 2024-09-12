const MovingDirection = {right: 1, down: 2, left: 3, up: 4};

class TileMap
{

    constructor(tileSize)
    {
        this.tileSize = tileSize;
        this.wall = this.#image("wall.png");
        this.floor = this.#image("floor.png");
        this.explosion = this.#image("explose0.png");
        this.explosionHori = this.#image("explose1.png");
        this.explosionVert = this.#image("explose2.png");
    }

    // private method (begins with '#')
    #image(filename)
    {
        const img = new Image();
        img.src = `/media/images/bomberman/${filename}`;
        return img;
    }

    map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    draw(canvas, ctx)
    {
        for (let row = 0; row < this.map.length; row++)
        {
            for (let col = 0; col < this.map[row].length; col++)
            {
                const tile = this.map[row][col];
                let image = null;

                switch(tile)
                {
                    case 1:
                        image = this.wall;
                        break ;
                    case 4:
                        image = this.explosion;
                        break;
                    case 5:
                        image = this.explosionHori;
                        break;
                    case 6:
                        image = this.explosionVert;
                        break;
                    default:
                        image = this.floor;
                }

                if (image != null)
                    ctx.drawImage(image, col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }

    setCanvasSize(canvas)
    {
        canvas.height = this.map.length * this.tileSize;
        canvas.width = this.map[0].length * this.tileSize;
    }

    collideWall(x, y, direction, velocity)
    {
        if (direction == null)
            return ;

        const margin = 0.4;

        let posx = x / this.tileSize;
        let posy = y / this.tileSize;

        let col = 0;
        let row = 0;

        switch (direction)
        {
            case MovingDirection.right:
                col = Math.ceil(posx) + 1;
                row = Math.round(posy);
                if (x % this.tileSize && x % this.tileSize <= this.tileSize - velocity)
                    return false;
                if (Math.abs(posy - row) > margin)
                    return true;
                break ;
            case MovingDirection.left:
                col = Math.floor(posx) - 1;
                row = Math.round(posy);
                if (x % this.tileSize >= velocity)
                    return false;
                if (Math.abs(posy - row) > margin)
                    return true;
                break ;
            case MovingDirection.up:
                row = Math.floor(posy) - 1;
                col = Math.round(posx);
                if (y % this.tileSize >= velocity)
                    return false;
                if (Math.abs(posx - col) > margin)
                    return true;
                break ;
            case MovingDirection.down:
                row = Math.ceil(posy) + 1;
                col = Math.round(posx);
                if (y % this.tileSize && y % this.tileSize <= this.tileSize - velocity)
                    return false;
                if (Math.abs(posx - col) > margin)
                    return true;
                break ;
        }
        
        if (this.map[row][col] == 1)
            return true;

        return false;
    }

    collideBomb(x, y, direction, velocity)
    {
        if (direction == null)
            return ;

        const margin = 0.4;

        let posx = x / this.tileSize;
        let posy = y / this.tileSize;

        let col = 0;
        let row = 0;

        switch (direction)
        {
            case MovingDirection.right:
                col = Math.ceil(posx);
                row = Math.round(posy);
                if (Math.abs(posx - col) < 1 - margin)
                {
                    col++;
                    if (x % this.tileSize && x % this.tileSize <= this.tileSize - velocity)
                        return false;
                }
                break ;
            case MovingDirection.left:
                col = Math.floor(posx);
                row = Math.round(posy);
                if (Math.abs(posx - col) < 1 - margin)
                {
                    col--;
                    if (x % this.tileSize >= velocity)
                        return false;
                }
                break ;
            case MovingDirection.up:
                row = Math.floor(posy);
                col = Math.round(posx);
                if (Math.abs(posy - row) < 1 - margin)
                {
                    row--;
                    if (y % this.tileSize >= velocity)
                        return false;
                }
                break ;
            case MovingDirection.down:
                row = Math.ceil(posy);
                col = Math.round(posx);
                if (Math.abs(posy - row) < 1 - margin)
                {
                    row++;
                    if (y % this.tileSize && y % this.tileSize <= this.tileSize - velocity)
                        return false;
                }
                break ;
        }
        
        if (this.map[row][col] == 3)
            return true;

        return false;
    }

}

class Bomberman
{

    constructor(x, y, tileSize, velocity, tileMap, controls, color)
    {
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.tileMap = tileMap;
        this.controls = controls;
        this.color = color;

        this.keys = {
            down: false,
            left: false,
            right: false,
            up: false,
        };

        this.defaultTimer = 15;
        this.timer = null;

        this.direction = MovingDirection.down;
        this.rotation = this.direction - 1;
        this.nextDirection = null;

        this.bombNumber = 5;
        this.bombs = [];

        this.lives = 1;

        document.addEventListener("keyup", this.#keyup);
        document.addEventListener("keydown", this.#keydown);
        this.#loadImages();
    }

    isKeyPressed()
    {
        let keys = 0;
        if (this.keys.up)
            keys++;
        if (this.keys.down)
            keys++;
        if (this.keys.left)
            keys++;
        if (this.keys.right)
            keys++;
        return keys;
    }

    draw(ctx)
    {
        this.#move();
        this.#animate();
        this.#checkDeath();

        const size = this.tileSize / 2;
        ctx.save();
        ctx.translate(this.x + size, this.y + size);
        ctx.rotate((this.rotation * 90 * Math.PI) / 180);
        ctx.drawImage(this.bbm_imgs[this.bbm_img_index], -size, -size, this.tileSize, this.tileSize);
        ctx.restore();
    }

    drawBombs(ctx)
    {
        for (let i = 0; i < this.bombs.length; i++)
            if (this.bombs[i])
                this.bombs[i].draw(ctx);

        for (let i = 0; i < this.bombs.length; i++)
            this.#checkBomb(i);
    }

    #checkDeath()
    {
        let row = Math.round(this.y / this.tileSize);
        let col = Math.round(this.x / this.tileSize);

        if (this.tileMap.map[row][col] == 4 || this.tileMap.map[row][col] == 5 || this.tileMap.map[row][col] == 6)
            this.lives--;
    }

    #checkBomb(i)
    {
        if (!this.bombs[i])
            return ;

        let row = Math.round(this.bombs[i].y / this.tileSize);
        let col = Math.round(this.bombs[i].x / this.tileSize);

        if (this.tileMap.map[row][col] == 5 || this.tileMap.map[row][col] == 6)
        {
            this.bombs[i].explode();
            this.bombs[i] = null;
        }
    }

    #loadImages()
    {
        const bbm_img_right1 = new Image();
        bbm_img_right1.src = `/media/images/bomberman/bomberman_${this.color}1.png`;
        const bbm_img_right2 = new Image();
        bbm_img_right2.src = `/media/images/bomberman/bomberman_${this.color}2.png`;

        this.bbm_imgs = [bbm_img_right1, bbm_img_right2];
        this.bbm_img_index = 0;
    }

    #dropBomb()
    {
        let n = 0;
        for (let i = 0; i < this.bombs.length; i++)
            if (this.bombs[i])
                n++;

        if (n >= this.bombNumber)
            return ;

        let row = Math.round(this.y / this.tileSize);
        let col = Math.round(this.x / this.tileSize);
        if (this.tileMap.map[row][col] == 3)
            return ;
        
        this.tileMap.map[row][col] = 3;

        let bomb = new Bomb(col * this.tileSize, row * this.tileSize, this.tileSize, this.tileMap);
        this.bombs.push(bomb);

        const myTimeout = setTimeout(() => {
            if (this.bombs[0])
                this.bombs[0].explode();
            this.bombs.shift();
        }, bomb.timer * 1000);
    }

    #keydown = (event) => {

        let keys = this.isKeyPressed();
        
        if (event.keyCode == this.controls.up)
        {
            if (this.keys.up || keys == 2)
                return ;
            this.keys.up = true;

            if (!keys)
                this.direction = MovingDirection.up;
            if (keys == 1)
                this.nextDirection = MovingDirection.up;
        }
        else if (event.keyCode == this.controls.down)
        {
            if (this.keys.down || keys == 2)
                return ;
            this.keys.down = true;

            if (!keys)
                this.direction = MovingDirection.down;
            if (keys == 1)
                this.nextDirection = MovingDirection.down;
        }
        else if (event.keyCode == this.controls.left)
        {
            if (this.keys.left || keys == 2)
                return ;
            this.keys.left = true;

            if (!keys)
                this.direction = MovingDirection.left;
            if (keys == 1)
                this.nextDirection = MovingDirection.left;
        }
        else if (event.keyCode == this.controls.right)
        {
            if (this.keys.right || keys == 2)
                return ;
            this.keys.right = true;

            if (!keys)
                this.direction = MovingDirection.right;
            if (keys == 1)
                this.nextDirection = MovingDirection.right;
        }
        else if (event.keyCode == this.controls.action)
            this.#dropBomb();

    };

    #keyup = (event) => {

        let keys = this.isKeyPressed();
        
        if (event.keyCode == this.controls.up)
        {
            if (!this.keys.up)
                return ;
            if (this.direction == MovingDirection.up && this.nextDirection)
                this.direction = this.nextDirection;
            this.keys.up = false;
        }
        else if (event.keyCode == this.controls.down)
        {
            if (!this.keys.down)
                return ;
            if (this.direction == MovingDirection.down && this.nextDirection)
                this.direction = this.nextDirection;
            this.keys.down = false;
        }
        else if (event.keyCode == this.controls.left)
        {
            if (!this.keys.left)
                return ;
            if (this.direction == MovingDirection.left && this.nextDirection)
                this.direction = this.nextDirection;
            this.keys.left = false;
        }
        else if (event.keyCode == this.controls.right)
        {
            if (!this.keys.right)
                return ;
            if (this.direction == MovingDirection.right && this.nextDirection)
                this.direction = this.nextDirection;
            this.keys.right = false;
        }
        else
            return ;

        if (keys == 2)
            this.nextDirection = null;
    };

    #move()
    {
        let keys = this.isKeyPressed();

        if (!keys)
        {
            this.timer = null;
            return ;
        }

        if (this.timer == null)
            this.timer = this.defaultTimer;

        let dir = this.direction;
        if (this.nextDirection)
            dir = this.nextDirection;
        this.rotation = dir - 1;

        if (this.tileMap.collideWall(this.x, this.y, dir, this.velocity) || this.tileMap.collideBomb(this.x, this.y, dir, this.velocity))
            return ;

        switch (dir)
        {
            case MovingDirection.up:
                this.y -= this.velocity;
                this.x = this.#align(this.x);
                break ;
            case MovingDirection.down:
                this.y += this.velocity;
                this.x = this.#align(this.x);
                break ;
            case MovingDirection.left:
                this.x -= this.velocity;
                this.y = this.#align(this.y);
                break ;
            case MovingDirection.right:
                this.x += this.velocity;
                this.y = this.#align(this.y);
                break ;
        }
    }

    #align(pos)
    {
        let dist = pos % this.tileSize;
        let step = this.velocity;

        if (dist < step)
            step = dist;

        if (dist > this.tileSize / 2)
            pos += step;
        else
            pos -= step;

        return pos;
    }

    #animate()
    {
        if (this.timer == null)
            return ;

        this.timer--;
        if (this.timer == 0)
        {
            this.timer = this.defaultTimer;
            this.bbm_img_index++;
            if (this.bbm_img_index == this.bbm_imgs.length)
                this.bbm_img_index = 0;
        }
    }

}

class Bomb
{

    constructor(x, y, tileSize, tileMap)
    {
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.tileMap = tileMap;
        this.timer = 3;
        this.reach = 3;
        this.defaultAnimationTimer = 10;
        this.animationTimer = this.defaultAnimationTimer;
        this.#loadImages();
    }

    draw(ctx)
    {
        this.#animate();
        ctx.drawImage(this.bombs_img[this.bombs_index], this.x, this.y, this.tileSize, this.tileSize);
    }

    #loadImages()
    {
        const bomb1 = new Image();
        bomb1.src = `/media/images/bomberman/bomb1.png`;
        const bomb2 = new Image();
        bomb2.src = `/media/images/bomberman/bomb2.png`;
        const bomb3 = new Image();
        bomb3.src = `/media/images/bomberman/bomb3.png`;

        this.bombs_img = [bomb1, bomb2, bomb3, bomb2];
        this.bombs_index = 0;
    }

    #animate()
    {
        this.animationTimer--;
        if (this.animationTimer == 0)
        {
            this.animationTimer = this.defaultAnimationTimer;
            this.bombs_index++;
            if (this.bombs_index == this.bombs_img.length)
                this.bombs_index = 0;
        }
    }

    explode()
    {
        let row = Math.round(this.y / this.tileSize);
        let col = Math.round(this.x / this.tileSize);

        this.tileMap.map[row][col] = 4;

        for (let i = row + 1; i <= row + this.reach; i++)
        {
            if (this.tileMap.map[i][col] == 1)
                break ;
            this.tileMap.map[i][col] = 6;
        }

        for (let i = row - 1; i >= row - this.reach; i--)
        {
            if (this.tileMap.map[i][col] == 1)
                break ;
            this.tileMap.map[i][col] = 6;
        }

        for (let i = col + 1; i <= col + this.reach; i++)
        {
            if (this.tileMap.map[row][i] == 1)
                break ;
            this.tileMap.map[row][i] = 5;
        }

        for (let i = col - 1; i >= col - this.reach; i--)
        {
            if (this.tileMap.map[row][i] == 1)
                break ;
            this.tileMap.map[row][i] = 5;
        }

        const explosion = setTimeout(() =>{

            this.tileMap.map[row][col] = 0;

            for (let i = row; i <= row + this.reach; i++)
            {
                if (this.tileMap.map[i][col] == 1)
                    break ;
                this.tileMap.map[i][col] = 0;
            }

            for (let i = row; i >= row - this.reach; i--)
            {
                if (this.tileMap.map[i][col] == 1)
                    break ;
                this.tileMap.map[i][col] = 0;
            }
    
            for (let i = col; i <= col + this.reach; i++)
            {
                if (this.tileMap.map[row][i] == 1)
                    break ;
                this.tileMap.map[row][i] = 0;
            }
    
            for (let i = col; i >= col - this.reach; i--)
            {
                if (this.tileMap.map[row][i] == 1)
                    break ;
                this.tileMap.map[row][i] = 0;
            }

        }, 500);
    }

}

const velocity = 3;
const tileSize = 50;
var canvas;
var ctx;
var tileMap;

let p1_controls = {up: 87, down: 83, left: 65, right: 68, action: 32};
let p2_controls = {up: 38, down: 40, left: 37, right: 39, action: 16};
let p1_color;
let p2_color;
let player1;
let player2;
let players;
var runGame;

function gameInit()
{
    canvas = document.getElementById("game");
    ctx = canvas.getContext("2d");
    tileMap = new TileMap(tileSize);
    tileMap.setCanvasSize(canvas);
    
    p1_color = JSON.parse(document.getElementById('color1').textContent);
    p2_color = JSON.parse(document.getElementById('color2').textContent);
    player1 = new Bomberman(1 * tileSize, 1 * tileSize, tileSize, velocity, tileMap, p1_controls, p1_color);
    player2 = new Bomberman(13 * tileSize, 13 * tileSize, tileSize, velocity, tileMap, p2_controls, p2_color);

    players = [];
    players.push(player1);
    players.push(player2);

    if (runGame)
        clearInterval(runGame);
    runGame = setInterval(gameLoop, 1000 / 60);
}

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

    let winner = "none";
    if (p == 1)
        winner = "player1";
    if (p == 2)
        winner = "player2";

    let text = "Player " + p + " wins";
    if (n == 0)
        text = "Game Over";

    ctx.fillStyle = "black";
    ctx.font = "75px comic sans";
    ctx.fillText(text, canvas.width / 4, canvas.height / 2);

    clearInterval(runGame);

    setTimeout(() => {
        document.getElementById("winner").value = winner;
        document.getElementById("result").click();
    }, 3000);

    return true;
}