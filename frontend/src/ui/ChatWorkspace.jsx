import { Icon } from './Icon'

const suggestions = [
  { title: 'Give me the key takeaways', detail: 'A quick summary of this document' },
  { title: 'What are the main topics?', detail: 'Explore the big ideas inside' },
  { title: 'Find important dates', detail: 'Surface timelines and deadlines' },
]

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function DocumentCard({ document, isUploading, onOpenFilePicker }) {
  if (isUploading) {
    return (
      <div className="upload-card processing-card">
        <span className="file-badge"><Icon name="file" size={18} /></span>
        <div className="file-details"><strong>Preparing your document</strong><span>Reading pages and organizing content…</span></div>
        <span className="spinner" aria-label="Uploading" />
      </div>
    )
  }

  if (!document) {
    return (
      <button className="upload-card upload-prompt" type="button" onClick={onOpenFilePicker}>
        <span className="file-badge"><Icon name="upload" size={18} /></span>
        <span className="file-details"><strong>Add a document</strong><span>Upload a PDF to start asking questions</span></span>
        <span className="upload-link">Choose file</span>
      </button>
    )
  }

  return (
    <div className="upload-card">
      <span className="file-badge"><Icon name="file" size={18} /></span>
      <div className="file-details">
        <strong title={document.fileName}>{document.fileName}</strong>
        <span>{document.totalPages} {document.totalPages === 1 ? 'page' : 'pages'} <span className="file-divider">·</span> {document.totalChunks} sections</span>
      </div>
      <span className="file-ready"><Icon name="check" size={14} /> Ready</span>
    </div>
  )
}

function EmptyState({ document, isUploading, isExpired, onOpenFilePicker, onSuggestion }) {
  if (isExpired) {
    return (
      <div className="welcome-state expired-state">
        <div className="welcome-icon"><Icon name="clock" size={25} /></div>
        <span className="eyebrow">SESSION ENDED</span>
        <h1>Your session has expired</h1>
        <p>For your privacy, document sessions end after 20 minutes of inactivity. Upload your PDF again to continue.</p>
        <button className="primary-button" type="button" onClick={onOpenFilePicker}><Icon name="upload" size={17} /> Upload a document</button>
      </div>
    )
  }

  if (!document && !isUploading) {
    return (
      <div className="welcome-state">
        <div className="welcome-icon"><Icon name="sparkles" size={25} /></div>
        <span className="eyebrow">YOUR DOCUMENTS, UNDERSTOOD</span>
        <h1>A little more clarity,<br />one document at a time.</h1>
        <p>Drop in a PDF and have a thoughtful conversation with the information inside.</p>
        <button className="primary-button" type="button" onClick={onOpenFilePicker}><Icon name="upload" size={17} /> Upload a PDF</button>
        <span className="upload-hint">PDF documents <span>·</span> Your files stay private</span>
      </div>
    )
  }

  if (isUploading) {
    return (
      <div className="welcome-state processing-state">
        <div className="welcome-icon"><span className="spinner large-spinner" /></div>
        <span className="eyebrow">JUST A MOMENT</span>
        <h1>Getting to know<br />your document.</h1>
        <p>We’re organizing everything so you can ask better questions.</p>
        <div className="processing-steps">
          <span className="processing-step active"><span className="step-dot" /> Reading your PDF</span>
          <span className="processing-step"><span className="step-dot" /> Getting things ready</span>
        </div>
      </div>
    )
  }

  return (
    <div className="document-ready-state">
      <div className="ready-heading">
        <span className="eyebrow">DOCUMENT READY</span>
        <h1>What would you like to know?</h1>
        <p>Ask anything about your document. Here are a few places to start.</p>
      </div>
      <div className="suggestion-grid">
        {suggestions.map((suggestion) => (
          <button
            className="suggestion-card"
            key={suggestion.title}
            onClick={() => onSuggestion(suggestion.title)}
            type="button"
          >
            <span className="suggestion-icon"><Icon name="sparkles" size={17} /></span>
            <strong>{suggestion.title}</strong>
            <span>{suggestion.detail}</span>
            <Icon name="chevron" size={15} className="suggestion-arrow" />
          </button>
        ))}
      </div>
      <div className="grounding-note"><Icon name="shield" size={15} /> Answers are grounded in your document</div>
    </div>
  )
}

function Message({ message }) {
  const isUser = message.role === 'user'
  return (
    <article className={`message-row ${isUser ? 'user-message-row' : 'assistant-message-row'}`}>
      {!isUser && <div className="message-avatar"><Icon name="sparkles" size={16} /></div>}
      <div className="message-content">
        {!isUser && <span className="message-author">DocsChat <span>·</span> Assistant</span>}
        <div className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>{message.content}</div>
      </div>
      {isUser && <div className="user-avatar">D</div>}
    </article>
  )
}

export function ChatWorkspace({
  document,
  messages,
  question,
  setQuestion,
  isUploading,
  isSending,
  error,
  setError,
  notice,
  isExpired,
  handleUpload,
  handleAsk,
  startOver,
  onOpenFilePicker,
}) {
  const activeChat = document && !isExpired
  const onDrop = (event) => {
    event.preventDefault()
    handleUpload(event.dataTransfer.files?.[0])
  }

  return (
    <div className="workspace-layout">
      <section className="chat-column" onDragOver={(event) => event.preventDefault()} onDrop={onDrop}>
        <div className="chat-scroll-area" id="chat-scroll-area">
          {messages.length === 0 ? (
            <EmptyState
              document={document}
              isUploading={isUploading}
              isExpired={isExpired}
              onOpenFilePicker={onOpenFilePicker}
              onSuggestion={setQuestion}
            />
          ) : (
            <div className="conversation">
              <div className="conversation-date"><span /> TODAY <span /></div>
              {messages.map((message) => <Message key={message.id} message={message} />)}
              {isSending && (
                <div className="message-row assistant-message-row">
                  <div className="message-avatar"><Icon name="sparkles" size={16} /></div>
                  <div className="message-content">
                    <span className="message-author">DocsChat <span>·</span> Assistant</span>
                    <div className="message-bubble assistant-bubble typing-indicator"><i /><i /><i /></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button type="button" aria-label="Dismiss error" onClick={() => setError('')}><Icon name="close" size={17} /></button>
          </div>
        )}
        {notice && !error && (
          <div className="success-banner" role="status">
            <Icon name="check" size={15} />
            <span>{notice}</span>
          </div>
        )}

        <div className="composer-area">
          <DocumentCard document={document} isUploading={isUploading} onOpenFilePicker={onOpenFilePicker} />
          <form className="composer" onSubmit={handleAsk}>
            <textarea
              aria-label="Ask a question about your document"
              placeholder={activeChat ? 'Ask anything about your document…' : 'Upload a document to start chatting'}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  handleAsk(event)
                }
              }}
              disabled={!activeChat || isSending || isUploading}
              rows={1}
            />
            <div className="composer-footer">
              <span className="composer-hint"><Icon name="message" size={14} /> Answers based on your PDF</span>
              <div className="composer-actions">
                <span className="enter-hint">↵ <span>to send</span></span>
                <button className="send-button" type="submit" disabled={!activeChat || !question.trim() || isSending} aria-label="Send question">
                  <Icon name="send" size={16} />
                </button>
              </div>
            </div>
          </form>
          <p className="disclaimer">DocsChat can make mistakes. Check important information against the source.</p>
        </div>
      </section>

      <aside className="details-panel">
        <div className="details-heading"><span>DOCUMENT</span><button className="icon-button" onClick={() => { startOver(); onOpenFilePicker() }} type="button" aria-label="Upload another document"><Icon name="plus" size={17} /></button></div>
        {document ? (
          <>
            <div className="details-file-icon"><Icon name="file" size={22} /></div>
            <h2 className="details-file-name" title={document.fileName}>{document.fileName}</h2>
            <span className="details-file-meta">PDF document <span>·</span> {document.totalPages} {document.totalPages === 1 ? 'page' : 'pages'}</span>
            <div className="details-divider" />
            <div className="detail-row"><span>Processing status</span><span className="detail-value ready-value"><i /> Ready</span></div>
            <div className="detail-row"><span>Document sections</span><span className="detail-value">{document.totalChunks}</span></div>
            <div className="detail-row"><span>File size</span><span className="detail-value">{document.size ? formatSize(document.size) : 'PDF'}</span></div>
            <button className="replace-button" onClick={() => { startOver(); onOpenFilePicker() }} type="button"><Icon name="upload" size={15} /> Upload another PDF</button>
          </>
        ) : (
          <div className="details-placeholder"><span className="placeholder-icon"><Icon name="file" size={19} /></span><p>Your document details will appear here once you upload a PDF.</p></div>
        )}
        <div className="details-tip">
          <span className="tip-icon"><Icon name="sparkles" size={15} /></span>
          <div><strong>A little tip</strong><p>Try asking a specific question for a more useful answer.</p></div>
        </div>
        <div className="session-note"><Icon name="clock" size={14} /> Sessions expire after 20 minutes of inactivity.</div>
      </aside>

      <input
        id="document-upload-input"
        className="visually-hidden"
        type="file"
        accept="application/pdf,.pdf"
        onChange={(event) => {
          handleUpload(event.target.files?.[0])
          event.currentTarget.value = ''
        }}
      />
    </div>
  )
}
