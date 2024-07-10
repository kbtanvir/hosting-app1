import { eq } from "drizzle-orm";
import { User, UserModel } from "../api/user.js";
import db from "../db/db.js";
import { userTable } from "../db/schema.js";

export const create = async (input: UserModel): Promise<User | { message: string }> => {
  // Check if the username already exists
  const [subdomainExist] = await db().select().from(userTable).where(eq(userTable.subdomain, input.subdomain));

  if (subdomainExist) {
    return { message: "subdomain already exist" };
  }

  const [usernameExist] = await db().select().from(userTable).where(eq(userTable.username, input.username));

  if (usernameExist) {
    return { message: "subdomain already exist" };
  }

  const [emailExist] = await db().select().from(userTable).where(eq(userTable.email, input.email));

  if (emailExist) {
    return { message: "subdomain already exist" };
  }

  // Insert the new user
  const results = await db().insert(userTable).values(input).returning();
  return results[0]!;
};

export const findAll = async (): Promise<User[]> => {
  return await db().select().from(userTable);
};

export const findById = async (id: string): Promise<User | undefined> => {
  const results = await db().select().from(userTable).where(eq(userTable.id, id));
  return results[0];
};
