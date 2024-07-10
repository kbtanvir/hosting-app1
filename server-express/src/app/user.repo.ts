import { eq } from "drizzle-orm";
import { db } from "../utils/db";
import { BackendError } from "../utils/errors";
import { type AddNewUser, type UpdateUser, userModel } from "./user.schema";

export async function getUserByUserId(userId: string) {
  const [user] = await db
    .select()
    .from(userModel)
    .where(eq(userModel.id, userId))
    .limit(1);
  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(userModel)
    .where(eq(userModel.email, email))
    .limit(1);
  return user;
}

export async function addUser(user: AddNewUser) {
  const { ...userDetails } = user;

  const [newUser] = await db
    .insert(userModel)
    .values({
      ...userDetails,
    })
    .returning({
      name: userModel.username,
      email: userModel.email,
    });

  if (!newUser) {
    throw new BackendError("INTERNAL_ERROR", {
      message: "Failed to add user",
    });
  }

  return { user: newUser };
}

export async function deleteUser(email: string) {
  const user = await getUserByEmail(email);

  if (!user) throw new BackendError("USER_NOT_FOUND");

  const [deletedUser] = await db
    .delete(userModel)
    .where(eq(userModel.email, email))
    .returning({
      id: userModel.id,
      name: userModel.username,
      email: userModel.email,
    });

  return deletedUser;
}

export async function getAllUser() {
  const res = await db.select().from(userModel);

  return res;
}

export async function updateUser({ username: name, email }: UpdateUser) {
  const [updatedUser] = await db
    .update(userModel)
    .set({
      username: name,
      email,
    })
    .where(eq(userModel.email, email as string))
    .returning({
      id: userModel.id,
      name: userModel.username,
      email: userModel.email,
    });

  if (!updatedUser) {
    throw new BackendError("USER_NOT_FOUND", {
      message: "User could not be updated",
    });
  }

  return updatedUser;
}
