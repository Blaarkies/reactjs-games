export function drawSnake(ctx, snake, gradient, headTexture) {
    ctx.strokeStyle = gradient;
    ctx.lineCap = "round";
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(...snake.head);
    snake.tail.forEach(t => ctx.lineTo(...t));
    ctx.stroke();

    const angle = -Math.PI * 0.5 + snake.direction;
    const headSize = [30, 45];
    ctx.save();
    ctx.translate(...snake.head);
    ctx.rotate(angle);
    ctx.translate(-headSize[0] * 0.5, -headSize[1] * 0.5);
    ctx.drawImage(headTexture, 0, 0, 140, 212, 0, 0, ...headSize);
    ctx.restore();
}

export function clearScreen(ctx, canvas) {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawApples(ctx, apples) {
    ctx.strokeStyle = '#911';
    ctx.lineWidth = 8;

    apples.filter(a => !a.isEaten)
        .forEach(a => {
            ctx.beginPath();
            ctx.arc(...a.location, 6, 0, 2 * Math.PI);
            ctx.stroke();
        });
}

export function drawBuildings(ctx, buildings) {
    ctx.fillStyle = '#ABC';

    buildings.forEach(b => {
        ctx.fillRect(b[0], b[1], b[2] - b[0], b[3] - b[1]);
    });
}
