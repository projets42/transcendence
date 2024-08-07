import Bomberman from "./bomberman.js";
import MovingDirection from "./move.js";

export default class TileMap
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