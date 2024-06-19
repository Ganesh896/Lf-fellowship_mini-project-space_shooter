import { ctx, canvas } from "../html/html-elements";
import { currentScore, highScore } from "../main";

// gameOver texts after game over
export function gameOver() {
    ctx.font = "60px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(`Game Over`, canvas.width / 2 - 100, canvas.height / 2);

    ctx.font = "30px Arial";
    ctx.fillStyle = "green";
    ctx.fillText(`Score: ${currentScore}`, canvas.width / 2, canvas.height / 2 + 40);

    ctx.font = "30px Arial";
    ctx.fillStyle = "green";
    ctx.fillText(`Highscore: ${highScore}`, canvas.width / 2 - 30, canvas.height / 2 + 80);
    2;
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(`Press Enter to Restart the game`, 110, canvas.height / 2 + 120);
}

export function drawCurrentScore() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(`Score: ${currentScore}`, 20, 90);
}

export function drawPauseText(text: string) {
    ctx.fillStyle = "white";
    ctx.font = "60px sans-serif";

    var textString = text,
        textWidth = ctx.measureText(textString).width;

    ctx.fillText(textString, canvas.width / 2 - textWidth / 2, canvas.height / 2);
}
