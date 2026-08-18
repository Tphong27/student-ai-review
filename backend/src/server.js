import 'dotenv/config'
import express from 'express'
import chatRoutes from './routes/chatRoutes.js'
import healthRoutes from './routes/healthRoutes.js'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json({ limit: '20kb' }))
app.use('/api', healthRoutes)
app.use('/api', chatRoutes)

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    response.status(400).json({
      success: false,
      message: 'Request body must contain valid JSON.',
    })
    return
  }

  response.status(500).json({
    success: false,
    message: 'Unable to process the request.',
  })
})

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`)
})
