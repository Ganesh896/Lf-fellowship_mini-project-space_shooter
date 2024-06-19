import { IEnemyConfig } from "../types";
import Enemy from "../characters/enemy";
import generateRandomNumber from "../utils/random";

export const level1Config: IEnemyConfig = {
    enemyRows: 3,
    enemyCols: 5,
    enemyLife: 2,
    enemyType: "basic",
    enemyImage: "/images/enemies/enemy1.png",
    generateEnemies: () => {
        const enemies: Enemy[] = [];
        const startX = generateRandomNumber(0, 800 - 5 * 50);
        const startY = generateRandomNumber(-300, 0);
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 5; col++) {
                const xPos = startX + col * 60;
                const yPos = startY + row * 60;
                const enemy = new Enemy("/images/enemies/enemy1.png", xPos, yPos, 50, 50, 2);
                enemies.push(enemy);
            }
        }
        return enemies;
    },
};
