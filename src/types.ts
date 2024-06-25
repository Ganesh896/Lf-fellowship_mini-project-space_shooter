import Enemy from "./characters/enemy";

export interface IEnemyConfig {
    enemyRows: number;
    enemyCols: number;
    enemyLife: number;
    enemyType: string;
    enemyImage: string;
    generateEnemies: () => Enemy[];
}

export enum POWER__TYPE {
    ADDBULLET = "addBullet",
    ADDROCKET = "addRocket",
    ADDHEALTH = "addHealth",
}

export interface Scorer {
    name: string;
    score: number;
}
