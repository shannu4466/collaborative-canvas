const strokes = [];
const redoStack = [];

function addStroke(stroke) {
    strokes.push(stroke);
    redoStack.length = 0;
}

function undo() {
    if (strokes.length === 0) return;
    redoStack.push(strokes.pop());
}

function redo() {
    if (redoStack.length === 0) return;
    strokes.push(redoStack.pop());
}

function getState() {
    return strokes;
}

module.exports = {
    addStroke,
    undo,
    redo,
    getState
};