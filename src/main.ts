// Imports
import SpaceShip from "./characters/player";
import { DIMENSIONS, BULLET__WIDTH, BULLET__HEIGHT } from "./constants/constants";
import { SHIP__WIDTH, SHIP__HEIGHT } from "./constants/constants";
import { canvas, ctx, video } from "./html/html-elements";
import { playerMovement } from "./components/player-movement";
import Bullet from "./weapons/bullet";
import { isEnemyCollide, isShipCollide } from "./helper";
import { enemyGrid } from "./components/enemygrid";
import Particle from "./characters/explosion";
import generateRandomNumber from "./utils/random";
import EnemyBullet from "./weapons/enemy-bullet";
import { drawCurrentScore, gameOver } from "./components/texts";

// Canvas dimensions
canvas.width = DIMENSIONS.CANVAS__WIDHT;
canvas.height = DIMENSIONS.CANVAS__HEIGHT;

// score
export let currentScore = 0;
export let highScore = localStorage.getItem("highscore") || 0;

// Draw text
function drawText() {
    ctx.font = "60px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(`Wave ${1}/${3}`, canvas.width / 2 - 60, canvas.height / 2);
}

// Draw game over text
function drawGameOver() {
    ctx.font = "80px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", canvas.width / 2 - 200, canvas.height / 2);
}

// Enemy ships
let spaceshipImages = [
    "/images/spaceship/blueship/blueship1.png",
    "/images/spaceship/blueship/blueship2.png",
    "/images/spaceship/blueship/blueship3.png",
    "/images/spaceship/blueship/blueship4.png",
    "/images/spaceship/blueship/blueship5.png",
];

// Explosion images
let explosionImages = Array.from({ length: 17 }, (_, i) => `/images/spaceship/blueship/explosion/explosion${i}.png`);

// Bullet
const bulletImg = "/images/spaceship/bullets/bullet.png";

const bullets: Bullet[] = [];
const spaceShip = new SpaceShip(spaceshipImages, explosionImages, DIMENSIONS.CANVAS__WIDHT / 2 - SHIP__WIDTH / 2, DIMENSIONS.CANVAS__HEIGHT - 110, SHIP__WIDTH, SHIP__HEIGHT, 3);

const gunshotAudio = new Audio("/audio/gun-shoot.wav"); // Add the audio object

const addBullet = function () {
    const bullet = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 25, spaceShip.ypose - 30, BULLET__WIDTH, BULLET__HEIGHT);
    bullets.push(bullet);
    gunshotAudio.play(); // Play the gunshot sound
};

// Fire bullets at intervals
const bulletInterval = setInterval(() => {
    addBullet();
}, 200);

let frameCount = 0;
const enemies = enemyGrid();

// particles of explosion
const particles: Particle[] = [];

// enemy bullets
export const enemyBullets: EnemyBullet[] = [];

let animationFrameId: number;
let gameOverFlag = false; // Add a flag to indicate when the game is over

// Add background music
const background = new Audio();
background.src = "/audio/background.mp3";
background.loop = true; // Loop the background music
background.currentTime = 0;

function drawFrames() {
    if (gameOverFlag) {
        drawGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;

    // Ensure the background music is playing
    if (background.paused) {
        background.play();
    }

    // Draw background video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Adding explosion particles
    particles.forEach((particle, index) => {
        if (particle.opacity <= 0) {
            particles.splice(index, 1);
        } else {
            particle.updatePosition();
        }
    });

    // Player Ship movement
    spaceShip.playerMovement(playerMovement.moveRight, playerMovement.moveLeft, playerMovement.moveUp, playerMovement.moveDown);
    spaceShip.draw();

    // remove player Bullet
    bullets.forEach((b, index) => {
        b.updatePosition();
        if (b.ypose < 0) {
            bullets.splice(index, 1); // Remove bullet if it moves off the canvas
        }
    });

    // Show WAVE text for first 100 frames
    if (frameCount < 100) {
        drawText();
    }

    // Detect collision with player bullet and enemy
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (isEnemyCollide(bullets[i], enemies[j])) {
                // showing enemy life bar on hit by bullet
                if (enemies[j].life > 0) {
                    enemies[j].life--;
                    enemies[j].showLifeBar = true; // Show life bar
                    enemies[j].lifeBarTimer = 120; // Set timer for 2 seconds (assuming 60 FPS)
                }

                // show particle explosion when enemy life ended
                if (enemies[j].life <= 0) {
                    for (let k = 0; k < 15; k++) {
                        const vx = (Math.random() - 0.5) * 2;
                        const vy = (Math.random() - 0.5) * 2;
                        const r = Math.random() * 5;
                        particles.push(new Particle(enemies[j].xpose + enemies[j].width / 2, enemies[j].ypose + enemies[j].height / 2, vx, vy, r, "#cc0118"));
                    }
                }
                // remove bullet that hits the enemy
                bullets.splice(i, 1);
                break;
            }
        }
    }

    // Checking if enemy life is over and remove from enemies array
    for (let j = 0; j < enemies.length; j++) {
        if (enemies[j].life <= 0) {
            enemies.splice(j, 1);
            currentScore += 1;
        }
    }

    // Update and draw enemies
    enemies.forEach((enemy) => {
        enemy.updatePosition();
        enemy.draw();
    });

    // creating bullet for random enemy at every 100 frames
    if (frameCount % 100 == 0 && enemies.length > 0) {
        const randEnemyBullet = generateRandomNumber(0, enemies.length - 1);
        enemyBullets.push(
            new EnemyBullet(
                "/images/enemies/bullet/space_mine.png",
                enemies[randEnemyBullet].xpose + enemies[randEnemyBullet].width / 2,
                enemies[randEnemyBullet].ypose + enemies[randEnemyBullet].height,
                30,
                30
            )
        );
    }

    // enemy shooting bullet
    enemyBullets.forEach((b) => {
        b.shoot();
    });

    if (spaceShip.life <= 0) {
        gameOver();
        gunshotAudio.pause();
        gunshotAudio.currentTime = 0; // Reset the audio to the start
        background.pause();
        clearInterval(bulletInterval); // Stop firing bullets
        gameOverFlag = true; // Set game over flag
        return;
    }

    // enemy bullet and player ship collision
    enemyBullets.forEach((bullet, i) => {
        if (isShipCollide(bullet, spaceShip)) {
            if (spaceShip.life > 0) {
                spaceShip.life--;
            }
            enemyBullets.splice(i, 1);
        }
    });

    drawCurrentScore();

    // Request next frame
    animationFrameId = requestAnimationFrame(drawFrames);
}

// Start drawing the video once it is loaded
video.addEventListener("canplay", () => {
    if (!animationFrameId) {
        drawFrames();
    }
});
