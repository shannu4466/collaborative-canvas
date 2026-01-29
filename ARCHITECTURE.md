# System Architecture

## Overview

This application is a real-time collaborative drawing system using a client-server WebSocket architecture.

Multiple clients connect to a central server, which broadcasts drawing actions to all participants in a shared room.

The architecture is event-driven and optimized for low latency.

---

## Data Flow Diagram

User A draws → Canvas Event → WebSocket Message → Server → Broadcast → Other Clients → Render on Canvas

Flow steps:

1. User draws on canvas
2. Frontend captures stroke data
3. Stroke serialized into JSON
4. Sent to server via WebSocket
5. Server validates & broadcasts
6. All clients render stroke

The server acts as a relay and synchronization authority.

---

## WebSocket Protocol

All messages use JSON format.

### Message Structure

{
  "type": "draw | undo | redo | join",
  "room": "room-id",
  "payload": {}
}

---

### Events

DRAW
Sent when a stroke is created.

{
  "type": "draw",
  "payload": {
    "points": [...],
    "color": "#000",
    "width": 2
  }
}

UNDO
{
  "type": "undo"
}

REDO
{
  "type": "redo"
}

JOIN ROOM
{
  "type": "join",
  "room": "room-name"
}

---

## Undo / Redo Strategy

Undo/redo is implemented as a shared global history stack per room.

Each room maintains:

- strokeHistory[]
- undoStack[]

Process:

Draw:
- push stroke to history

Undo:
- pop from history
- push to undoStack
- broadcast update

Redo:
- pop from undoStack
- push back to history

All clients re-render canvas from history after each change.

This ensures global consistency across users.

---

## Performance Decisions

Several optimizations were chosen:

1. Stroke batching
   Instead of sending pixel data, only vector stroke data is transmitted.

2. Event-based sync
   Only changes are sent, not full canvas state.

3. Room isolation
   Messages are scoped to rooms to reduce broadcast overhead.

4. Canvas redraw strategy
   Canvas is redrawn from stroke history instead of storing bitmap frames.

These decisions reduce bandwidth and improve responsiveness.

---

## Conflict Handling

Simultaneous drawing is handled using an append-only stroke model.

Rules:

- Each stroke is atomic
- Order is determined by server timestamp
- Server broadcasts strokes sequentially
- Clients render in received order

Because strokes do not overwrite each other, conflicts are naturally avoided.

Undo/redo operations are synchronized globally to prevent divergence.

---

## Scalability Notes

The server is stateless except for in-memory room history.

Horizontal scaling can be achieved by:

- Shared Redis event bus
- WebSocket clustering
- Load-balanced room routing

---

## Conclusion

The system prioritizes:

- Real-time responsiveness
- Consistency across clients
- Simplicity of architecture
- Efficient network usage

The design is suitable for collaborative real-time applications and can be extended to production-scale systems.