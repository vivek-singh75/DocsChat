import { useEffect } from 'react'
import { useDocsChat } from './hooks/useDocsChat'
import { ChatWorkspace } from './ui/ChatWorkspace'
import { Icon } from './ui/Icon'
import './App.css'

function App() {
  const chat = useDocsChat()

  useEffect(() => {
    const scrollArea = document.getElementById('chat-scroll-area')
    if (chat.sessionId && scrollArea) {
      scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' })
    }
  }, [chat.messages, chat.isSending, chat.sessionId])

  const openFilePicker = () => document.getElementById('document-upload-input')?.click()

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="DocsChat home">
          <span className="brand-mark"><Icon name="layers" size={20} /></span>
          <span>docs<span className="brand-accent">chat</span></span>
        </a>

        <button className="new-chat-button" onClick={openFilePicker} type="button">
          <Icon name="plus" size={17} />
          <span>New conversation</span>
          <span className="shortcut">⌘ K</span>
        </button>

        <div className="sidebar-section">
          <span className="section-label">YOUR WORKSPACE</span>
          {chat.document ? (
            <button className="document-nav active" type="button">
              <span className="pdf-icon"><Icon name="file" size={16} /></span>
              <span className="nav-document-name">{chat.document.fileName}</span>
              <span className="active-dot" />
            </button>
          ) : (
            <div className="sidebar-empty">Your documents will appear here</div>
          )}
        </div>

        <div className="sidebar-bottom">
          <div className="privacy-note">
            <span className="privacy-icon"><Icon name="shield" size={16} /></span>
            <div>
              <strong>Your documents stay private</strong>
              <span>Stored securely for this session</span>
            </div>
          </div>
          <div className="profile-row">
            <div className="avatar">D</div>
            <div className="profile-info"><strong>Document workspace</strong><span>Personal</span></div>
            <button className="icon-button profile-menu" aria-label="Workspace options" type="button">
              <Icon name="more" size={18} />
            </button>
          </div>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="breadcrumb-muted">Workspace</span>
            <Icon name="chevron" size={14} />
            <span>{chat.document ? 'Chat with document' : 'New conversation'}</span>
          </div>
          <div className="topbar-actions">
            {chat.sessionId && !chat.isExpired && (
              <span className="session-status"><span className="status-dot" /> Session active</span>
            )}
            <button className="icon-button help-button" type="button" aria-label="About DocsChat">
              <Icon name="help" size={18} />
            </button>
            <div className="avatar top-avatar">D</div>
          </div>
        </header>

        <ChatWorkspace
          {...chat}
          onOpenFilePicker={openFilePicker}
        />
      </section>
    </main>
  )
}

export default App
