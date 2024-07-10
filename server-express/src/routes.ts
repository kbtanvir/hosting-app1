import type { Router } from 'express'
import userRouter from './app/user.router'
import { createRouter } from './utils/create'

export default createRouter((router: Router) => {
  router.use('/user', userRouter)
  // router.use('/site', siteRouter)
})
