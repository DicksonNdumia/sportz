import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../schema/schema.js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema, logger: true });
