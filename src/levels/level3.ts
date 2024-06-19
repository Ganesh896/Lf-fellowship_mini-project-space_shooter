import { IEnemyConfig } from "../types";
import Enemy from "../characters/enemy";
import generateRandomNumber from "../utils/random";

export const level3Config: IEnemyConfig = {
    enemyRows: 4,
    enemyCols: 6,
    enemyLife: 3,
    enemyType: "mixed",
    enemyImage: "/images/enemies/enemy3.png",
    generateEnemies: () => {
        const enemies: Enemy[] = [];
        const startX = generateRandomNumber(0, 800 - 6 * 50);
        const startY = generateRandomNumber(-400, 0);
        const movementTypes = ["linear", "sine", "circular", "zigzag"];

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 6; col++) {
                const xPos = startX + col * 60;
                const yPos = startY + row * 60;
                const movementType = movementTypes[generateRandomNumber(0, movementTypes.length - 1)];
                const enemy = new Enemy("/images/enemies/enemy3.png", xPos, yPos, 50, 50, 3, movementType);
                enemies.push(enemy);
            }
        }
        return enemies;
    },
};
