import Enemy from "./characters/enemy";

export interface IEnemyConfig {
    enemyRows: number;
    enemyCols: number;
    enemyLife: number;
    enemyType: string;
    enemyImage: string;
    generateEnemies: () => Enemy[];
}
