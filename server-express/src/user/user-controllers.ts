import consola from 'consola'
import { createHandler } from '../utils/create'
import { BackendError } from '../utils/errors'
import { type User, deleteUserSchema, getOneSchema, newUserSchema, updateUserSchema } from './user.schema'
import { addUser, deleteUser, getAllUser, getUserByEmail, getUserByUserId, updateUser } from './user.service'

export const handleAddUser = createHandler(newUserSchema, async (req, res) => {
  const user = req.body

  const existingUser = await getUserByEmail(user.email)

  if (existingUser) {
    throw new BackendError('CONFLICT', {
      message: 'User already exists',
    })
  }

  const { user: addedUser } = await addUser(user)

  res.status(201).json(addedUser)
})

export const handleGetOneUser = createHandler(getOneSchema, async (req, res) => {
  const id = req.params.id
 
  const user = await getUserByUserId(id as string)

  res.status(200).json({
    user,
  })
})
export const handleDeleteUser = createHandler(deleteUserSchema, async (req, res) => {
  const { email } = req.body

  const deletedUser = await deleteUser(email)

  res.status(200).json({
    user: deletedUser,
  })
})

export const handleGetUser = createHandler(async (_req, res) => {
  const { user } = res.locals as { user: User }

  res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })
})
export const handleGetAllUser = createHandler(async (_req, res) => {
  const dto = await getAllUser()

  res.status(200).json({
    user: dto,
  })
})

export const handleUpdateUser = createHandler(updateUserSchema, async (req, res) => {
  const { name, email } = req.body

  const updatedUser = await updateUser({ name, email })

  res.status(200).json({
    user: updatedUser,
  })
})
