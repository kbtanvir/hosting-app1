import { eq } from 'drizzle-orm'
import { db } from '../utils/db'
import { BackendError } from '../utils/errors'
import { type NewUser, type UpdateUser, users } from './user.schema'

export async function getUserByUserId(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  return user
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  return user
}

export async function addUser(user: NewUser) {
  const { ...userDetails } = user

  const [newUser] = await db
    .insert(users)
    .values({
      ...userDetails,

    })
    .returning({
      name: users.name,
      email: users.email,
    })

  if (!newUser) {
    throw new BackendError('INTERNAL_ERROR', {
      message: 'Failed to add user',
    })
  }

  return { user: newUser }
}

export async function deleteUser(email: string) {
  const user = await getUserByEmail(email)

  if (!user)
    throw new BackendError('USER_NOT_FOUND')

  const [deletedUser] = await db.delete(users).where(eq(users.email, email)).returning({
    id: users.id,
    name: users.name,
    email: users.email,
  })

  return deletedUser
}

export async function getAllUser() {
  const res = await db.select().from(users)

  return res
}

export async function updateUser({ name, email }: UpdateUser) {
  const [updatedUser] = await db
    .update(users)
    .set({
      name,
      email,
    })
    .where(eq(users.email, email as string))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
    })

  if (!updatedUser) {
    throw new BackendError('USER_NOT_FOUND', {
      message: 'User could not be updated',
    })
  }

  return updatedUser
}
