export function setupCanvas(canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    return ctx;
}

export function getCanvasCoordinates(event, canvas) {
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}

export function drawLine(ctx, start, end, style, tool = "brush") {
    ctx.save();

    ctx.globalCompositeOperation =
        tool === "eraser" ? "destination-out" : "source-over";

    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.restore();
}

export function drawCursors(ctx, cursors) {
    ctx.save();
    ctx.font = "12px Arial";

    Object.values(cursors).forEach(user => {
        ctx.beginPath();
        ctx.fillStyle = user.color;
        ctx.arc(user.x, user.y, 5, 0, Math.PI * 2);
        ctx.fill();

        const padding = 4;
        const textWidth = ctx.measureText(user.name).width;

        ctx.fillStyle = user.color;
        ctx.fillRect(
            user.x - textWidth / 2 - padding,
            user.y - 22,
            textWidth + padding * 2,
            16
        );

        ctx.fillStyle = "white";
        ctx.fillText(user.name, user.x - textWidth / 2, user.y - 10);
    });

    ctx.restore();
}