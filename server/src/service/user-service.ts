import { eq } from "drizzle-orm";
import { User, UserModel } from "../api/user.js";
import db from "../db/db.js";
import { userTable } from "../db/schema.js";

export const create = async (input: UserModel): Promise<User> => {
  try {
    const [subdomainExist] = await db().select().from(userTable).where(eq(userTable.subdomain, input.subdomain));

    if (subdomainExist) {
      throw new Error("Subdomain exists");
    }

    const results = await db().insert(userTable).values(input).returning();

    return results[0]!;
  } catch (error) {
    throw new Error("An error occurred while creating the user");
  }
};

export const findAll = async (): Promise<User[]> => {
  try {
    return await db().select().from(userTable);
  } catch (error) {
    throw new Error("An error occurred while fetching users");
  }
};

export const findById = async (id: string): Promise<User | undefined> => {
  try {
    const results = await db().select().from(userTable).where(eq(userTable.id, id));
    return results[0];
  } catch (error) {
    throw new Error("An error occurred while fetching the user");
  }
};

export const deleteById = async (id: string): Promise<void> => {
  try {
    await db().delete(userTable).where(eq(userTable.id, id));
  } catch (error) {
    throw new Error("An error occurred while deleting the user");
  }
};

export const deleteAll = async (): Promise<void> => {
  try {
    await db().delete(userTable);
  } catch (error) {
    throw new Error("An error occurred while deleting all users");
  }
};