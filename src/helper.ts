import Enemy from "./characters/enemy";
import SpaceShip from "./characters/player";
import Power from "./components/powerup";
import Bullet from "./weapons/bullet";
import EnemyBullet from "./weapons/enemy-bullet";

type Weapon = EnemyBullet | Bullet | Power;
type Character = SpaceShip | Enemy;

export function isCollide(bullet: Weapon, enemy: Character) {
    const isColliding =
        bullet.xpose + bullet.width > enemy.xpose &&
        bullet.xpose < enemy.xpose + enemy.width &&
        bullet.ypose + bullet.height >= enemy.ypose &&
        bullet.ypose + bullet.height <= enemy.ypose + enemy.height;

    return isColliding;
}
