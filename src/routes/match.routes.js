import express from "express";
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from "../validation/matches.js";
import { db } from "../config/db.config.js";
import { match } from "../schema/schema.js";
import { getMatchStatus } from "../utils/match.status.js";
import { desc } from "drizzle-orm";

const router = express.Router();
const MAX_LIMIT = 100;
router.get("/", async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid Payload",
      details: JSON.stringify(parsed.error),
    });
  }
  const limit = Math.min(parsed.data ?? 50, MAX_LIMIT);

  try {
    const data = await db
      .select()
      .from(match)
      .orderBy(desc(match.createdAt))
      .limit(limit);

    return res.status(200).json({
      message: "Here are the matches available",
      event: data,
    });
  } catch (e) {
    res.status(500).json({
      error: "Failed to get Matches",
      details: JSON.stringify(e),
    });
  }
});

router.post("/", async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);
  //console.log("This is was Hit :", parsed);
  const {
    data: { startTime, endTime, homeScore, awayScore },
  } = parsed;
  //console.log("This is the parsed data:", parsed);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid Payload",
      details: JSON.stringify(parsed.error),
    });
  }

  try {
    const [event] = await db
      .insert(match)
      .values({
        ...parsed.data,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status: getMatchStatus(startTime, endTime),
      })
      .returning();

    res.status(201).json({
      message: "successfully added a match",
      data: event,
    });
  } catch (e) {
    res.status(500).json({
      error: "Failed to create Match",
      details: JSON.stringify(e),
    });
  }
});

export default router;
