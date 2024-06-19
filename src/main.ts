// Imports
import SpaceShip from "./characters/player";
import { DIMENSIONS, BULLET__WIDTH, BULLET__HEIGHT } from "./constants/constants";
import { SHIP__WIDTH, SHIP__HEIGHT } from "./constants/constants";
import { canvas, ctx, video } from "./html/html-elements";
import { playerMovement } from "./components/player-movement";
import Bullet from "./weapons/bullet";
import { isEnemyCollide, isShipCollide } from "./helper";
import Particle from "./characters/explosion";
import generateRandomNumber from "./utils/random";
import EnemyBullet from "./weapons/enemy-bullet";
import { drawCurrentScore, drawPauseText, gameOver } from "./components/texts";
import { LevelManager } from "./levels/levelManager";
import Enemy from "./characters/enemy";

// Canvas dimensions
canvas.width = DIMENSIONS.CANVAS__WIDHT;
canvas.height = DIMENSIONS.CANVAS__HEIGHT;

// Score
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

// Level Manager
const levelManager = new LevelManager();
let currentLevel = levelManager.getCurrentLevel();

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

const gunshotAudio = new Audio("/audio/gun-shoot.wav");
gunshotAudio.volume = 0.3;

const addBullet = function () {
    const bullet = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 25, spaceShip.ypose - 30, BULLET__WIDTH, BULLET__HEIGHT);
    bullets.push(bullet);
    gunshotAudio.play();
};

// Fire bullets at intervals
let bulletInterval: any;

const startBulletInterval = () => {
    bulletInterval = setInterval(() => {
        addBullet();
    }, 200);
};

const stopBulletInterval = () => {
    clearInterval(bulletInterval);
};

let frameCount = 0;
let enemies: Enemy[] = currentLevel.generateEnemies(); // Initialize enemies from level config

// Particles of explosion
const particles: Particle[] = [];

// Enemy bullets
export const enemyBullets: EnemyBullet[] = [];

let animationFrameId: number;
let gameOverFlag = false;
let isPaused = false; // Add a flag to indicate if the game is paused

// Add background music
const background = new Audio();
background.src = "/audio/background.mp3";
background.loop = true;
background.volume = 0.2;
background.currentTime = 0;

// Function to draw frames
function drawFrames() {
    if (gameOverFlag) {
        drawGameOver();
        return;
    }

    if (isPaused) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;

    if (background.paused) {
        background.play();
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
        if (particle.opacity <= 0) {
            particles.splice(index, 1);
        } else {
            particle.updatePosition();
        }
    });

    spaceShip.playerMovement(playerMovement.moveRight, playerMovement.moveLeft, playerMovement.moveUp, playerMovement.moveDown);
    spaceShip.draw();

    bullets.forEach((b, index) => {
        b.updatePosition();
        if (b.ypose < 0) {
            bullets.splice(index, 1);
        }
    });

    if (frameCount < 100) {
        drawText();
    }

    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (isEnemyCollide(bullets[i], enemies[j])) {
                if (enemies[j].life > 0) {
                    enemies[j].life--;
                    enemies[j].showLifeBar = true;
                    enemies[j].lifeBarTimer = 120;
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

    for (let j = 0; j < enemies.length; j++) {
        if (enemies[j].life <= 0) {
            enemies.splice(j, 1);
            currentScore += 1;
        }
    }

    enemies.forEach((enemy) => {
        enemy.updatePosition(frameCount);
        enemy.draw();
    });

    if (enemies.length === 0) {
        levelManager.goToNextLevel();
        currentLevel = levelManager.getCurrentLevel();
        enemies = currentLevel.generateEnemies();
    }

    if (frameCount % 100 === 0 && enemies.length > 0) {
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

    enemyBullets.forEach((b) => {
        b.shoot();
    });

    if (spaceShip.life <= 0) {
        gameOver();
        gunshotAudio.pause();
        gunshotAudio.currentTime = 0;
        background.pause();
        stopBulletInterval();
        gameOverFlag = true;
        return;
    }

    enemyBullets.forEach((bullet, i) => {
        if (isShipCollide(bullet, spaceShip)) {
            if (spaceShip.life > 0) {
                spaceShip.life--;
            }
            enemyBullets.splice(i, 1);
        }
    });

    drawCurrentScore();

    animationFrameId = requestAnimationFrame(drawFrames);
}

// Toggle play/pause
function togglePause() {
    isPaused = !isPaused;
    if (!isPaused) {
        drawPauseText("Play");

        drawFrames();
        startBulletInterval();
        background.play();
    } else {
        drawPauseText("Pause");
        stopBulletInterval();
        background.pause();
        cancelAnimationFrame(animationFrameId);
    }
}

// Add event listeners for play/pause
window.addEventListener("keypress", function (e) {
    if (e.key === " ") {
        togglePause();
    }
});
// Start drawing the video once it is loaded
video.addEventListener("canplay", () => {
    if (!animationFrameId) {
        drawFrames();
        startBulletInterval();
    }
});
