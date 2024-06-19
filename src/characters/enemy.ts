import { DIMENSIONS, ENEMY__WIDTH } from "../constants/constants";
import { ctx } from "../html/html-elements";

export interface IEnemy {
    img: string;
    xpose: number;
    ypose: number;
    width: number;
    height: number;

    draw: () => void;
    updatePosition: (frameCount: number) => void;
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
    showLifeBar: boolean;
    lifeBarTimer: number;
    movementType: string;
    initialX: number;
    initialY: number;

    constructor(imgSrc: string, xpose: number, ypose: number, width: number, height: number, life: number, movementType: string = "linear") {
        this.img = imgSrc;
        this.width = width;
        this.height = height;
        this.xpose = xpose;
        this.ypose = ypose;
        this.dx = 2;
        this.dy = 2;
        this.life = life;
        this.maxLife = life;
        this.insideCanvas = false;
        this.showLifeBar = false;
        this.lifeBarTimer = 0;
        this.movementType = movementType;
        this.initialX = xpose;
        this.initialY = ypose;
    }

    draw(): void {
        const img = new Image();
        img.src = this.img;
        ctx.drawImage(img, this.xpose, this.ypose, this.width, this.height);

        if (this.showLifeBar) {
            const lifeBarWidth = (this.life / this.maxLife) * this.width;
            ctx.fillStyle = "red";
            ctx.fillRect(this.xpose, this.ypose - 10, lifeBarWidth, 5);
        }
    }

    updatePosition(frameCount: number): void {
        switch (this.movementType) {
            case "sine":
                this.xpose = this.initialX + Math.sin(frameCount * 0.05) * 50;
                this.ypose += this.dy;
                break;
            case "circular":
                this.xpose += this.initialX + Math.cos(frameCount * 0.05) * 50;
                this.ypose += this.initialY + Math.sin(frameCount * 0.05) * 50;
                break;
            case "zigzag":
                this.xpose += this.dx * Math.sin(frameCount * 0.1);
                this.ypose += this.dy;
                break;
            default: // linear
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
                break;
        }

        if (this.ypose > DIMENSIONS.CANVAS__HEIGHT) {
            this.ypose = -100;
        }

        if (this.showLifeBar) {
            this.lifeBarTimer -= 1;
            if (this.lifeBarTimer <= 0) {
                this.showLifeBar = false;
            }
        }
    }
}
