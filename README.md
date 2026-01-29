# Real-Time Collaborative Drawing App

A real-time multi-user drawing application where users can join rooms and draw together on a shared canvas. All drawing actions are synchronized instantly using WebSockets.

---

## Tech Stack

Frontend:
- HTML5
- CSS3
- Vanilla JavaScript
- HTML Canvas API

Backend:
- Node.js
- Express
- WebSocket

No frontend frameworks were used. The UI is built using pure HTML/CSS and native browser APIs.

---

## Installation

Clone the repository:

git clone https://github.com/your-username/drawing-app.git

Navigate into the project:

cd drawing-app

Install dependencies:

npm install

Start the server:

npm start

Open browser:

http://localhost:3000

---

## Running Multiple Users (Testing Collaboration)

To simulate multiple users:

1. Open the app in multiple browsers
   - Chrome
   - Firefox
   - Edge
   - Incognito window

2. Join the same room name

3. Start drawing — changes will sync live across all users

This simulates real-time collaborative behavior.

---

## Features

- Real-time collaborative drawing
- Room-based isolation
- Global undo / redo
- Live canvas synchronization
- Persistent drawing across refresh
- WebSocket communication
- Multi-user support

---

## Known Issues / Limitations

- No authentication system
- Large drawings may increase memory usage
- Undo/redo history is stored in memory (not persistent)
- No mobile gesture optimization yet
- Server restart clears session state

---

## Total Time Spent

Approximate development time:

> 18–22 hours

Includes:
- Architecture design
- Real-time sync implementation
- Undo/redo logic
- Testing with multiple clients
- Documentation

---

## Future Improvements

- Database persistence
- Authentication
- Drawing export (PNG/SVG)
- Mobile UI optimization
- Scalable WebSocket clustering
- Performance monitoring

---

## License

MIT License