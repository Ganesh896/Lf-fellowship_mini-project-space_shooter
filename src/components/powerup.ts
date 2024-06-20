// import { DIMENSIONS, ENEMY__WIDTH } from "../constants/constants";
import { ctx } from "../html/html-elements";

export interface IPower {
    img: string;
    xpose: number;
    ypose: number;
    width: number;
    height: number;

    draw: () => void;
    updatePosition: () => void;
}

export default class Power implements IPower {
    img: string;
    xpose: number;
    ypose: number;
    width: number;
    height: number;
    dx: number;
    dy: number;

    powerType: string;

    constructor(imgSrc: string, xpose: number, ypose: number, width: number, height: number, powerType: string = "addBullet") {
        this.img = imgSrc;
        this.width = width;
        this.height = height;
        this.xpose = xpose;
        this.ypose = ypose;
        this.dx = 2;
        this.dy = 2;

        this.powerType = powerType;
    }

    draw(): void {
        const img = new Image();
        img.src = this.img;
        ctx.drawImage(img, this.xpose, this.ypose, this.width, this.height);
    }

    updatePosition(): void {
        this.ypose += this.dy;
        this.draw();
    }
}
