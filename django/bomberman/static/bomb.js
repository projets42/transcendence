export default class Bomb
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