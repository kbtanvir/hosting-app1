import type { Router } from 'express'
import { createRouter } from '../utils/create'
import { handleAddUser, handleDeleteUser, handleGetAllUser, handleGetOneUser, handleUpdateUser } from './user-controllers'

const userRouter = createRouter((router: Router) => {
  router.get('/', handleGetAllUser)
  router.post('/', handleAddUser)
  router.put('/', handleUpdateUser)

  router.get('/:id', handleGetOneUser)
  router.delete('/:id', handleDeleteUser)
})

export default userRouter
