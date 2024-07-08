import process from 'node:process'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import express from 'express'
import consola from 'consola'
import './utils/env'
import routes from './routes'

const { PORT } = process.env

const app = express()

app.use(express.json())
app.use(cors())
// app.use(requestIp());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) => {
      consola.warn(`DDoS Attempt from ${req.ip}`)
      res.status(429).json({
        error: 'Too many requests in a short time. Please try in a minute.',
      })
    },
  }),
)

app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to the API!',
  })
})

app.get('/healthcheck', (_req, res) => {
  res.json({
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: Date.now(),
  })
})

app.use('/api', routes)

app.listen(PORT, () => {
  consola.info(`Server running at http://localhost:${PORT}`)
})
