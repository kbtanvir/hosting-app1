import type { Router } from 'express'
import { createRouter } from './utils/create'
import userRouter from './user/user.router'

export default createRouter((router: Router) => {
  router.use('/user', userRouter)
})
