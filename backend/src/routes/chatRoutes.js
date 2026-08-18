import { Router } from 'express'
import { postChat } from '../controllers/chatController.js'

const chatRoutes = Router()

chatRoutes.post('/chat', postChat)

export default chatRoutes
