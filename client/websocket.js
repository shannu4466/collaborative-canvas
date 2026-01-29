import { drawLine, drawCursors } from './canvas.js';

export function setupSocket(drawCtx, cursorCtx, username) {
    const socket = io();
    const cursors = {};

    socket.on('connect', () => {
        socket.emit('user_join', { name: username });
    });

    socket.on('cursor_update', (data) => {
        cursors[data.id] = data;
        redrawCursors(cursorCtx, cursors);
    });

    socket.on('user_left', (id) => {
        delete cursors[id];
        redrawCursors(cursorCtx, cursors);
    });

    socket.on('state_update', (strokes) => {
        drawCtx.clearRect(0, 0, drawCtx.canvas.width, drawCtx.canvas.height);

        strokes.forEach(stroke => {
            stroke.segments.forEach(seg => {
                drawLine(drawCtx, seg.start, seg.end, seg.style, seg.tool);
            });
        });
    });

    socket.on('user_list_update', (users) => {
        updateUserList(users);
    });

    return socket;
}

function redrawCursors(ctx, cursors) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawCursors(ctx, cursors);
}

function updateUserList(users) {
    const list = document.getElementById('userList');
    list.innerHTML = '';

    Object.values(users).forEach(user => {
        const li = document.createElement('li');

        const dot = document.createElement('span');
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.borderRadius = '50%';
        dot.style.background = user.color;

        const name = document.createElement('span');
        name.textContent = user.name;

        li.appendChild(dot);
        li.appendChild(name);
        list.appendChild(li);
    });
}