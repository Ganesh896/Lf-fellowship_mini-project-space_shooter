// enemy.ts file

import { DIMENSIONS, ENEMY__WIDTH } from "../constants/constants";
import { ctx } from "../html/html-elements";

export interface IEnemy {
    img: string;
    xpose: number;
    ypose: number;
    width: number;
    height: number;

    draw: () => void;
    updatePosition: () => void;
}

export default class Enemy implements IEnemy {
    img: string;
    xpose: number;
    ypose: number;
    width: number;
    height: number;
    dx: number;
    dy: number;
    insideCanvas: boolean;
    life: number;
    maxLife: number;
    showLifeBar: boolean; // Add property to track life bar visibility
    lifeBarTimer: number; // Add property to track the time to hide the life bar

    constructor(imgSrc: string, xpose: number, ypose: number, width: number, height: number, life: number) {
        this.img = imgSrc;
        this.width = width;
        this.height = height;
        this.xpose = xpose;
        this.ypose = ypose;
        this.dx = 5;
        this.dy = 5;
        this.life = life;
        this.maxLife = life;
        this.insideCanvas = false;
        this.showLifeBar = false; // Initialize to not show life bar
        this.lifeBarTimer = 0; // Initialize timer
    }

    draw(): void {
        const img = new Image();
        img.src = this.img;
        ctx.drawImage(img, this.xpose, this.ypose, this.width, this.height);

        // Draw life bar only if it should be visible
        if (this.showLifeBar) {
            // Calculate the life bar width based on the current life relative to max life
            const lifeBarWidth = (this.life / this.maxLife) * this.width;

            // Draw life bar
            ctx.fillStyle = "red";
            ctx.fillRect(this.xpose, this.ypose - 10, lifeBarWidth, 5);
        }
    }

    updatePosition(): void {
        this.xpose += this.dx;
        this.ypose += this.dy;

        if (this.ypose > 0) {
            this.insideCanvas = true;
        }

        if (this.insideCanvas && this.ypose < 0) {
            this.dy *= -1;
        }

        if (this.xpose + ENEMY__WIDTH > DIMENSIONS.CANVAS__WIDHT) {
            this.dx *= -1;
        }

        if (this.insideCanvas && this.xpose < 0) {
            this.dx *= -1;
        }

        if (this.ypose > DIMENSIONS.CANVAS__HEIGHT - 200) {
            this.dy *= -1;
        }

        // Update life bar visibility timer
        if (this.showLifeBar) {
            this.lifeBarTimer -= 1;
            if (this.lifeBarTimer <= 0) {
                this.showLifeBar = false; // Hide life bar after timer expires
            }
        }
    }
}
