import { useEffect, useRef, useState } from 'react'
import ChatMessage from '../components/ChatMessage'
import { getQuickActionPrompt, sendChatMessage } from '../services/chatService'

const grades = ['Lớp 10', 'Lớp 11', 'Lớp 12']
const subjects = ['Toán', 'Ngữ văn', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Sinh học', 'Lịch sử', 'Địa lý']

const quickActions = ['Tóm tắt chủ đề', 'Giải thích dễ hiểu', 'Tạo 5 câu trắc nghiệm']

function ChatPage() {
  const [grade, setGrade] = useState('')
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Chọn lớp, môn học rồi đặt câu hỏi để bắt đầu ôn tập.',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [retryRequest, setRetryRequest] = useState(null)
  const conversationEndRef = useRef(null)
  const messageInputRef = useRef(null)

  const canSend = grade && subject && message.trim() && !isLoading

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, isLoading])

  async function submitMessage(nextMessage, { addStudentMessage = true, request = null, requestMessage = nextMessage } = {}) {
    const cleanMessage = nextMessage.trim()
    const cleanRequestMessage = requestMessage.trim()

    if (!grade || !subject) {
      setError('Vui lòng chọn lớp và môn học trước khi gửi câu hỏi.')
      return
    }

    if (!cleanMessage || !cleanRequestMessage || isLoading) {
      return
    }

    const nextRequest = request || { grade, subject, topic, message: cleanRequestMessage }

    setError('')
    setMessage('')

    if (addStudentMessage) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          sender: 'student',
          text: cleanMessage,
        },
      ])
    }

    setIsLoading(true)

    try {
      const aiText = await sendChatMessage(nextRequest)
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          sender: 'ai',
          text: aiText,
        },
      ])
      setRetryRequest(null)
    } catch (requestError) {
      setRetryRequest({ ...nextRequest, displayMessage: cleanMessage })
      setError(requestError instanceof Error ? requestError.message : 'Không thể tạo phản hồi lúc này. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    submitMessage(message)
  }

  function handleQuickAction(action) {
    submitMessage(action, { requestMessage: getQuickActionPrompt(action) })
  }

  function handleRetry() {
    if (retryRequest) {
      submitMessage(retryRequest.displayMessage || retryRequest.message, { addStudentMessage: false, request: retryRequest })
    }
  }

  function handleMessageKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submitMessage(message)
    }
  }

  function handleMessageChange(event) {
    const textarea = event.currentTarget
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`
    textarea.style.overflowY = textarea.scrollHeight > 180 ? 'auto' : 'hidden'
    setMessage(textarea.value)
  }

  useEffect(() => {
    const textarea = messageInputRef.current

    if (textarea && !message) {
      textarea.style.height = 'auto'
      textarea.style.overflowY = 'hidden'
    }
  }, [message])

  return (
    <main className="app-shell">
      <div className="chat-layout">
        <header className="app-header" aria-label="StudyMate AI">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <path d="M6.5 8.5h8.1c1.7 0 3.2.8 4.1 2.1.9-1.3 2.4-2.1 4.1-2.1h2.7v15h-2.7c-1.8 0-3.3.8-4.1 2.1-.8-1.3-2.3-2.1-4.1-2.1H6.5v-15Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M18.7 10.8v14.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M24.5 5.2v4.1M22.45 7.25h4.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <p className="brand-name">StudyMate <span>AI</span></p>
              <p className="brand-subtitle">Trợ lý ôn tập THPT</p>
            </div>
          </div>
          <div className="app-status" role="status">
            <span className="status-dot" aria-hidden="true" />
            Sẵn sàng hỗ trợ
          </div>
        </header>

        <div className="chat-grid">
          <aside className="context-panel" aria-label="Thiết lập buổi học">
            <header className="hero">
              <p className="eyebrow">Không gian ôn tập</p>
              <h1 id="app-title">Học chắc hơn, từng câu hỏi một.</h1>
              <p className="hero-copy">Chọn đúng bối cảnh học để StudyMate giải thích vừa sức và sát với bài của bạn.</p>
            </header>

            <div className="panel-divider" />

            <section className="study-context" aria-labelledby="context-title">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">Bắt đầu tại đây</p>
                  <h2 id="context-title">Thiết lập buổi học</h2>
                </div>
                <span className="required-note">* Bắt buộc</span>
              </div>

              <div className="controls" aria-describedby="context-help">
                <label>
                  <span>Lớp <em>*</em></span>
                  <select value={grade} onChange={(event) => setGrade(event.target.value)}>
                    <option value="">Chọn lớp</option>
                    {grades.map((gradeOption) => (
                      <option key={gradeOption} value={gradeOption}>
                        {gradeOption}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Môn học <em>*</em></span>
                  <select value={subject} onChange={(event) => setSubject(event.target.value)}>
                    <option value="">Chọn môn</option>
                    {subjects.map((subjectOption) => (
                      <option key={subjectOption} value={subjectOption}>
                        {subjectOption}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="topic-control">
                  <span>Chủ đề <small>Không bắt buộc</small></span>
                  <input
                    type="text"
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    placeholder="Ví dụ: Hàm số, Sóng cơ, Tế bào..."
                  />
                </label>
              </div>
              <p className="context-help" id="context-help">Lớp và môn giúp câu trả lời phù hợp với chương trình của bạn.</p>
            </section>

            <div className="study-tip">
              <span className="tip-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3.5a7 7 0 0 0-4 12.7c.8.6 1.2 1.1 1.2 2.3h5.6c0-1.2.4-1.7 1.2-2.3A7 7 0 0 0 12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.7 21h4.6M9.3 18.5h5.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
              <p><strong>Mẹo học nhanh</strong> Hỏi theo từng ý nhỏ để dễ nhớ và dễ kiểm tra lại.</p>
            </div>

            <footer className="context-footer">
              <span className="footer-mark" aria-hidden="true">01</span>
              <p>Ôn tập chủ động, hiểu bài theo cách của bạn.</p>
            </footer>
          </aside>

          <section className="workspace-panel" aria-labelledby="chat-title">
            <header className="conversation-header">
              <div>
                <p className="section-kicker">Trợ lý học tập</p>
                <h2 id="chat-title">Trò chuyện cùng StudyMate</h2>
              </div>
              <div className="conversation-state">
                <span className="state-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5h-5.2L7 18.5v-3.7a2.5 2.5 0 0 1-2-2.4v-5.9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M8.5 8.5h7M8.5 11.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </span>
                <span>Học qua hội thoại</span>
              </div>
            </header>

            <div className="conversation-context" aria-label="Bối cảnh hiện tại">
              <span className="context-chip">{grade || 'Chưa chọn lớp'}</span>
              <span className="context-chip">{subject || 'Chưa chọn môn'}</span>
              {topic.trim() && <span className="context-chip context-chip-topic">Chủ đề: {topic}</span>}
            </div>

            <section className="quick-actions" aria-label="Hành động nhanh">
              <p className="quick-actions-label">Bắt đầu nhanh</p>
              <div className="quick-action-list">
                {quickActions.map((action) => (
                  <button className="quick-action" key={action} type="button" onClick={() => handleQuickAction(action)} disabled={isLoading}>
                    <span className="quick-action-icon" aria-hidden="true">
                      {action === 'Tóm tắt chủ đề' && (
                        <svg viewBox="0 0 24 24" fill="none"><path d="M7 4.5h7l3 3v12H7a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M14 4.5v3h3M9 11h6M9 14h6M9 17h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                      )}
                      {action === 'Giải thích dễ hiểu' && (
                        <svg viewBox="0 0 24 24" fill="none"><path d="M9.2 18.2h5.6M9.8 21h4.4M8.1 14.9a6 6 0 1 1 7.8 0c-.8.6-1.1 1.3-1.1 2.3H9.2c0-1-.3-1.7-1.1-2.3Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                      {action === 'Tạo 5 câu trắc nghiệm' && (
                        <svg viewBox="0 0 24 24" fill="none"><path d="M7 4.5h10a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="m9 9 1.2 1.2L12 8.5M13.5 9H16M9 14l1.2 1.2 1.8-1.7M13.5 14H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                    </span>
                    <span>{action}</span>
                  </button>
                ))}
              </div>
            </section>

            {error && (
              <div className="error-message" role="alert">
                <span className="error-icon" aria-hidden="true">!</span>
                <span>{error}</span>
                <button className="retry-button" type="button" onClick={handleRetry} disabled={isLoading || !retryRequest}>
                  Thử lại
                </button>
              </div>
            )}

            <section className="conversation" aria-label="Cuộc trò chuyện" aria-live="polite" aria-busy={isLoading}>
              {messages.map((chatMessage) => (
                <ChatMessage key={chatMessage.id} message={chatMessage} />
              ))}
              {isLoading && <ChatMessage message={{ sender: 'ai', text: 'StudyMate AI đang soạn câu trả lời...', isLoading: true }} />}
              <div ref={conversationEndRef} aria-hidden="true" />
            </section>

            <form className="message-form" onSubmit={handleSubmit} aria-label="Gửi câu hỏi">
              <div className="composer-field">
                <label className="sr-only" htmlFor="message-input">
                  Nhập câu hỏi
                </label>
                <textarea
                  id="message-input"
                  ref={messageInputRef}
                  value={message}
                  onChange={handleMessageChange}
                  onKeyDown={handleMessageKeyDown}
                  placeholder="Bạn muốn ôn tập điều gì hôm nay?"
                  disabled={isLoading}
                  autoComplete="off"
                  enterKeyHint="send"
                  aria-describedby="message-help"
                  rows="2"
                />
                <div className="composer-actions">
                  <span className="composer-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                  </span>
                  <p className="composer-help" id="message-help">Enter để gửi · Shift + Enter để xuống dòng</p>
                  <button className="message-submit" type="submit" disabled={!canSend} aria-label="Gửi câu hỏi">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 14-7-4.5 14-3-6-6.5-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="m11.5 13 7.5-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

export default ChatPage
