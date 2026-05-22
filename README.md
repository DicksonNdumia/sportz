# ⚽ Live Sports Broadcasting API

> This backend system is based on a tutorial by JavaScript Mastery focused on learning real-time communication using WebSockets with Node.js and Express.

This project simulates a real-world live sports broadcasting backend where match updates and live commentaries are streamed instantly to connected clients using WebSockets.

It combines:
- REST APIs for creating matches and commentaries
- WebSocket server for pushing live updates
- Real-time sports event broadcasting
- Docker support for containerized deployment

---

# 🚀 Features

- ⚡ Real-time live commentary updates
- 📡 WebSocket broadcasting server
- 🏟️ Match creation and management
- 🧠 Commentary event tracking
- 🐳 Dockerized backend support
- 📨 JSON-based communication
- 🔄 Multiple client support


---

# 🛠️ Tech Stack

- Node.js
- Express.js
- WebSockets (`ws`)
- Docker
- JavaScript / ES Modules

---

# 📂 Cloning the Repository

```bash
git clone https://github.com/DicksonNdumia/sportz.git
```

Move into the project directory:

```bash
cd sportz
```

---

# 📦 Installing Dependencies

```bash
npm install
```

This installs all required packages including:
- express
- ws
- dotenv
- nodemon
- cors
- and other backend utilities

---

# ▶️ Running the Project

Start the development server:

```bash
npm run dev
```

Or if using production mode:

```bash
npm start
```

The server should run on:

```bash
http://localhost:5000
```

---

# 🔌 WebSocket Server

The WebSocket server handles all real-time communication between the backend and connected clients.

Default WS endpoint:

```bash
ws://localhost:5000/ws
```

When a new commentary or match event is added, all connected clients instantly receive the update.

---

# 🧪 Testing the WebSocket Server

You can test the live server using:
- Postman
- Thunder Client
- Insomnia
- wscat

Install `wscat` globally:

```bash
npm install -g wscat
```

Connect to the WebSocket server:

```bash
wscat -c ws://localhost:5000/ws
```

Once connected, you’ll start receiving live updates whenever new match events are created.

---

# ⚽ Creating a Match

### Endpoint

```bash
POST http://localhost:5000/matches
```

### Sample Request Body

```json
{
  "sport": "Soccer",
  "homeTeam": "Manchester City",
  "awayTeam": "Arsenal",
  "startTime": "2026-05-21T20:46:00.000z",
  "endTime": "2026-05-21T21:46:00.000z"
}
```

---

# 🎙️ Adding Live Commentary

### Endpoint

```bash
POST http://localhost:5000/commentary/1
```

> Replace `1` with the actual `matchId`.

### Sample Request Body

```json
{
  "minute": 80,
  "sequence": 120,
  "period": "2nd Half",
  "eventType": "Save",
  "actor": "David Raya",
  "team": "Arsenal",
  "message": "What a save from David Raya!",
  "metaData": {
    "save": "raya"
  },
  "tags": ["save", "shot"]
}
```

---

# 📡 Example WebSocket Response

Connected clients receive updates like:

```json
{
  "type": "commentary_created",
  "data": {
    "minute": 80,
    "eventType": "Save",
    "actor": "David Raya",
    "team": "Arsenal",
    "message": "What a save from David Raya!"
  }
}
```

This is what makes the application real-time.

---

# 🧠 Understanding the WebSocket Flow

1. Client connects to WebSocket server
2. Server stores active socket connection
3. A new commentary is added through REST API
4. Server broadcasts the new event
5. All connected clients instantly receive the update

This architecture is commonly used in:
- Live sports apps
- Chat applications
- Stock market dashboards
- Multiplayer games
- Real-time notifications

---

# 🐳 Docker Support

Pull the Docker image:

```bash
docker pull dicksonndumia19/socketstwo-api:latest
```

Run the container:

```bash
docker run -p 5000:5000 dicksonndumia19/socketstwo-api:latest
```

---

### Project Structure

```bash
|── .github
|── drizzle
|── kubernetes
src/
│
├── routes/
├── ws/
├── middleware/
├── validation/
├── utils/
├── config/
├── shcema/
└── index.js
|
| .env
| .gitignore

```

---



# 📚 What You Learn From This Project

By building this project, you understand:
- How WebSockets work internally
- Stateful client-server communication
- Broadcasting events in real time
- Difference between REST and WebSockets
- Event-driven backend architecture
- Managing active socket connections
- Real-world real-time backend patterns

---

# 👨‍💻 Author

Built and customized by Dickson Ndumia

Inspired by JavaScript Mastery

---
