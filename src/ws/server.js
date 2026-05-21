import { WebSocket, WebSocketServer } from "ws";

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify(payload));
}

function broadCast(wss, payload) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) return;

    client.send(JSON.stringify(payload));
  }
}

export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  wss.on("connection", (socket) => {
    socket.isAlive = true;
    socket.on("pong", () => {
      socket.isAlive = true;
    });
    sendJson(socket, { type: "welcome" });

    socket.on("error", (error) => {
      console.error(error);
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 60000);

  wss.on("close", () => clearInterval(interval));

  function broadCastMatch(match) {
    broadCast(wss, {
      type: "match_created",
      data: match,
    });
  }

  function broadCastCommentary(commentary) {
    broadCast(wss, {
      type: "Commentary Added Successfully",
      data: commentary,
    });
  }

  return { broadCastMatch, broadCastCommentary };
}
