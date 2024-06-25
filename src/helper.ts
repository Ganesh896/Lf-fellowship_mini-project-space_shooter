import Enemy from "./characters/enemy";
import SpaceShip from "./characters/player";
import Power from "./components/powerup";
import { spaceShipImages } from "./constants/constants";
import { nextButton, prevButton, spaceShipImageElement, topScorerList } from "./html/html-elements";
import { Scorer } from "./types";
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

export function isCollideWithEnemy(spaceShip: Character, enemy: Character) {
    const isColliding =
        spaceShip.xpose + spaceShip.width > enemy.xpose &&
        spaceShip.xpose < enemy.xpose + enemy.width &&
        spaceShip.ypose + spaceShip.height >= enemy.ypose &&
        spaceShip.ypose + spaceShip.height <= enemy.ypose + enemy.height;

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

// export const topScorer = [
//     {
//         name: "Ganesh",
//         score: 134,
//     },
//     {
//         name: "Himal",
//         score: 200,
//     },
//     {
//         name: "Harry",
//         score: 56,
//     },
// ];

export function showTopScorer() {
    const topScorer: Scorer[] = JSON.parse(localStorage.getItem("topScorer") || "[]");
    topScorer.sort((a, b) => b.score - a.score);

    if (topScorer.length > 10) {
        topScorer.pop();
    }

    topScorerList.innerHTML = "";
    for (let i = 0; i < topScorer.length; i++) {
        const scorer = `<li>${i + 1}. ${topScorer[i].name} - ${topScorer[i].score}</li>`;
        topScorerList?.insertAdjacentHTML("beforeend", scorer);
    }
    console.log(topScorer);
}

export function getPlayerName() {
    const playerNameInput = document.getElementById("player__name") as HTMLInputElement;
    return playerNameInput.value;
}
