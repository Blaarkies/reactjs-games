export function drawSnake(ctx, snake, pattern, textureHead) {
    ctx.strokeStyle = pattern;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(...snake.head);
    snake.tail.forEach(t => ctx.lineTo(...t));
    ctx.stroke();

    const angle = -Math.PI * 0.5 - 0.05 + snake.direction;
    const headSize = [25, 40];
    ctx.save();
    ctx.translate(...snake.head);
    ctx.rotate(angle);
    ctx.translate(-headSize[0] * 0.5, -headSize[1] * 0.5);
    ctx.drawImage(textureHead, 0, 0, 71, 112, 0, 0, ...headSize);
    ctx.restore();
}

export function clearScreen(ctx, canvas) {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawApples(ctx, apples, texture) {
    apples.filter(a => !a.isEaten)
        .forEach(a => {
            const angle = a.direction;
            const size = [25, 25];
            ctx.save();
            ctx.translate(...a.location);
            ctx.rotate(angle);
            ctx.translate(-size[0] * 0.5, -size[1] * 0.5);
            ctx.drawImage(texture, 0, 0, 52, 60, 0, 0, ...size);
            ctx.restore();
        });
}

export function drawBuildings(ctx, buildings, pattern) {
    ctx.fillStyle = pattern;
    buildings.forEach(b => ctx.fillRect(b[0], b[1], b[2] - b[0], b[3] - b[1]));
}
