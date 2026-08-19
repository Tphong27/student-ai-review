import { generateQuiz } from '../services/quizService.js'

export async function postGenerateQuiz(request, response) {
  try {
    const quiz = await generateQuiz(request.body)
    response.json({ success: true, quiz })
  } catch (error) {
    response.status(error.statusCode || 500).json({
      success: false,
      message: error.publicMessage || 'Unable to process the request.',
    })
  }
}
