import { useState } from 'react'
import { calculateQuizResult, generateQuiz } from '../services/quizService'

function getOptionLabel(questionType, option) {
  if (questionType === 'TRUE_FALSE') {
    return option.id === 'TRUE' ? 'Đúng' : 'Sai'
  }

  return option.id
}

function getAnswerLabel(questionType, question, answerId) {
  const option = question.options.find((answerOption) => answerOption.id === answerId)

  if (!option) {
    return answerId || 'Chưa chọn'
  }

  if (questionType === 'TRUE_FALSE') {
    return getOptionLabel(questionType, option)
  }

  return `${getOptionLabel(questionType, option)}. ${option.text}`
}

function QuizPanel({ grade, subject, topic }) {
  const [questionType, setQuestionType] = useState('SINGLE_CHOICE')
  const [questionCount, setQuestionCount] = useState(5)
  const [customInstruction, setCustomInstruction] = useState('')
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const allAnswered = quiz?.questions?.length > 0 && quiz.questions.every((question) => Object.prototype.hasOwnProperty.call(answers, question.id))
  const currentQuestionList = quiz?.questions || []

  async function handleGenerateQuiz(event) {
    event?.preventDefault()
    const normalizedQuestionCount = Number(questionCount)

    if (!grade || !subject) {
      setError('Vui lòng chọn lớp và môn học trước khi tạo câu hỏi.')
      return
    }

    if (!Number.isInteger(normalizedQuestionCount) || normalizedQuestionCount < 1 || normalizedQuestionCount > 10) {
      setError('Số lượng câu phải là số nguyên từ 1 đến 10.')
      return
    }

    setError('')
    setIsGenerating(true)

    try {
      const nextQuiz = await generateQuiz({ grade, subject, topic, questionType, questionCount: normalizedQuestionCount, customInstruction })
      setQuiz(nextQuiz)
      setAnswers({})
      setResult(null)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể tạo bộ câu hỏi lúc này.')
    } finally {
      setIsGenerating(false)
    }
  }

  function handleSubmitQuiz() {
    if (!quiz || !allAnswered) {
      return
    }

    setResult(calculateQuizResult(quiz.questions, answers))
  }

  function handleResetAnswers() {
    setAnswers({})
    setResult(null)
  }

  function handleRetryGenerate() {
    handleGenerateQuiz()
  }

  function handleQuestionAnswer(questionId, optionId) {
    if (result) {
      return
    }

    setAnswers((currentAnswers) => ({ ...currentAnswers, [questionId]: optionId }))
  }

  return (
    <section className="quiz-panel" aria-label="Tạo và làm bài luyện tập">
      <form className="quiz-config" onSubmit={handleGenerateQuiz}>
        <label>
          <span>Loại câu hỏi</span>
          <select value={questionType} onChange={(event) => setQuestionType(event.target.value)} disabled={isGenerating}>
            <option value="SINGLE_CHOICE">Single Choice</option>
            <option value="TRUE_FALSE">Đúng / Sai</option>
          </select>
        </label>

        <label>
          <span>Số lượng câu</span>
          <input
            type="number"
            min="1"
            max="10"
            step="1"
            inputMode="numeric"
            value={questionCount}
            onChange={(event) => {
              if (event.target.value === '') {
                setQuestionCount('')
                return
              }

              const nextValue = Number.parseInt(event.target.value, 10)

              if (Number.isNaN(nextValue)) {
                return
              }

              setQuestionCount(Math.min(10, Math.max(1, nextValue)))
            }}
            disabled={isGenerating}
          />
        </label>

        <label className="quiz-instruction-field">
          <span>Yêu cầu thêm <small>Không bắt buộc</small></span>
          <textarea
            value={customInstruction}
            onChange={(event) => setCustomInstruction(event.target.value)}
            maxLength="1000"
            rows="4"
            placeholder="Nhập yêu cầu riêng cho AI, ví dụ: Tập trung vào thì quá khứ đơn và hiện tại hoàn thành."
            disabled={isGenerating}
          />
        </label>

        <button className="quiz-generate-button" type="submit" disabled={isGenerating || questionCount === ''}>
          {isGenerating ? 'Đang tạo câu hỏi...' : 'Tạo câu hỏi'}
        </button>
      </form>

      {error && (
        <div className="quiz-error" role="alert">
          <span>{error}</span>
          <button type="button" className="secondary-button quiz-error-retry" onClick={handleRetryGenerate} disabled={isGenerating}>
            Tạo lại
          </button>
        </div>
      )}

      {quiz && (
        <div className="quiz-workspace">
          <ol className="quiz-question-list">
            {currentQuestionList.map((question, index) => {
              const selectedAnswer = answers[question.id]
              const isCorrect = result && selectedAnswer === question.correctAnswer
              const showTrueFalse = question.type === 'TRUE_FALSE'

              return (
                <li className="quiz-question-card" key={question.id}>
                  <div className="quiz-question-heading">
                    <span>Câu {index + 1}</span>
                    {result && <strong className={isCorrect ? 'answer-correct' : 'answer-incorrect'}>{isCorrect ? 'Đúng' : 'Chưa đúng'}</strong>}
                  </div>
                  <p className="quiz-question-text">{question.question}</p>

                  <div className={`quiz-options ${showTrueFalse ? 'quiz-options-true-false' : ''}`} role="radiogroup" aria-label={`Câu ${index + 1}`}>
                    {question.options.map((option) => {
                      const isSelected = selectedAnswer === option.id
                      const isAnswer = result && question.correctAnswer === option.id

                      return (
                        <button
                          className={`quiz-option ${isSelected ? 'selected-option' : ''} ${isAnswer ? 'correct-option' : ''}`}
                          key={option.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleQuestionAnswer(question.id, option.id)}
                          disabled={Boolean(result)}
                        >
                          <span>{getOptionLabel(question.type, option)}</span>
                          {!showTrueFalse && <span>{option.text}</span>}
                        </button>
                      )
                    })}
                  </div>

                  {result && (
                    <div className="quiz-explanation">
                      <p><strong>Bạn chọn:</strong> {getAnswerLabel(question.type, question, selectedAnswer)}</p>
                      <p><strong>Đáp án đúng:</strong> {getAnswerLabel(question.type, question, question.correctAnswer)}</p>
                      <p><strong>Giải thích:</strong> {question.explanation}</p>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>

          {result && (
            <section className="quiz-summary" aria-live="polite">
              <div>
                <strong>Tổng số câu: {result.total}</strong>
                <p>{result.correctCount} đúng, {result.total - result.correctCount} sai</p>
              </div>
              <span>{result.percentage}%</span>
            </section>
          )}

          <div className="quiz-actions">
            {!result && (
              <button type="button" onClick={handleSubmitQuiz} disabled={!allAnswered}>
                Nộp bài
              </button>
            )}
            <button type="button" className="secondary-button" onClick={handleResetAnswers} disabled={isGenerating}>
              Làm lại
            </button>
            <button type="button" className="secondary-button" onClick={handleGenerateQuiz} disabled={isGenerating || questionCount === ''}>
              Tạo bộ câu hỏi mới
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default QuizPanel
