import MovingDirection from "./move.js";
import Bomb from "./bomb.js";

export default class Bomberman
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
        // else
        //     console.log(event.keyCode);

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

        if (this.timer == null)
            this.timer = this.defaultTimer;
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