import type { InferSelectModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

// User Model

export const userModel = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  username: varchar("username", { length: 80 }).notNull().unique(),
  email: text("email").notNull().unique(),
  subdomain: varchar("subdomain", { length: 120 }).notNull().unique(),
  status: varchar("status", { length: 20 }).default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
//
export const insertUserSchema = createInsertSchema(userModel, {
  email: schema =>
    schema.email.email().regex(/^([\w.%-]+@[a-z0-9.-]+\.[a-z]{2,6})*$/i),
});
export const selectUserSchema = createSelectSchema(userModel, {
  email: schema =>
    schema.email.email().regex(/^([\w.%-]+@[a-z0-9.-]+\.[a-z]{2,6})*$/i),
});

export const userSchemas = {
  getAll: z.object({}),

  getOne: z.object({
    params: insertUserSchema.pick({
      id: true,
    }),
  }),

  updateOne: z.object({
    body: insertUserSchema
      .pick({
        username: true,
        email: true,
        status: true,
        subdomain: true,
      })
      .partial(),
  }),

  addOne: z.object({
    body: insertUserSchema.pick({
      username: true,
      email: true,
      subdomain: true,
    }),
  }),

  deleteOne: z.object({
    body: insertUserSchema.pick({
      email: true,
    }),
  }),
};

export type User = InferSelectModel<typeof userModel>;
export type AddNewUser = z.infer<typeof userSchemas.addOne>["body"];
export type UpdateUser = z.infer<typeof userSchemas.updateOne>["body"];
