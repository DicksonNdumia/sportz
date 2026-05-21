import express from "express";
import { matchIdParamSchema } from "../validation/matches.js";
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from "../validation/commentary.js";
import { db } from "../config/db.config.js";
import { commentary } from "../schema/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();
const MAX_LIMIT = 100;

router.get("/:id", async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({
      error: "Invalid match id",
      details: paramsResult.error.issues,
    });
  }

  const queryResults = listCommentaryQuerySchema.safeParse(req.query);
  if (!queryResults.success) {
    return res.status(400).json({
      error: "Invalid query",
      details: queryResults.error.issues,
    });
  }

  try {
    const { id: matchId } = paramsResult.data;
    const { limit = 10 } = queryResults.data;
    const safeLimit = Math.min(limit, MAX_LIMIT);
    const result = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, matchId))
      .orderBy(commentary.createdAt)
      .limit(safeLimit);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create commentary",
      details: error.message,
    });
  }
});

router.post("/:id", async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);
  // console.log("DEBUG", paramsResult);
  if (!paramsResult.success) {
    return res.status(400).json({
      error: "Invalid match id",
      details: paramsResult.error.issues,
    });
  }

  const bodyResult = createCommentarySchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({
      error: "Invalid commentary",
      details: bodyResult.error.issues,
    });
  }

  try {
    const { minute, ...rest } = bodyResult.data;
    const commentaryInsert = await db
      .insert(commentary)
      .values({
        matchId: paramsResult.data.id,
        minute: minute,
        ...rest,
      })
      .returning();

    return res.status(201).json(commentaryInsert);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create commentary",
      details: error.message,
    });
  }
});

export default router;
