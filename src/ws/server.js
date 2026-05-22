import { WebSocket, WebSocketServer } from "ws";

const matchSubscriber = new Map();

function subscribe(matchId, socket) {
  if (!matchSubscriber.has(matchId)) {
    matchSubscriber.set(matchId, new Set())
  }
  matchSubscriber.get(matchId).add(socket);
}

function unSubscribe(matchId, socket) {
  const subscribers = matchSubscriber.get(matchId)
  if (!subscribers) return;

  subscribers.delete(socket)

  if (subscribers.size === 0) {
    matchSubscriber.delete(matchId)
  }
}

function cleanupSubscrption(socket) {
  for (const matchId of socket.subscriptions) {
    unSubscribe(matchId, socket)
  }
}

function broadCastToMatch(matchId, payload) {

  const subscribers = matchSubscriber.get(matchId)

  if (!subscribers || subscribers.size === 0) return;

  const message = JSON.stringify(payload)

  for (const client of subscribers) {
    if (client.readyState !== WebSocket.OPEN) continue;

    client.send(message);
  }

}

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify(payload));
}

function broadCast(wss, payload) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;

    client.send(JSON.stringify(payload));
  }
}

function handleMessage(socket, data) {
  let message;

  try {
    message = JSON.parse(data.toString())

  } catch {
    sendJson(socket, { type: 'error', message: 'Invalid Json Format' })
    return
  }

  if (message?.type === "subscribe" && Number.isInteger(message.matchId)) {
    subscribe(message.matchId, socket)
    socket.subscriptions.add(message.matchId)
    sendJson(socket, { type: 'subscribed', matchId: message.matchId })
    return;
  }

  if (message?.type === "unSubscribe" && Number.isInteger(message.matchId)) {
    unSubscribe(message.matchId, socket)
    socket.subscriptions.delete(message.matchId)
    sendJson(socket, { type: 'unsubscribed', matchId: message.matchId })
    return;
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
    socket.subscriptions = new Set()
    sendJson(socket, { type: "welcome" });
    socket.on('message', (data) => {
      handleMessage(socket, data)
    })
    socket.on("error", (error) => {
           console.error(error);
         socket.terminate();
         });

    socket.on('close', () => {
      cleanupSubscrption(socket)
    })
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

  function broadCastCommentary(matchId,commentary) {
    broadCastToMatch(matchId, {
      type: "Commentary Added Successfully",
      data: commentary,
    });
  }

  return { broadCastMatch, broadCastCommentary };
}
