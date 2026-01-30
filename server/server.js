const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const state = require('./state-manager');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '..', 'client')));

const users = {};

function randomColor() {
    const colors = [
        "#ff4d4d",
        "#4da6ff",
        "#4dff88",
        "#ffcc00",
        "#cc66ff",
        "#ff884d",
        "#00cccc"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function broadcastUsers() {
    io.emit('user_list_update', users);
}

io.on('connection', (socket) => {

    socket.on('user_join', (data) => {
        users[socket.id] = {
            name: data.name,
            color: randomColor()
        };

        broadcastUsers();
    });

    socket.on('cursor_move', (data) => {
        socket.broadcast.emit('cursor_update', {
            id: socket.id,
            x: data.x,
            y: data.y,
            name: users[socket.id].name,
            color: users[socket.id].color
        });
    });

    socket.on('drawing_step', (drawData) => {
        socket.broadcast.emit('drawing_step', drawData);
    });

    socket.on('stroke_complete', (stroke) => {
        state.addStroke(stroke);
        io.emit('state_update', state.getState());
    });

    socket.on('undo', () => {
        state.undo();
        io.emit('state_update', state.getState());
    });

    socket.on('redo', () => {
        state.redo();
        io.emit('state_update', state.getState());
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        broadcastUsers();
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});