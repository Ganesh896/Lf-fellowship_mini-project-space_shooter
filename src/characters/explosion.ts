import { ctx } from "../html/html-elements";

export interface IParticle {
    xpose: number;
    ypose: number;
    radius: number;
    dx: number;
    dy: number;
    color: string;
    opacity: number;

    draw: (img: string) => void;

    updatePosition: () => void;
}

export default class Particle implements IParticle {
    xpose: number;
    ypose: number;
    radius: number;
    dx: number;
    dy: number;
    color: string;
    opacity: number;

    constructor(xpose: number, ypose: number, dx: number, dy: number, radius: number, color: string) {
        this.radius = radius;
        this.xpose = xpose;
        this.ypose = ypose;
        this.color = color;
        this.dx = dx;
        this.dy = dy;
        this.opacity = 1;
    }

    draw(): void {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.xpose, this.ypose, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    updatePosition(): void {
        this.ypose += this.dy;
        this.xpose += this.dx;
        this.opacity -= 0.01;
        this.draw();
    }
}
