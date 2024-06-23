import { ctx, canvas } from "../html/html-elements";
import { currentScore, highScore } from "../main";

// gameOver texts after game over
export function gameOver() {
    ctx.font = "60px Orbitron";
    ctx.fillStyle = "red";
    const gameOverText = "Game Over",
        gameOverTextWidth = ctx.measureText(gameOverText).width;

    ctx.fillText(gameOverText, canvas.width / 2 - gameOverTextWidth / 2, canvas.height / 2);

    ctx.font = "30px Orbitron";
    ctx.fillStyle = "green";
    const scoreText = `Score: ${currentScore}`,
        scoreTextWidth = ctx.measureText(scoreText).width;

    ctx.fillText(scoreText, canvas.width / 2 - scoreTextWidth / 2, canvas.height / 2 + 40);

    ctx.font = "30px Orbitron";
    ctx.fillStyle = "green";

    const highScoreText = `Highscore: ${highScore}`,
        highScoreTextWidth = ctx.measureText(highScoreText).width;

    ctx.fillText(highScoreText, canvas.width / 2 - highScoreTextWidth / 2, canvas.height / 2 + 80);

    // ctx.font = "20px Orbitron";
    // ctx.fillStyle = "#000";
    // ctx.fillText(`Press Enter to Restart the game`, 110, canvas.height / 2 + 120);
}

export function drawCurrentScore() {
    ctx.font = "40px Orbitron";
    ctx.fillStyle = "red";
    ctx.fillText(`Score: ${currentScore}`, 20, 90);
}

export function drawPauseText() {
    ctx.fillStyle = "white";
    ctx.font = "60px Orbitron";

    var textString = "Pause",
        textWidth = ctx.measureText(textString).width;

    ctx.fillText(textString, canvas.width / 2 - textWidth / 2, canvas.height / 2);
}

// Draw game over text
export function drawGameOver() {
    ctx.font = "80px Orbitron";
    ctx.fillStyle = "red";
    var textString = "Game Over",
        textWidth = ctx.measureText(textString).width;

    ctx.fillText(textString, canvas.width / 2 - textWidth / 2, canvas.height / 2);
}

export function drawLevels(textString: string) {
    ctx.font = "40px Orbitron";
    ctx.fillStyle = "red";
    ctx.fillText(textString, 20, 90);
}
