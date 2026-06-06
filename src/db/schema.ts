import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const itemStatusValues = ["waiting", "skipped", "bought"] as const;
export type ItemStatus = (typeof itemStatusValues)[number];

export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  price: real("price").notNull(),
  currency: text("currency").notNull(),
  delayHours: integer("delay_hours").notNull(),
  notifyAt: integer("notify_at", { mode: "timestamp_ms" }).notNull(),
  notifId: text("notif_id"),
  status: text("status", { enum: itemStatusValues })
    .notNull()
    .default("waiting"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  decidedAt: integer("decided_at", { mode: "timestamp_ms" }),
  note: text("note"),
});
