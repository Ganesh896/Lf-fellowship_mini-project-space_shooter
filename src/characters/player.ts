import { DIMENSIONS, SHIP__WIDTH } from "../constants/constants";
import { ctx } from "../html/html-elements";

export interface ISpaceShip {
    xpose: number;
    ypose: number;
    width: number;
    height: number;
    dx: number;
    dy: number;

    draw: () => void;

    playerMovement: (moveRight: boolean, moveLeft: boolean, moveUp: boolean, moveDown: boolean) => void;
}

export default class SpaceShip implements ISpaceShip {
    xpose: number;
    ypose: number;
    width: number;
    height: number;
    dx: number;
    dy: number;
    images: HTMLImageElement[];
    currentFrame: number;
    frameCount: number;
    frameInterval: number;
    frameTimer: number;
    life: number;
    maxLife: number;
    explosionImages: HTMLImageElement[];

    constructor(imgSrcArray: string[], explosionSrcArray: string[], xpose: number, ypose: number, width: number, height: number, life: number) {
        this.width = width;
        this.height = height;
        this.xpose = xpose;
        this.ypose = ypose;
        this.dx = 8;
        this.dy = 8;
        this.images = imgSrcArray.map((src) => {
            const img = new Image();
            img.src = src;
            return img;
        });
        this.explosionImages = explosionSrcArray.map((src) => {
            const img = new Image();
            img.src = src;
            return img;
        });
        this.currentFrame = 0;
        this.frameCount = imgSrcArray.length;
        this.frameInterval = 100;
        this.frameTimer = 0;
        this.life = life;
        this.maxLife = life;
    }

    draw(): void {
        const now = performance.now(); // get the current timestamp in milliseconds
        if (this.life <= 0) {
            if (now - this.frameTimer > this.frameInterval) {
                this.currentFrame = (this.currentFrame + 1) % this.explosionImages.length;
                this.frameTimer = now;
            }
            ctx.drawImage(this.explosionImages[this.currentFrame], this.xpose, this.ypose, this.width + 50, this.height + 50);
        } else {
            if (now - this.frameTimer > this.frameInterval) {
                this.currentFrame = (this.currentFrame + 1) % this.frameCount;
                this.frameTimer = now;
            }
            ctx.drawImage(this.images[this.currentFrame], this.xpose, this.ypose, this.width, this.height);

            // Calculate the life bar width based on the current life relative to max life
            const lifeBarWidth = (this.life / this.maxLife) * this.width;

            // Draw life bar
            ctx.fillStyle = "green";
            ctx.fillRect(20, 20, lifeBarWidth, 10);

            ctx.strokeStyle = "red";
            ctx.rect(20, 20, this.width, 10);
            ctx.stroke();
        }
    }

    playerMovement(moveRight: boolean, moveLeft: boolean, moveUp: boolean, moveDown: boolean): void {
        if (moveRight) {
            this.xpose += this.dx;
        } else if (moveLeft) {
            this.xpose -= this.dx;
        } else if (moveUp) {
            this.ypose -= this.dy;
        } else if (moveDown) {
            this.ypose += this.dy;
        }

        // detection on left wall
        if (this.xpose < 0) {
            this.xpose = 0;
        }

        // detection on right wall
        if (this.xpose > DIMENSIONS.CANVAS__WIDHT - SHIP__WIDTH) {
            this.xpose = DIMENSIONS.CANVAS__WIDHT - SHIP__WIDTH;
        }

        // detection on top wall
        if (this.ypose < 0) {
            this.ypose = 0;
        }

        // detection on down wall
        if (this.ypose > DIMENSIONS.CANVAS__HEIGHT - 110) {
            this.ypose = DIMENSIONS.CANVAS__HEIGHT - 110;
        }

        this.draw();
    }
}
