import express, { json } from "express";
import dotenv from "dotenv";
import http from "http";

import { limiter } from "./middleware/helper/limiter.js";
import matchRouter from "./routes/match.routes.js";
import { logger } from "./middleware/log/logged.js";
import { attachWebSocketServer } from "./ws/server.js";
import commentaryRouter from "./routes/commentary.routes.js";

dotenv.config();

const PORT = process.env.PORT ?? 5000;
const HOST = process.env.HOST ?? "0.0.0.0";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(limiter);
app.use(logger);

app.get("/", (req, res) => {
  console.log("Route was hit");
  res.send("Hello, World!");
});
app.use("/matches", matchRouter);
app.use("/commentary", commentaryRouter);

const { broadCastMatch } = attachWebSocketServer(server);
app.locals.broadCastMatch = broadCastMatch;

server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server is running on ${baseUrl}`);
  console.log(
    `WebSocket server is running on ${baseUrl.replace("http", "ws")}/ws`,
  );
});
