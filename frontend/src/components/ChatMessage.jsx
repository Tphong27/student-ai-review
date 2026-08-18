import ReactMarkdown from 'react-markdown'

function ChatMessage({ message }) {
  const isStudent = message.sender === 'student'

  return (
    <article className={`message-row ${isStudent ? 'student-row' : 'ai-row'}`} aria-label={isStudent ? 'Tin nhắn của bạn' : 'Tin nhắn từ StudyMate AI'}>
      {!isStudent && (
        <span className="message-avatar ai-avatar" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M7 8.5h7.5c1.6 0 3 .7 4 1.9 1-1.2 2.4-1.9 4-1.9H25v14h-2.5c-1.7 0-3.1.7-4 1.9-.9-1.2-2.3-1.9-4-1.9H7v-14Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M18.5 10.5v13.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
      )}
      <div className={`message-bubble ${isStudent ? 'student-bubble' : 'ai-bubble'} ${message.isLoading ? 'loading-bubble' : ''}`}>
        <span className="message-author">{isStudent ? 'Bạn' : 'StudyMate AI'}</span>
        {message.isLoading ? (
          <div className="loading-content" role="status">
            <span className="typing-indicator" aria-hidden="true"><i /><i /><i /></span>
            <p>{message.text}</p>
          </div>
        ) : isStudent ? (
          <p>{message.text}</p>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown skipHtml>{message.text}</ReactMarkdown>
          </div>
        )}
      </div>
      {isStudent && <span className="message-avatar student-avatar" aria-hidden="true">Bạn</span>}
    </article>
  )
}

export default ChatMessage
