import SpaceShip from "./characters/player";
import { DIMENSIONS, bulletImages, spaceShipImages } from "./constants/constants";
import { SHIP__WIDTH, SHIP__HEIGHT } from "./constants/constants";
import { canvas, ctx, restartButton, startButton, startWindow, video } from "./html/html-elements";
import { playerMovement } from "./components/player-movement";
import { getPlayerName, initialIndex, isCollide, isCollideWithEnemy, showTopScorer } from "./helper";
import Particle from "./characters/explosion";
import generateRandomNumber from "./utils/random";
import EnemyBullet from "./weapons/enemy-bullet";
import { drawCurrentScore, drawLevels, drawPauseText, gameOver } from "./components/texts";
import { LevelManager } from "./levels/levelManager";
import Enemy from "./characters/enemy";
import { addBullet, addFourBullet, addRocket, addThreeBullet, addTwoBullet, bullets } from "./components/bullet-types";
import Power from "./components/powerup";

// Initialize game variables
let gameInitialized = false;
let animationFrameId: number;
let gameOverFlag = false;
let isPaused = false;
let bulletInterval: any;

// Canvas dimensions
canvas.width = DIMENSIONS.CANVAS__WIDHT;
canvas.height = DIMENSIONS.CANVAS__HEIGHT;

// Score
export let currentScore = 0;
export let highScore = Number(localStorage.getItem("highscore") || 0);

let bulletPowerCount = 0;
let rocketPowerCount = 0;

// Initialize game
let spaceShip: SpaceShip;
let bulletImg: string;
let explosionImages: string[];

function initializeGameObjects() {
    const spaceshipImages = spaceShipImages[initialIndex];
    explosionImages = Array.from({ length: 17 }, (_, i) => `/images/spaceship/blueship/explosion/explosion${i}.png`);
    bulletImg = bulletImages[initialIndex];
    spaceShip = new SpaceShip(spaceshipImages, explosionImages, DIMENSIONS.CANVAS__WIDHT / 2 - SHIP__WIDTH / 2, DIMENSIONS.CANVAS__HEIGHT - 110, SHIP__WIDTH, SHIP__HEIGHT, 5);
}

// gunshoot audio
const gunshotAudio = new Audio("/audio/gun-shoot.wav");
gunshotAudio.volume = 0.3;

// Enemy and level management
const levelManager = new LevelManager();
let currentLevel = levelManager.getCurrentLevel();
let currentWaveIndex = 0;
let enemies: Enemy[] = [];
const particles: Particle[] = [];
const powers: Power[] = [];
export const enemyBullets: EnemyBullet[] = [];

// Background music
const background = new Audio();
background.src = "/audio/background.mp3";
background.loop = true;
background.volume = 0.2;
background.currentTime = 0;

// Display text variables
let showText = true;
let textDisplayTime = 100;

// Game control functions
function startBulletInterval() {
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
}

function stopBulletInterval() {
    clearInterval(bulletInterval);
}

let frameCount = 0;

// Restart game function
function restartGame() {
    cancelAnimationFrame(animationFrameId);
    stopBulletInterval();
    background.pause();

    // Reset game variables
    gameOverFlag = false;
    isPaused = false;
    currentScore = 0;
    bulletPowerCount = 0;
    rocketPowerCount = 0;
    frameCount = 0;
    particles.length = 0;
    powers.length = 0;
    bullets.length = 0;
    enemyBullets.length = 0;
    spaceShip.life = 5;
    background.currentTime = 0;
    showText = true;

    // Reset levels and enemies
    const levelManager = new LevelManager();
    levelManager.reset();
    currentLevel = levelManager.getCurrentLevel();
    enemies = currentLevel.generateEnemies(); // Generate enemies from the first wave

    // Hide the restart button
    restartButton.style.display = "none";

    // Reinitialize game objects and start game loop
    initializeGameObjects();
    startBulletInterval();
    drawFrames();
}

// animation function
function drawFrames() {
    frameCount++;

    if (gameOverFlag) {
        return;
    }

    if (isPaused) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (background.paused) {
        background.play();
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // particle explosion on killing enemy
    particles.forEach((particle, index) => {
        if (particle.opacity <= 0) {
            particles.splice(index, 1);
        } else {
            particle.updatePosition();
        }
    });

    // spaceShip Movement and tilting effect
    ctx.save();
    spaceShip.playerMovement(playerMovement.moveRight, playerMovement.moveLeft, playerMovement.moveUp, playerMovement.moveDown);
    ctx.restore();

    // player bullets
    bullets.forEach((b, index) => {
        b.updatePosition();
        if (b.ypose < 0) {
            bullets.splice(index, 1);
        }
    });

    // level and wave text
    if (showText) {
        let textString = `Level ${levelManager.currentLevelIndex + 1} - Wave ${currentLevel.currentWave + 1}/${currentLevel.waves.length + 1}`;
        if (currentLevel.currentWave >= 3) {
            textString = `Warning Boss`;
        }
        drawLevels(textString);
        if (frameCount > textDisplayTime) {
            showText = false;
            frameCount = 0;
        }
    }

    // powers
    powers.forEach((power) => {
        power.updatePosition();
    });

    // power collide with player
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

    // bullets and enemy collision
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

    // removing enemies if life is over
    for (let j = 0; j < enemies.length; j++) {
        if (enemies[j].life <= 0) {
            enemies.splice(j, 1);
            currentScore += 1;
        }
    }

    // showing enemies
    enemies.forEach((enemy) => {
        if (isCollideWithEnemy(spaceShip, enemy)) {
            if (spaceShip.life > 0) {
                spaceShip.life--;
            }
        }
        enemy.updatePosition(frameCount);
        enemy.draw();
    });

    // redrawing enemies after killing one set of enemies
    if (enemies.length === 0) {
        showText = true;
        if (currentLevel.isBossLevel()) {
            levelManager.goToNextLevel();
            currentLevel = levelManager.getCurrentLevel();
            currentWaveIndex = 0;
            enemies = currentLevel.generateEnemies();
            frameCount = 0;
        } else {
            currentLevel.goToNextWave();
            currentWaveIndex++;
            enemies = currentLevel.generateEnemies();
            frameCount = 0;
        }
    }

    // enemy bullets
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

    // if player life is over
    if (spaceShip.life <= 0) {
        const oldList = JSON.parse(localStorage.getItem("topScorer") || "[]");
        const playerName = getPlayerName();
        oldList.push({ name: playerName, score: currentScore });
        localStorage.setItem("topScorer", JSON.stringify(oldList));
        if (currentScore > highScore) {
            highScore = currentScore;
            localStorage.setItem("highscore", "" + highScore);
        }
        gunshotAudio.pause();
        gunshotAudio.currentTime = 0;
        background.pause();
        stopBulletInterval();
        gameOverFlag = true;
        restartButton.style.display = "block";
        gameOver();

        return;
    }

    // enemy bullets and player ship collision
    enemyBullets.forEach((bullet, i) => {
        if (isCollide(bullet, spaceShip)) {
            if (spaceShip.life > 0) {
                spaceShip.life--;
            }
            enemyBullets.splice(i, 1);
        }
    });

    showTopScorer();

    drawCurrentScore();

    animationFrameId = requestAnimationFrame(drawFrames);
}

// pause/play
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

// Event listeners for play/pause
window.addEventListener("keypress", function (e) {
    if (e.key === " " && gameInitialized) {
        togglePause();
    }
});

// Event listener for the start button to start the game
startButton!.addEventListener("click", () => {
    const playerName = getPlayerName();
    if (playerName.length > 0) {
        canvas!.style.display = "block";
        startWindow!.style.display = "none";
        video.style.display = "block";

        if (!gameInitialized) {
            initializeGameObjects();
            enemies = currentLevel.generateEnemies();
            startBulletInterval();
            drawFrames();
            gameInitialized = true;
        } else {
            togglePause();
        }
    } else {
        alert("Player name should not be empty");
    }
});

// Restart the game
restartButton!.addEventListener("click", () => {
    restartGame();
});

video.addEventListener("canplay", () => {
    if (!gameInitialized) {
        background.play();
    }
});

// Touch event listeners for the spaceship
let isDragging = false;
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);
canvas.addEventListener("touchend", handleTouchEnd);

function handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    touchStartX = touch.clientX - rect.left;
    touchStartY = touch.clientY - rect.top;

    // Check if the touch is within the spaceship's area
    if (touchStartX > spaceShip.xpose && touchStartX < spaceShip.xpose + spaceShip.width && touchStartY > spaceShip.ypose && touchStartY < spaceShip.ypose + spaceShip.height) {
        isDragging = true;
    }
}

function handleTouchMove(event: TouchEvent) {
    if (isDragging) {
        const touch = event.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;

        // Update spaceship position based on touch movement
        spaceShip.xpose = touchX - spaceShip.width / 2;
        spaceShip.ypose = touchY - spaceShip.height / 2;

        // Ensure the spaceship stays within the canvas boundaries
        if (spaceShip.xpose < 0) spaceShip.xpose = 0;
        if (spaceShip.xpose + spaceShip.width > canvas.width) spaceShip.xpose = canvas.width - spaceShip.width;
        if (spaceShip.ypose < 0) spaceShip.ypose = 0;
        if (spaceShip.ypose + spaceShip.height > canvas.height) spaceShip.ypose = canvas.height - spaceShip.height;
    }
}

function handleTouchEnd() {
    isDragging = false;
}
