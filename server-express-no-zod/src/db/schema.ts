import { integer, pgEnum, pgTable, serial, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const currencyEnum = pgEnum("currency", ["USD", "EUR", "GBP"]);
export const statusEnum = pgEnum("status", ["active", "blocked"]);

export const accountTable = pgTable("account", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  currency: currencyEnum("currency").notNull().default("USD"), //default value required to be set for old records during migration
  balance: integer("balance").notNull().default(0),
});

export const userTable = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  username: varchar("username", { length: 80 }).notNull().unique(),
  email: text("email").notNull().unique(),
  subdomain: varchar("subdomain", { length: 120 }).notNull().unique(),
  status: statusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
