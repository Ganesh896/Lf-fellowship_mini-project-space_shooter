import { ctx } from "../html/html-elements";

export interface IBullet {
    img: string;
    xpose: number;
    ypose: number;
    width: number;
    height: number;
    dx: number;

    draw: (img: string) => void;

    updatePosition: () => void;
}

export default class Bullet implements IBullet {
    img: string;
    xpose: number;
    ypose: number;
    width: number;
    height: number;
    dx: number;
    dy: number;
    projectile: string;

    constructor(img: string, xpose: number, ypose: number, width: number, height: number, dx: number = 0, projectile: string = "straight") {
        this.img = img;
        this.width = width;
        this.height = height;
        this.xpose = xpose;
        this.ypose = ypose;
        this.dx = dx;
        this.dy = 5;
        this.projectile = projectile;
    }

    draw(): void {
        const img = new Image();
        img.src = this.img;

        ctx.drawImage(img, this.xpose, this.ypose, this.width, this.height);
    }

    updatePosition(): void {
        if (this.projectile === "straight") {
            this.ypose -= this.dy;
        } else if (this.projectile === "topLeft") {
            this.ypose -= this.dy;
            this.xpose -= this.dx;
        } else if (this.projectile === "topRight") {
            this.ypose -= this.dy;
            this.xpose += this.dx;
        }

        this.draw();
    }
}
