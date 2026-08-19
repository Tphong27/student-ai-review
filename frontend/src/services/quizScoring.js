export function calculateQuizResult(questions, answers) {
  const total = questions.length
  const correctCount = questions.reduce((count, question) => {
    return answers[question.id] === question.correctAnswer ? count + 1 : count
  }, 0)

  return {
    correctCount,
    total,
    percentage: total > 0 ? Math.round((correctCount / total) * 100) : 0,
  }
}
