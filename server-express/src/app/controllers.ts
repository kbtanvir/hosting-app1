import consola from 'consola'
import { createHandler as createController } from '../utils/create'
import { BackendError } from '../utils/errors'
import { type User, deleteUserSchema, getOneSchema, newUserSchema, updateUserSchema } from './user.schema'
import { addUser, deleteUser, getAllUser, getUserByEmail, getUserByUserId, updateUser } from './user.service'

export const handleAddUser = createController(newUserSchema, async (req, res) => {
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

export const handleGetOneUser = createController(getOneSchema, async (req, res) => {
  const id = req.params.id
 
  const user = await getUserByUserId(id as string)

  res.status(200).json({
    user,
  })
})
export const handleDeleteUser = createController(deleteUserSchema, async (req, res) => {
  const { email } = req.body

  const deletedUser = await deleteUser(email)

  res.status(200).json({
    user: deletedUser,
  })
})

export const handleGetUser = createController(async (_req, res) => {
  const { user } = res.locals as { user: User }

  res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })
})
export const handleGetAllUser = createController(async (_req, res) => {
  const dto = await getAllUser()

  res.status(200).json({
    user: dto,
  })
})

export const handleUpdateUser = createController(updateUserSchema, async (req, res) => {
  const { name, email } = req.body

  const updatedUser = await updateUser({ name, email })

  res.status(200).json({
    user: updatedUser,
  })
})
