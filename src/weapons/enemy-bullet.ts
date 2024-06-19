import { ctx } from "../html/html-elements";

export interface IEnemyBullet {
    img: string;
    xpose: number;
    ypose: number;
    width: number;
    height: number;
    dx: number;

    draw: (img: string) => void;

    shoot: () => void;
}

export default class EnemyBullet implements IEnemyBullet {
    img: string;
    xpose: number;
    ypose: number;
    width: number;
    height: number;
    dx: number;
    dy: number;
    private imageElement: HTMLImageElement;

    constructor(img: string, xpose: number, ypose: number, width: number, height: number) {
        this.img = img;
        this.width = width;
        this.height = height;
        this.xpose = xpose;
        this.ypose = ypose;
        this.dx = 0;
        this.dy = 5;

        // Load image once
        this.imageElement = new Image();
        this.imageElement.src = this.img;
    }

    draw(): void {
        ctx.drawImage(this.imageElement, this.xpose, this.ypose, this.width, this.height);
    }

    shoot(): void {
        this.ypose += this.dy;
        this.draw();
    }
}
