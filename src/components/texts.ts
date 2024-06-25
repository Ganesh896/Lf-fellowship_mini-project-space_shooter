import { ctx, canvas } from "../html/html-elements";
import { currentScore, highScore } from "../main";

// gameOver texts after game over
export function gameOver() {
    ctx.font = "60px Pixelify Sans";
    ctx.fillStyle = "red";
    const gameOverText = "Game Over",
        gameOverTextWidth = ctx.measureText(gameOverText).width;

    ctx.fillText(gameOverText, canvas.width / 2 - gameOverTextWidth / 2, canvas.height / 2);

    ctx.font = "30px Pixelify Sans";
    ctx.fillStyle = "green";
    const scoreText = `Score: ${currentScore}`,
        scoreTextWidth = ctx.measureText(scoreText).width;

    ctx.fillText(scoreText, canvas.width / 2 - scoreTextWidth / 2, canvas.height / 2 + 40);

    ctx.font = "30px Pixelify Sans";
    ctx.fillStyle = "green";

    const highScoreText = `Highscore: ${highScore}`,
        highScoreTextWidth = ctx.measureText(highScoreText).width;

    ctx.fillText(highScoreText, canvas.width / 2 - highScoreTextWidth / 2, canvas.height / 2 + 80);
}

export function drawCurrentScore() {
    ctx.font = "40px Pixelify Sans";
    ctx.fillStyle = "green";
    ctx.fillText(`Score: ${currentScore}`, 20, 90);
}

export function drawPauseText() {
    ctx.fillStyle = "white";
    ctx.font = "60px Pixelify Sans";

    var textString = "Pause",
        textWidth = ctx.measureText(textString).width;

    ctx.fillText(textString, canvas.width / 2 - textWidth / 2, canvas.height / 2);
}

// Draw game over text
export function drawGameOver() {
    ctx.font = "80px Pixelify Sans";
    ctx.fillStyle = "red";
    var textString = "Game Over",
        textWidth = ctx.measureText(textString).width;

    ctx.fillText(textString, canvas.width / 2 - textWidth / 2, canvas.height / 2);
}

export function drawLevels(textString: string) {
    ctx.font = "40px Pixelify Sans";
    const textWidth = ctx.measureText(textString).width;
    ctx.fillStyle = "red";
    ctx.fillText(textString, canvas.width / 2 - textWidth / 2, canvas.height / 2);
}
