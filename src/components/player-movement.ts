interface PlayerMovement {
    moveUp: boolean;
    moveDown: boolean;
    moveRight: boolean;
    moveLeft: boolean;
}

// Declare and export the playerMovement object with the specified type
export const playerMovement: PlayerMovement = {
    moveUp: false,
    moveDown: false,
    moveRight: false,
    moveLeft: false,
};

// Function to update player movement
const updatePlayerMovement = (e: KeyboardEvent, isKeyDown: boolean) => {
    const key = e.key;
    const movementMap: { [key: string]: keyof PlayerMovement } = {
        ArrowLeft: "moveLeft",
        ArrowRight: "moveRight",
        ArrowUp: "moveUp",
        ArrowDown: "moveDown",
    };
    if (movementMap[key] !== undefined) {
        playerMovement[movementMap[key]] = isKeyDown;
    }
};

window.addEventListener("keyup", (e: KeyboardEvent) => updatePlayerMovement(e, false));
window.addEventListener("keydown", (e: KeyboardEvent) => updatePlayerMovement(e, true));
