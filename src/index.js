import express, { json } from "express";
import dotenv from "dotenv";
import { limiter } from "./middleware/helper/limiter.js";
import matchRouter from "./routes/match.routes.js";
import { logger } from "./middleware/log/logged.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(limiter);
app.use(logger);

app.get("/", (req, res) => {
  console.log("Route was hit");
  res.send("Hello, World!");
});
app.use("/matches", matchRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
