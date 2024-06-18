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

    constructor(imgSrc: string, xpose: number, ypose: number, width: number, height: number, life: number) {
        this.img = imgSrc;
        this.width = width;
        this.height = height;
        this.xpose = xpose;
        this.ypose = ypose;
        this.dx = 5;
        this.dy = 5;
        this.life = life;
        this.insideCanvas = false;
    }

    draw(): void {
        const img = new Image();
        img.src = this.img;
        ctx.drawImage(img, this.xpose, this.ypose, this.width, this.height);

        ctx.fillStyle = "red";
        ctx.fillRect(this.xpose, this.ypose - 10, (this.life * this.width) / 2, 5);
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
    }
}
