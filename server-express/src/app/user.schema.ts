import type { InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('sites', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const selectUserSchema = createSelectSchema(users, {
  email: schema =>
    schema.email.email().regex(/^([\w.%-]+@[a-z0-9.-]+\.[a-z]{2,6})*$/i),
});

export const getUserSchema = z.object({
  query: selectUserSchema.pick({
    email: true,
  }),
});
export const getOneSchema = z.object({
  params: selectUserSchema.pick({
    id: true,
  }),
});

export const deleteUserSchema = z.object({
  body: selectUserSchema.pick({
    email: true,
  }),
});

 
export const addUserSchema = z.object({
  body: selectUserSchema.pick({
    name: true,
    email: true,
  }),
});

export const updateUserSchema = z.object({
  body: selectUserSchema
    .pick({
      name: true,
      email: true,
    })
    .partial(),
});

export const newUserSchema = z.object({
  body: selectUserSchema.pick({
    name: true,
    email: true,
  }),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = z.infer<typeof newUserSchema>['body'];
export type UpdateUser = z.infer<typeof updateUserSchema>['body'];
