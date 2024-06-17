import { DIMENSIONS, SHIP__HEIGHT, SHIP__WIDTH } from "../constants/constants";
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

    constructor(imgSrcArray: string[], xpose: number, ypose: number, width: number, height: number) {
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
        this.currentFrame = 0;
        this.frameCount = imgSrcArray.length;
        this.frameInterval = 100; // Change the frame every 100ms
        this.frameTimer = 0;
    }

    draw(): void {
        const now = performance.now(); //get the current timestamp in millisecond
        if (now - this.frameTimer > this.frameInterval) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.frameTimer = now;
        }
        ctx.drawImage(this.images[this.currentFrame], this.xpose, this.ypose, this.width, this.height);
    }

    playerMovement(moveRight: boolean, moveLeft: boolean, moveUp: boolean, moveDown: boolean): void {
        if (moveRight) {
            this.xpose += this.dx;
            console.log("right");
        } else if (moveLeft) {
            this.xpose -= this.dx;
            console.log("left");
        } else if (moveUp) {
            this.ypose -= this.dy;
            console.log("up");
        } else if (moveDown) {
            this.ypose += this.dy;
            console.log("down");
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
