import Enemy from "../characters/enemy";
import { DIMENSIONS, ENEMY__HEIGHT, ENEMY__WIDTH, GRID__GAP } from "../constants/constants";
import generateRandomNumber from "../utils/random";

const enemies: Enemy[] = [];

export function enemyGrid(gridRows: number, gridCols: number, enemyLife: number) {
    const startX = generateRandomNumber(0, DIMENSIONS.CANVAS__WIDHT - gridCols * (ENEMY__WIDTH + GRID__GAP));
    const startY = generateRandomNumber(-(gridRows * ENEMY__HEIGHT + (gridCols - 1) * GRID__GAP), 0); // Starting Y position
    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            const xPos = startX + col * (ENEMY__WIDTH + GRID__GAP);
            const yPos = startY + row * (ENEMY__HEIGHT + GRID__GAP);
            const enemy = new Enemy("/images/enemies/enemy6.gif", xPos, yPos, ENEMY__WIDTH, ENEMY__HEIGHT, enemyLife);
            enemies.push(enemy);
        }
    }

    return enemies;
}
