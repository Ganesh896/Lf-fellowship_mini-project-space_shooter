import SpaceShip from "./characters/player";
import { DIMENSIONS } from "./constants/constants";
import { SHIP__WIDTH, SHIP__HEIGHT } from "./constants/constants";
import { canvas, ctx, video } from "./html/html-elements";
import { playerMovement } from "./characters/player-movement";
import Bullet from "./weapons/bullet";
import Enemy from "./characters/enemy";

canvas.width = DIMENSIONS.CANVAS__WIDHT;
canvas.height = DIMENSIONS.CANVAS__HEIGHT;

const spaceshipImages = [
    "./images/spaceship/blueship/blueship1.png",
    "./images/spaceship/blueship/blueship2.png",
    "./images/spaceship/blueship/blueship3.png",
    "./images/spaceship/blueship/blueship4.png",
    "./images/spaceship/blueship/blueship5.png",
];

const bulletImg = "./images/spaceship/bullets/bullet.png";

const bullets: Bullet[] = [];
const spaceShip = new SpaceShip(spaceshipImages, DIMENSIONS.CANVAS__WIDHT / 2 - SHIP__WIDTH / 2, DIMENSIONS.CANVAS__HEIGHT - 110, SHIP__WIDTH, SHIP__HEIGHT);

const addBullet = function () {
    const bullet = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 25, spaceShip.ypose - 30, 50, 50);
    bullets.push(bullet);
};

setInterval(() => {
    addBullet();
}, 200);

const enemiesShip: string[] = [];
for (let i = 0; i < 5; i++) {
    enemiesShip[i] = `./images/enemies/enemy6.gif`;
}

const enemies: Enemy[][] = [];
const numRows = 3;
const numCols = 5;
const gap = 20;
const enemyWidth = 50;
const enemyHeight = 50;

// Calculate the starting position for the grid
const startX = (DIMENSIONS.CANVAS__WIDHT - (numCols * enemyWidth + (numCols - 1) * gap)) / 2;
const startY = 50; // Starting Y position

for (let row = 0; row < numRows; row++) {
    const enemyRow: Enemy[] = [];
    for (let col = 0; col < numCols; col++) {
        const xPos = startX + col * (enemyWidth + gap);
        const yPos = startY + row * (enemyHeight + gap);
        const enemy = new Enemy(enemiesShip[col % enemiesShip.length], xPos, yPos, enemyWidth, enemyHeight);
        enemyRow.push(enemy);
    }
    enemies.push(enemyRow);
}

function drawFrames() {
    // draw background video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Ship movement
    spaceShip.playerMovement(playerMovement.moveRight, playerMovement.moveLeft, playerMovement.moveUp, playerMovement.moveDown);
    spaceShip.draw();

    // Bullet
    bullets.forEach((b, index) => {
        b.updatePosition();
        if (b.ypose < 0) {
            bullets.splice(index, 1); // Remove bullet if it moves off the canvas
        }
    });

    // Update and draw enemies
    enemies.forEach((enemyRow) => {
        enemyRow.forEach((enemy) => {
            enemy.updatePosition();
            enemy.draw();
        });
    });

    requestAnimationFrame(drawFrames);
}

// Start drawing the video once it is loaded
video.addEventListener("canplay", () => {
    drawFrames();
});

video.play();
