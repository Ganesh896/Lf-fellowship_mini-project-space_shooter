import Enemy from "./characters/enemy";
import Bullet from "./weapons/bullet";

export function detectCollision(bullet: Bullet, enemy: Enemy) {
    const isColliding =
        bullet.xpose + bullet.width > enemy.xpose &&
        bullet.xpose < enemy.xpose + enemy.width &&
        bullet.ypose + bullet.height >= enemy.ypose &&
        bullet.ypose + bullet.height <= enemy.ypose + enemy.height;

    return isColliding;

    // return enemy.ypose + enemy.height >= bullet.ypose;
}
