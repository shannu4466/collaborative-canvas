import { setupCanvas, getCanvasCoordinates, drawLine } from './canvas.js';
import { setupSocket } from './websocket.js';

const modal = document.getElementById('usernameModal');
const input = document.getElementById('usernameInput');
const joinBtn = document.getElementById('joinBtn');

const colorPicker = document.getElementById('colorPicker');
const widthSlider = document.getElementById('widthSlider');

let tool = "brush";

const brushBtn = document.getElementById('brushBtn');
const eraserBtn = document.getElementById('eraserBtn');

brushBtn.addEventListener('click', () => tool = "brush");
eraserBtn.addEventListener('click', () => tool = "eraser");

const drawCanvas = document.getElementById('drawCanvas');
const cursorCanvas = document.getElementById('cursorCanvas');

let drawCtx;
let cursorCtx;
let socket;

let isDrawing = false;
let lastPosition = null;
let currentStroke = [];

const style = {
    color: colorPicker.value,
    width: +widthSlider.value
};

joinBtn.addEventListener('click', () => {
    const username = input.value.trim();
    if (!username) return;

    modal.style.display = 'none';

    drawCanvas.style.display = 'block';
    cursorCanvas.style.display = 'block';

    drawCtx = setupCanvas(drawCanvas);
    cursorCtx = setupCanvas(cursorCanvas);

    socket = setupSocket(drawCtx, cursorCtx, username);

    drawCanvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        lastPosition = getCanvasCoordinates(e, drawCanvas);
        currentStroke = [];
    });

    drawCanvas.addEventListener('mousemove', (e) => {
        const pos = getCanvasCoordinates(e, drawCanvas);

        socket.emit('cursor_move', {
            x: pos.x,
            y: pos.y
        });

        if (!isDrawing) return;

        drawLine(drawCtx, lastPosition, pos, style);

        currentStroke.push({
            start: lastPosition,
            end: pos,
            style,
            tool
        });

        lastPosition = pos;
    });

    drawCanvas.addEventListener('mouseup', () => {
        if (!isDrawing) return;

        socket.emit('stroke_complete', {
            userId: socket.id,
            segments: currentStroke
        });

        isDrawing = false;
        lastPosition = null;
        currentStroke = [];
    });

    drawCanvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });

    document.getElementById('undoBtn').addEventListener('click', () => {
        socket.emit('undo');
    });

    document.getElementById('redoBtn').addEventListener('click', () => {
        socket.emit('redo');
    });

    colorPicker.addEventListener('input', () => {
        style.color = colorPicker.value;
    });

    widthSlider.addEventListener('input', () => {
        style.width = +widthSlider.value;
    });
});
