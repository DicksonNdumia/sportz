import {
  pgEnum,
  pgTable,
  serial,
  varchar,
  integer,
  text,
  json,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const matchEnum = pgEnum("match_status", [
  "live",
  "scheduled",
  "finished",
]);

export const match = pgTable("match", {
  id: serial("id").notNull().primaryKey(),
  sport: varchar("sport", { length: 255 }).notNull(),
  homeTeam: varchar("home_team", { length: 255 }).notNull(),
  awayTeam: varchar("away_team", { length: 255 }).notNull(),
  status: matchEnum("status").notNull().default("scheduled"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  homeScore: integer("home_score").notNull().default(0),
  awayScore: integer("away_score").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const commentary = pgTable("commentary", {
  id: serial("id").notNull().primaryKey(),
  matchId: integer("match_id")
    .references(() => match.id, { onDelete: "cascade" })
    .notNull(),
  minute: integer("minute"),
  sequence: integer("sequence").notNull(),
  period: text("period"),
  eventType: text("event_type"),
  actor: text("actor"),
  team: text("team"),
  message: text("message").notNull(),
  metaData: jsonb("metadata"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
