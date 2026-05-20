import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { limiter } from "./middleware/helper/limiter.ts";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
app.use(express.json);
app.use(limiter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
