import SpaceShip from "../characters/player";
import { SHIP__WIDTH, BULLET__WIDTH, BULLET__HEIGHT } from "../constants/constants";
import Bullet from "../weapons/bullet";

export const bullets: Bullet[] = [];
export const addBullet = function (spaceShip: SpaceShip, gunshotAudio: any, bulletImg: string) {
    const bullet = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 25, spaceShip.ypose - 30, BULLET__WIDTH, BULLET__HEIGHT);
    bullets.push(bullet);
    gunshotAudio.play();
};

export const addTwoBullet = function (spaceShip: SpaceShip, gunshotAudio: any, bulletImg: string) {
    const bullet1 = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 15, spaceShip.ypose - 30, BULLET__WIDTH, BULLET__HEIGHT);
    const bullet2 = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 30, spaceShip.ypose - 30, BULLET__WIDTH, BULLET__HEIGHT);

    bullets.push(bullet1);
    bullets.push(bullet2);
    gunshotAudio.play();
};

export const addThreeBullet = function (spaceShip: SpaceShip, gunshotAudio: any, bulletImg: string) {
    const bullet1 = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 25, spaceShip.ypose - 30, BULLET__WIDTH, BULLET__HEIGHT, 0.6, "topLeft");
    const bullet2 = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 25, spaceShip.ypose - 30, BULLET__WIDTH, BULLET__HEIGHT);
    const bullet3 = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 25, spaceShip.ypose - 30, BULLET__WIDTH, BULLET__HEIGHT, 0.6, "topRight");

    bullets.push(bullet1);
    bullets.push(bullet2);
    bullets.push(bullet3);
    gunshotAudio.play();
};

export const addFourBullet = function (spaceShip: SpaceShip, gunshotAudio: any, bulletImg: string) {
    const bullet1 = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 25, spaceShip.ypose - 25, BULLET__WIDTH, BULLET__HEIGHT, 0.3, "topLeft");
    const bullet2 = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 25, spaceShip.ypose - 25, BULLET__WIDTH, BULLET__HEIGHT, 1, "topLeft");
    const bullet3 = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 25, spaceShip.ypose - 25, BULLET__WIDTH, BULLET__HEIGHT, 0.3, "topRight");
    const bullet4 = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 25, spaceShip.ypose - 25, BULLET__WIDTH, BULLET__HEIGHT, 1, "topRight");
    bullets.push(bullet1);
    bullets.push(bullet2);
    bullets.push(bullet3);
    bullets.push(bullet4);
    gunshotAudio.play();
};

export const addRocket = function (spaceShip: SpaceShip, gunshotAudio: any, bulletImg: string) {
    const bullet = new Bullet(bulletImg, spaceShip.xpose + SHIP__WIDTH / 2 - 25, spaceShip.ypose - 30, BULLET__WIDTH, BULLET__HEIGHT);
    bullets.push(bullet);
    gunshotAudio.play();
};
