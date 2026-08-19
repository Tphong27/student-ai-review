import { calculateQuizResult } from './quizScoring'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

function normalizeGrade(grade) {
  return grade.replace(/^Lớp\s+/i, '')
}

function getQuizErrorMessage(status, responseMessage) {
  const knownMessages = {
    'AI service is not configured yet.': 'StudyMate chưa được cấu hình Gemini. Vui lòng thử lại sau.',
    'AI response timed out. Please try again.': 'StudyMate tạo câu hỏi quá lâu. Vui lòng thử lại.',
    'AI service authentication failed.': 'StudyMate đang gặp lỗi xác thực Gemini. Vui lòng thử lại sau.',
    'AI service is busy. Please try again shortly.': 'StudyMate đang được nhiều bạn sử dụng. Vui lòng thử lại sau ít phút.',
    'AI returned an empty response. Please try again.': 'StudyMate chưa tạo được bộ câu hỏi. Vui lòng thử lại.',
    'AI returned malformed quiz data. Please try again.': 'Bộ câu hỏi AI tạo chưa đúng định dạng. Vui lòng tạo lại.',
    'AI quiz did not match the requested question count. Please try again.': 'Bộ câu hỏi chưa đúng số lượng yêu cầu. Vui lòng tạo lại.',
    'AI quiz did not match the requested question type. Please try again.': 'Bộ câu hỏi chưa đúng loại câu hỏi yêu cầu. Vui lòng tạo lại.',
    'Unable to generate quiz right now.': 'StudyMate chưa thể tạo câu hỏi lúc này. Vui lòng thử lại sau.',
  }

  if (responseMessage && knownMessages[responseMessage]) {
    return knownMessages[responseMessage]
  }

  if (status === 400) {
    return 'Cấu hình quiz chưa hợp lệ. Vui lòng kiểm tra lớp, môn, loại câu hỏi và số lượng câu.'
  }

  if (status === 429) {
    return 'StudyMate đang được nhiều bạn sử dụng. Vui lòng thử lại sau ít phút.'
  }

  return 'Không thể tạo bộ câu hỏi lúc này. Vui lòng thử lại.'
}

export async function generateQuiz({ grade, subject, topic, questionType, questionCount, customInstruction }) {
  const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grade: normalizeGrade(grade),
      subject,
      topic: topic.trim(),
      questionType,
      questionCount: Number(questionCount),
      customInstruction: customInstruction.trim(),
    }),
  })

  let payload = null

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok || !payload?.success || !Array.isArray(payload.quiz?.questions)) {
    throw new Error(getQuizErrorMessage(response.status, payload?.message))
  }

  return payload.quiz
}

export { calculateQuizResult }
