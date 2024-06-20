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

    skewAngle: number;

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

        this.skewAngle = 0;
    }

    draw(): void {
        const now = performance.now(); // get the current timestamp in milliseconds
        ctx.save(); // Save the current state of the canvas
        ctx.translate(this.xpose + this.width / 2, this.ypose + this.height / 2); // Move the canvas origin to the center of the spaceship
        ctx.transform(1, this.skewAngle, 0, 1, 0, 0); // Apply skew transformation
        ctx.translate(-(this.xpose + this.width / 2), -(this.ypose + this.height / 2)); // Move the canvas origin back

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
        }

        ctx.restore(); // Restore the canvas state

        // Draw life bar after restoring the canvas state
        const lifeBarWidth = (this.life / this.maxLife) * this.width;
        ctx.fillStyle = "green";
        ctx.fillRect(20, 20, lifeBarWidth, 10);

        ctx.strokeStyle = "red";
        ctx.rect(20, 20, this.width, 10);
        ctx.stroke();
    }

    playerMovement(moveRight: boolean, moveLeft: boolean, moveUp: boolean, moveDown: boolean): void {
        if (moveRight) {
            this.xpose += this.dx;
            this.skewAngle = 0.4; // Skew right
        } else if (moveLeft) {
            this.xpose -= this.dx;
            this.skewAngle = -0.4; // Skew left
        } else {
            this.skewAngle = 0; // No skew
        }

        if (moveUp) {
            this.ypose -= this.dy;
        } else if (moveDown) {
            this.ypose += this.dy;
        }

        if (this.xpose < 0) {
            this.xpose = 0;
        }

        if (this.xpose > DIMENSIONS.CANVAS__WIDHT - SHIP__WIDTH) {
            this.xpose = DIMENSIONS.CANVAS__WIDHT - SHIP__WIDTH;
        }

        if (this.ypose < 0) {
            this.ypose = 0;
        }

        if (this.ypose > DIMENSIONS.CANVAS__HEIGHT - 110) {
            this.ypose = DIMENSIONS.CANVAS__HEIGHT - 110;
        }

        this.draw();
    }
}
