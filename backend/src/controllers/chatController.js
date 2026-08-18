import { chatWithStudyMate } from '../services/chatService.js'

export async function postChat(request, response) {
  try {
    const message = await chatWithStudyMate(request.body)
    response.json({ success: true, message })
  } catch (error) {
    response.status(error.statusCode || 500).json({
      success: false,
      message: error.publicMessage || 'Unable to process the request.',
    })
  }
}
