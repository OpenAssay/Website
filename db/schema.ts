import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const waitlistSignups = sqliteTable("waitlist_signups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});
