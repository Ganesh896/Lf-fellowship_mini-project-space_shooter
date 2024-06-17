import SpaceShip from "./characters/player";
import { DIMENSIONS } from "./constants/constants";
import { SHIP__WIDTH, SHIP__HEIGHT } from "./constants/constants";
import { canvas, ctx, video } from "./html/html-elements";
import { playerMovement } from "./characters/player-movement";
import Bullet from "./weapons/bullet";
import Enemy from "./characters/enemy";
import generateRandomNumber from "./utils/random";

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

const astroids: string[] = [];
for (let i = 0; i < 20; i++) {
    astroids[i] = `./images/astroids/asteroid${i % 4}.png`;
}

const enemies: Enemy[] = [];
for (let i = 0; i < astroids.length; i++) {
    const randomYpos = generateRandomNumber(-200, 0);
    const randomXpos = generateRandomNumber(0, canvas.width - 100);
    const enemy = new Enemy(astroids[i], randomXpos, randomYpos + i * 100, 100, 100);
    enemies.push(enemy);
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

    // Enemy
    enemies.forEach((enemy) => {
        if (enemy.ypose > canvas.height) {
            const randomYpos = generateRandomNumber(-200, 0);
            const randomXpos = generateRandomNumber(0, canvas.width - 100);
            enemy.ypose = randomYpos;
            enemy.xpose = randomXpos;
        }
        enemy.updatePosition();
    });

    requestAnimationFrame(drawFrames);
}

// Start drawing the video once it is loaded
video.addEventListener("canplay", () => {
    drawFrames();
});

video.play();
