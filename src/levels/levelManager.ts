// levels/levelManager.ts
import { Level } from "./level";
import { waveGenerator } from "../components/wave";
import Enemy from "../characters/enemy";

export class LevelManager {
    levels: Level[];
    currentLevelIndex: number;

    constructor() {
        this.levels = [];
        this.currentLevelIndex = 0;
        this.initLevels();
    }

    initLevels() {
        // Initialize your levels here
        const level1Waves = [
            waveGenerator("/images/enemies/enemy1.png", 3, 4, 2, 2, ["linear", "sine"]),
            waveGenerator("/images/enemies/enemy2.png", 4, 3, 4, 2, ["zigzag", "circular"]),
            waveGenerator("/images/enemies/enemy3.png", 5, 5, 6, 1, ["linear", "circular"]),
        ];
        const level1Boss = new Enemy("/images/enemies/boss1.png", 200, -100, 150, 150, 40, "linear");
        const level1 = new Level(level1Waves, level1Boss);

        const level2Waves = [
            waveGenerator("/images/enemies/enemy4.gif", 3, 5, 3, 3, ["linear", "zigzag"]),
            waveGenerator("/images/enemies/enemy5.gif", 4, 4, 5, 1, ["sine", "circular"]),
            waveGenerator("/images/enemies/enemy6.gif", 5, 3, 8, 2, ["linear", "sine"]),
        ];
        const level2Boss = new Enemy("/images/enemies/enemy4.gif", 250, -100, 180, 180, 60, "circular");
        const level2 = new Level(level2Waves, level2Boss);

        this.levels.push(level1, level2);
    }

    getCurrentLevel(): Level {
        return this.levels[this.currentLevelIndex];
    }

    goToNextLevel() {
        if (this.currentLevelIndex < this.levels.length - 1) {
            this.currentLevelIndex++;
        }
    }

    isLastLevel(): boolean {
        return this.currentLevelIndex >= this.levels.length - 1;
    }

    reset() {
        this.currentLevelIndex = 0;
        this.levels.forEach((level) => level.reset()); // Reset each level
    }
}
