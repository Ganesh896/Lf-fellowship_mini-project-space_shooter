import { level1Config } from "./level1";
import { level2Config } from "./level2";
import { level3Config } from "./level3";
import { IEnemyConfig } from "../types";

export class LevelManager {
    private levels: IEnemyConfig[];
    private currentLevelIndex: number;

    constructor() {
        this.levels = [level1Config, level2Config, level3Config];
        this.currentLevelIndex = 0;
    }

    getCurrentLevel() {
        return this.levels[this.currentLevelIndex];
    }

    goToNextLevel() {
        if (this.currentLevelIndex < this.levels.length - 1) {
            this.currentLevelIndex++;
        } else {
            console.log("No more levels. Game Over!");
        }
    }

    reset() {
        this.currentLevelIndex = 0;
    }
}
