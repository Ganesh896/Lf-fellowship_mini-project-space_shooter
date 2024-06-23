import Enemy from "./characters/enemy";
import SpaceShip from "./characters/player";
import Power from "./components/powerup";
import { spaceShipImages } from "./constants/constants";
import { nextButton, prevButton, spaceShipImageElement } from "./html/html-elements";
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

//selecting spaceship
export let initialIndex = 0;

nextButton?.addEventListener("click", function () {
    initialIndex++;
    initialIndex = initialIndex > 1 ? 0 : initialIndex;
    spaceShipImageElement.src = spaceShipImages[initialIndex][0];
});

prevButton?.addEventListener("click", function () {
    initialIndex--;
    initialIndex = initialIndex < 0 ? 1 : initialIndex;
    spaceShipImageElement.src = spaceShipImages[initialIndex][0];
});
