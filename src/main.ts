// Imports
import SpaceShip from "./characters/player";
import { DIMENSIONS, BULLET__WIDTH, BULLET__HEIGHT } from "./constants/constants";
import { SHIP__WIDTH, SHIP__HEIGHT } from "./constants/constants";
import { canvas, ctx, video } from "./html/html-elements";
import { playerMovement } from "./components/player-movement";
import Bullet from "./weapons/bullet";
import { detectCollision } from "./helper";
import { enemyGrid } from "./components/enemygrid";
import Particle from "./characters/explosion";
import generateRandomNumber from "./utils/random";
import EnemyBullet from "./weapons/enemy-bullet";

// Canvas dimensions
canvas.width = DIMENSIONS.CANVAS__WIDHT;
canvas.height = DIMENSIONS.CANVAS__HEIGHT;

// Draw text
function drawText() {
    ctx.font = "60px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(`Wave ${1}/${3}`, canvas.width / 2 - 60, canvas.height / 2);
}

// Enemy ships
const spaceshipImages = [
    "./images/spaceship/blueship/blueship1.png",
    "./images/spaceship/blueship/blueship2.png",
    "./images/spaceship/blueship/blueship3.png",
    "./images/spaceship/blueship/blueship4.png",
    "./images/spaceship/blueship/blueship5.png",
];

// Bullet
const bulletImg = "./images/spaceship/bullets/bullet.png";

const bullets: Bullet[] = [];
const spaceShip = new SpaceShip(spaceshipImages, DIMENSIONS.CANVAS__WIDHT / 2 - SHIP__WIDTH / 2, DIMENSIONS.CANVAS__HEIGHT - 110, SHIP__WIDTH, SHIP__HEIGHT);

const addBullet = function () {
    const bullet = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 25, spaceShip.ypose - 30, BULLET__WIDTH, BULLET__HEIGHT);
    bullets.push(bullet);
};

// Fire bullets at intervals
setInterval(() => {
    addBullet();
}, 200);

let frameCount = 0;
const enemies = enemyGrid();

// particles of explosion
const particles: Particle[] = [];

export const enemyBullets: EnemyBullet[] = [];

let animationFrameId: number;

let randEnemyBullet = generateRandomNumber(0, enemies.length - 1);

function drawFrames() {
    frameCount++;
    // Draw background video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Adding particles
    particles.forEach((particle, index) => {
        if (particle.opacity <= 0) {
            particles.splice(index, 1);
        } else {
            particle.updatePosition();
        }
    });

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

    // Show text for first 100 frames
    if (frameCount < 100) {
        drawText();
    }

    // Detect collision with bullet and enemy
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (detectCollision(bullets[i], enemies[j])) {
                if (enemies[j].life > 0) {
                    enemies[j].life--;
                    enemies[j].showLifeBar = true; // Show life bar
                    enemies[j].lifeBarTimer = 120; // Set timer for 2 seconds (assuming 60 FPS)
                }
                if (enemies[j].life <= 0) {
                    for (let k = 0; k < 15; k++) {
                        const vx = (Math.random() - 0.5) * 2;
                        const vy = (Math.random() - 0.5) * 2;
                        const r = Math.random() * 5;
                        particles.push(new Particle(enemies[j].xpose + enemies[j].width / 2, enemies[j].ypose + enemies[j].height / 2, vx, vy, r, "#cc0118"));
                    }
                }
                bullets.splice(i, 1);
                break;
            }
        }
    }

    // Checking if enemy life is over and remove from enemies array
    for (let j = 0; j < enemies.length; j++) {
        if (enemies[j].life <= 0) {
            enemies.splice(j, 1);
        }
    }

    // Update and draw enemies
    enemies.forEach((enemy) => {
        enemy.updatePosition();
        enemy.draw();
    });

    if (frameCount % 100 == 0 && enemies.length > 0) {
        randEnemyBullet = generateRandomNumber(0, enemies.length - 1);
        enemyBullets.push(
            new EnemyBullet(
                "./images/enemies/bullet/space_mine.png",
                enemies[randEnemyBullet].xpose + enemies[randEnemyBullet].width / 2,
                enemies[randEnemyBullet].ypose + enemies[randEnemyBullet].height,
                30,
                30
            )
        );
    }
    enemyBullets.forEach((b) => {
        b.updatePosition();
    });

    // Request next frame
    animationFrameId = requestAnimationFrame(drawFrames);
}

// Start drawing the video once it is loaded
video.addEventListener("canplay", () => {
    if (!animationFrameId) {
        drawFrames();
    }
});
