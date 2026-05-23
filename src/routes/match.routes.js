import express from "express";
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from "../validation/matches.js";
import { db } from "../config/db.config.js";
import { match } from "../schema/schema.js";
import { getMatchStatus } from "../utils/match.status.js";
import { desc } from "drizzle-orm";
import { addMatch, getMatches } from "../controller/mathc.controller.js";

const router = express.Router();
const MAX_LIMIT = 100;
router.get("/", getMatches);

router.post("/", addMatch);

export default router;
