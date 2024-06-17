import { DIMENSIONS } from "../constants/constants";
import { ctx } from "../html/html-elements";

export interface IEnemy {
    img: HTMLImageElement;
    xpose: number;
    ypose: number;
    width: number;
    height: number;

    draw: () => void;
    updatePosition: (dx: number, dy: number) => void;
}

export default class Enemy implements IEnemy {
    img: HTMLImageElement;
    xpose: number;
    ypose: number;
    width: number;
    height: number;
    dx: number;
    dy: number;

    constructor(imgSrc: string, xpose: number, ypose: number, width: number, height: number) {
        this.img = new Image();
        this.img.src = imgSrc;
        this.width = width;
        this.height = height;
        this.xpose = xpose;
        this.ypose = ypose;
        this.dx = 5;
        this.dy = 5;
    }

    draw(): void {
        ctx.drawImage(this.img, this.xpose, this.ypose, this.width, this.height);
    }

    updatePosition(): void {
        this.xpose += this.dx;
        this.ypose += this.dy;

        if (this.xpose < 0) {
            this.dx *= -1;
        }

        if (this.xpose > DIMENSIONS.CANVAS__WIDHT - 200) {
            this.dx *= -1;
        }

        if (this.ypose < 0) {
            this.dy *= -1;
        }

        if (this.ypose > DIMENSIONS.CANVAS__HEIGHT - 200) {
            this.dy *= -1;
        }
    }
}
