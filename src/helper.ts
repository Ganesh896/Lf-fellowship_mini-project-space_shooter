import Enemy from "./characters/enemy";
import SpaceShip from "./characters/player";
import Bullet from "./weapons/bullet";
import EnemyBullet from "./weapons/enemy-bullet";

export function isEnemyCollide(bullet: Bullet, enemy: Enemy) {
    const isColliding =
        bullet.xpose + bullet.width > enemy.xpose &&
        bullet.xpose < enemy.xpose + enemy.width &&
        bullet.ypose + bullet.height >= enemy.ypose &&
        bullet.ypose + bullet.height <= enemy.ypose + enemy.height;

    return isColliding;
}

export function isShipCollide(bullet: EnemyBullet, spaceship: SpaceShip) {
    const isColliding =
        bullet.xpose + bullet.width > spaceship.xpose &&
        bullet.xpose < spaceship.xpose + spaceship.width &&
        bullet.ypose + bullet.height >= spaceship.ypose &&
        bullet.ypose + bullet.height <= spaceship.ypose + spaceship.height;

    return isColliding;
}
