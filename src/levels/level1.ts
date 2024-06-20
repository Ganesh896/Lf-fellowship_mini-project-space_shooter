import { IEnemyConfig } from "../types";
import Enemy from "../characters/enemy";
import generateRandomNumber from "../utils/random";
import { DIMENSIONS } from "../constants/constants";

export const level1Config: IEnemyConfig = {
    enemyRows: 3,
    enemyCols: 5,
    enemyLife: 2,
    enemyType: "basic",
    enemyImage: "/images/enemies/enemy1.png",
    generateEnemies: () => {
        const enemies: Enemy[] = [];
        const startX = generateRandomNumber(0, DIMENSIONS.CANVAS__WIDHT);
        const startY = generateRandomNumber(-300, 0);
        for (let row = 0; row < level1Config.enemyRows; row++) {
            for (let col = 0; col < level1Config.enemyCols; col++) {
                const xPos = startX + col * 60;
                const yPos = startY + row * 60;
                const enemy = new Enemy("/images/enemies/enemy1.png", xPos, yPos, 50, 50, level1Config.enemyLife);
                enemies.push(enemy);
            }
        }

        const randIndex = generateRandomNumber(0, enemies.length - 1);
        enemies[randIndex].isPower = true;

        console.log(randIndex);
        console.log(enemies[randIndex]);

        return enemies;
    },
};
