import generateRandomNumber from "../utils/random";
import { DIMENSIONS } from "../constants/constants";
import { POWER__TYPE } from "../types";
import Enemy from "../characters/enemy";

export function waveGenerator(image: string, rows: number, cols: number, life: number, powers: number, movementTypes: string[]) {
    const enemies: Enemy[] = [];
    const startX = generateRandomNumber(0, DIMENSIONS.CANVAS__WIDHT - 60 * cols);
    const startY = generateRandomNumber(0, 1);
    const movementType = movementTypes[generateRandomNumber(0, movementTypes.length - 1)];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const xPos = Math.min(startX + col * 60, DIMENSIONS.CANVAS__WIDHT - 50);
            const yPos = Math.min(startY + row * 60, DIMENSIONS.CANVAS__HEIGHT - 50);
            const enemy = new Enemy(image, xPos, yPos, 50, 50, life, movementType);
            enemies.push(enemy);
        }
    }

    for (let i = 0; i < powers; i++) {
        const randEnum = generateRandomNumber(0, 2);
        let power = POWER__TYPE.ADDBULLET;
        if (randEnum === 1) {
            power = POWER__TYPE.ADDHEALTH;
        } else if (randEnum === 2) {
            power = POWER__TYPE.ADDROCKET;
        }
        const randIndex = generateRandomNumber(0, enemies.length - 1);
        enemies[randIndex].isPower = true;
        enemies[randIndex].powerType = power;
    }
    return enemies;
}
