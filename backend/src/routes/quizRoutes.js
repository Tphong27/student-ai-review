import { Router } from 'express'
import { postGenerateQuiz } from '../controllers/quizController.js'

const quizRoutes = Router()

quizRoutes.post('/quiz/generate', postGenerateQuiz)

export default quizRoutes
