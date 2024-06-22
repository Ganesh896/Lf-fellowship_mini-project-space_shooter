// main.ts
import SpaceShip from "./characters/player";
import { DIMENSIONS } from "./constants/constants";
import { SHIP__WIDTH, SHIP__HEIGHT } from "./constants/constants";
import { canvas, ctx, video } from "./html/html-elements";
import { playerMovement } from "./components/player-movement";
import { isCollide } from "./helper";
import Particle from "./characters/explosion";
import generateRandomNumber from "./utils/random";
import EnemyBullet from "./weapons/enemy-bullet";
import { drawCurrentScore, drawGameOver, drawPauseText, gameOver } from "./components/texts";
import { LevelManager } from "./levels/levelManager";
import Enemy from "./characters/enemy";
import { addBullet, addFourBullet, addRocket, addThreeBullet, addTwoBullet, bullets } from "./components/bullet-types";
import Power from "./components/powerup";

// Canvas dimensions
canvas.width = DIMENSIONS.CANVAS__WIDHT;
canvas.height = DIMENSIONS.CANVAS__HEIGHT;

// Score
export let currentScore = 0;
export let highScore = localStorage.getItem("highscore") || 0;

let bulletPowerCount = 0;
let rocketPowerCount = 0;

// Draw text
function drawText(textString: string) {
    ctx.font = "60px Orbitron";
    ctx.fillStyle = "red";
    const stringWidth = ctx.measureText(textString).width;
    ctx.fillText(textString, canvas.width / 2 - stringWidth / 2, canvas.height / 2);
}

// Level Manager
const levelManager = new LevelManager();
let currentLevel = levelManager.getCurrentLevel();
let currentWaveIndex = 0;

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

const spaceShip = new SpaceShip(spaceshipImages, explosionImages, DIMENSIONS.CANVAS__WIDHT / 2 - SHIP__WIDTH / 2, DIMENSIONS.CANVAS__HEIGHT - 110, SHIP__WIDTH, SHIP__HEIGHT, 5);

const gunshotAudio = new Audio("/audio/gun-shoot.wav");
gunshotAudio.volume = 0.3;

// Fire bullets at intervals
let bulletInterval: any;

const startBulletInterval = () => {
    bulletInterval = setInterval(() => {
        if (rocketPowerCount > 0) {
            addRocket(spaceShip, gunshotAudio, "/images/spaceship/rocket.png");
        } else {
            if (bulletPowerCount == 0) {
                addBullet(spaceShip, gunshotAudio, bulletImg);
            } else if (bulletPowerCount == 1) {
                addTwoBullet(spaceShip, gunshotAudio, bulletImg);
            } else if (bulletPowerCount === 2) {
                addThreeBullet(spaceShip, gunshotAudio, bulletImg);
            } else {
                addFourBullet(spaceShip, gunshotAudio, bulletImg);
            }
        }
    }, 200);
};

const stopBulletInterval = () => {
    clearInterval(bulletInterval);
};

let frameCount = 0;
let enemies: Enemy[] = currentLevel.generateEnemies(); // Initialize enemies from level config

// Particles of explosion
const particles: Particle[] = [];

// power ups
const powers: Power[] = [];

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

// Variables for displaying wave and level text
let showText = true;
let textDisplayTime = 100; // Adjust this for how long the text is displayed

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

    ctx.save(); // Save the canvas state before drawing the spaceship
    spaceShip.playerMovement(playerMovement.moveRight, playerMovement.moveLeft, playerMovement.moveUp, playerMovement.moveDown);
    ctx.restore(); // Restore the canvas state after drawing the spaceship

    bullets.forEach((b, index) => {
        b.updatePosition();
        if (b.ypose < 0) {
            bullets.splice(index, 1);
        }
    });

    if (showText) {
        const textString = `Level ${levelManager.currentLevelIndex + 1} - Wave ${currentLevel.currentWave + 1}/${currentLevel.waves.length + 1}`;
        drawText(textString);
        if (frameCount > textDisplayTime) {
            showText = false;
            frameCount = 0;
        }
    }

    // powers colide with spaceship
    powers.forEach((power) => {
        power.updatePosition();
    });

    powers.forEach((power, i) => {
        if (isCollide(power, spaceShip) || power.ypose > canvas.height) {
            powers.splice(i, 1);
        }

        if (isCollide(power, spaceShip)) {
            if (power.powerType === "addBullet") {
                bulletPowerCount++;
                rocketPowerCount = 0;
            } else if (power.powerType === "addRocket") {
                rocketPowerCount++;
                bulletPowerCount = 0;
            } else if (power.powerType === "addHealth") {
                spaceShip.life = 5;
            }
        }
    });

    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (isCollide(bullets[i], enemies[j])) {
                if (enemies[j].life > 0) {
                    enemies[j].showLifeBar = true;
                    enemies[j].lifeBarTimer = 120;

                    if (rocketPowerCount > 0) {
                        enemies[j].life -= 2;
                    } else {
                        enemies[j].life--;
                    }
                }

                if (enemies[j].life <= 0) {
                    for (let k = 0; k < 15; k++) {
                        const vx = (Math.random() - 0.5) * 2;
                        const vy = (Math.random() - 0.5) * 2;
                        const r = Math.random() * 5;
                        particles.push(new Particle(enemies[j].xpose + enemies[j].width / 2, enemies[j].ypose + enemies[j].height / 2, vx, vy, r, "#cc0118"));
                    }

                    if (enemies[j].isPower) {
                        if (enemies[j].powerType === "addBullet") {
                            powers.push(new Power("/images/spaceship/powerup1.png", enemies[j].xpose + enemies[j].width / 2, enemies[j].ypose + enemies[j].height / 2, 25, 25));
                        } else if (enemies[j].powerType === "addRocket") {
                            powers.push(new Power("/images/spaceship/powerRocket.png", enemies[j].xpose + enemies[j].width / 2, enemies[j].ypose + enemies[j].height / 2, 25, 25, "addRocket"));
                        } else if (enemies[j].powerType === "addHealth") {
                            powers.push(new Power("/images/spaceship/powerHealth.png", enemies[j].xpose + enemies[j].width / 2, enemies[j].ypose + enemies[j].height / 2, 25, 25, "addHealth"));
                        }
                    }
                }
                bullets.splice(i, 1);
                break;
            }
        }
    }

    // remove enemy when its life ended
    for (let j = 0; j < enemies.length; j++) {
        if (enemies[j].life <= 0) {
            enemies.splice(j, 1);
            currentScore += 1;
        }
    }

    // updating and drawing enemy
    enemies.forEach((enemy) => {
        enemy.updatePosition(frameCount);
        enemy.draw();
    });

    // finished one set of enemies
    if (enemies.length === 0) {
        if (currentLevel.isBossLevel()) {
            levelManager.goToNextLevel();
            // if (levelManager.isLastLevel()) {
            //     console.log("You completed all levels!");
            //     return;
            // } else {
            currentLevel = levelManager.getCurrentLevel();
            currentWaveIndex = 0;
            enemies = currentLevel.generateEnemies();
            showText = true; // Show wave text for the next wave
            frameCount = 0;
            // }
        } else {
            currentLevel.goToNextWave();
            currentWaveIndex++;
            enemies = currentLevel.generateEnemies();
            showText = true; // Show wave text for the next wave
            frameCount = 0;
            // console.log(enemies);
            console.log(currentLevel);
            console.log(currentWaveIndex);
        }
    }

    // assign bullet to random enemy
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

    // enemy shoot bullet
    enemyBullets.forEach((b) => {
        b.shoot();
    });

    // gameOver
    if (spaceShip.life <= 0) {
        gameOver();
        gunshotAudio.pause();
        gunshotAudio.currentTime = 0;
        background.pause();
        stopBulletInterval();
        gameOverFlag = true;
        return;
    }

    // enemy bullet collison with player space ship
    enemyBullets.forEach((bullet, i) => {
        if (isCollide(bullet, spaceShip)) {
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
        drawFrames();
        startBulletInterval();
        background.play();
    } else {
        drawPauseText();
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

video.play();

// Function to handle touch move events
function handleTouchMove(event: TouchEvent) {
    event.preventDefault();
    const touch = event.touches[0];

    // Get the touch coordinates relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    // Update spaceship position
    spaceShip.playerMovement(false, false, false, false, touchX - spaceShip.width / 2, touchY - spaceShip.height / 2);
}

// Add event listeners for touch events
canvas.addEventListener("touchstart", handleTouchMove, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

// Prevent default scrolling on the canvas
canvas.addEventListener(
    "touchstart",
    function (event) {
        event.preventDefault();
    },
    false
);

canvas.addEventListener(
    "touchmove",
    function (event) {
        event.preventDefault();
    },
    false
);
