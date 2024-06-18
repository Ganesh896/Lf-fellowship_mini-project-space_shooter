import { ctx } from "../html/html-elements";

export interface IEnemyBullet {
    img: string;
    xpose: number;
    ypose: number;
    width: number;
    height: number;
    dx: number;

    draw: (img: string) => void;

    updatePosition: () => void;
}

export default class EnemyBullet implements IEnemyBullet {
    img: string;
    xpose: number;
    ypose: number;
    width: number;
    height: number;
    dx: number;
    dy: number;

    constructor(img: string, xpose: number, ypose: number, width: number, height: number) {
        this.img = img;
        this.width = width;
        this.height = height;
        this.xpose = xpose;
        this.ypose = ypose;
        this.dx = 0;
        this.dy = 5;
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
