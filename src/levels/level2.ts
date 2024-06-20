import { IEnemyConfig, POWER__TYPE } from "../types";
import Enemy from "../characters/enemy";
import generateRandomNumber from "../utils/random";

export const level2Config: IEnemyConfig = {
    enemyRows: 5,
    enemyCols: 7,
    enemyLife: 3,
    enemyType: "fast",
    enemyImage: "/images/enemies/enemy2.png",
    generateEnemies: () => {
        const enemies: Enemy[] = [];
        const startX = generateRandomNumber(0, 800 - 7 * 50);
        const startY = generateRandomNumber(-400, 0);
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 7; col++) {
                const xPos = startX + col * 60;
                const yPos = startY + row * 60;
                const enemy = new Enemy("/images/enemies/enemy2.png", xPos, yPos, 50, 50, 3);
                enemies.push(enemy);
            }
        }

        for (let i = 0; i < 2; i++) {
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
    },
};
