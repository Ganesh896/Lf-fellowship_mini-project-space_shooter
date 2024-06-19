import Enemy from "../characters/enemy";
import { DIMENSIONS, ENEMY__HEIGHT, ENEMY__WIDTH, GRID__ROWS, GRID__COLS, GRID__GAP } from "../constants/constants";
import generateRandomNumber from "../utils/random";

const enemies: Enemy[] = [];

export function enemyGrid() {
    const startX = generateRandomNumber(0, DIMENSIONS.CANVAS__WIDHT - GRID__COLS * (ENEMY__WIDTH + GRID__GAP));
    const startY = generateRandomNumber(-(GRID__ROWS * ENEMY__HEIGHT + (GRID__COLS - 1) * GRID__GAP), 0); // Starting Y position
    for (let row = 0; row < GRID__ROWS; row++) {
        for (let col = 0; col < GRID__COLS; col++) {
            const xPos = startX + col * (ENEMY__WIDTH + GRID__GAP);
            const yPos = startY + row * (ENEMY__HEIGHT + GRID__GAP);
            const enemy = new Enemy("/images/enemies/enemy6.gif", xPos, yPos, ENEMY__WIDTH, ENEMY__HEIGHT, 2);
            enemies.push(enemy);
        }
    }

    return enemies;
}
