// levels/level.ts
import Enemy from "../characters/enemy";

export class Level {
    waves: Enemy[][];
    currentWave: number;
    boss: Enemy;

    constructor(waves: Enemy[][], boss: Enemy) {
        this.waves = waves;
        this.currentWave = 0;
        this.boss = boss;
    }

    generateEnemies(): Enemy[] {
        if (this.currentWave < this.waves.length) {
            return this.waves[this.currentWave];
        } else {
            return [this.boss];
        }
    }

    goToNextWave() {
        if (this.currentWave < this.waves.length) {
            this.currentWave++;
        }
    }

    isBossLevel(): boolean {
        return this.currentWave >= this.waves.length;
    }
}
