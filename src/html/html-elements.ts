export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const video = document.getElementById("galaxy") as HTMLVideoElement;
export const ctx = canvas.getContext("2d")!;

export const startWindow = document.querySelector(".start__window") as HTMLDivElement;
export const startButton = document.querySelector(".start__button") as HTMLDivElement;

export const restartButton = document.querySelector(".restart__button") as HTMLButtonElement;

export const nextButton = document.getElementById("next__ship") as HTMLButtonElement;
export const prevButton = document.getElementById("previous__ship") as HTMLButtonElement;
export const spaceShipImageElement = document.getElementById("spaceship") as HTMLImageElement;

export const topScorerList = document.querySelector(".topscorer") as HTMLUListElement;

