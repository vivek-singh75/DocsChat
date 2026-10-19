import { useEffect, useRef, useState } from 'react'
import { askDocumentQuestion, uploadDocument } from '../api/docsChatApi'

const SESSION_IDLE_LIMIT = 20 * 60 * 1000

export function useDocsChat() {
  const [document, setDocument] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isExpired, setIsExpired] = useState(false)
  const expiryTimerRef = useRef(null)

  const clearExpiryTimer = () => {
    if (expiryTimerRef.current) {
      window.clearTimeout(expiryTimerRef.current)
      expiryTimerRef.current = null
    }
  }

  const expireSession = () => {
    clearExpiryTimer()
    setSessionId(null)
    setIsExpired(true)
    setMessages([])
  }

  const refreshSession = () => {
    clearExpiryTimer()
    expiryTimerRef.current = window.setTimeout(expireSession, SESSION_IDLE_LIMIT)
  }

  useEffect(() => () => clearExpiryTimer(), [])

  const handleUpload = async (file) => {
    if (!file) return
    setError('')
    setNotice('')
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF document.')
      return
    }

    setIsUploading(true)
    try {
      const result = await uploadDocument(file)
      setDocument({ ...result.document, size: file.size })
      setSessionId(result.sessionId)
      setMessages([])
      setIsExpired(false)
      setNotice(result.message || 'Document processed successfully.')
      refreshSession()
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleAsk = async (event) => {
    event?.preventDefault()
    const userQuery = question.trim()
    if (!userQuery || !sessionId || isSending) return

    const userMessage = { id: crypto.randomUUID(), role: 'user', content: userQuery }
    setMessages((current) => [...current, userMessage])
    setQuestion('')
    setError('')
    setNotice('')
    setIsSending(true)
    refreshSession()
    try {
      const result = await askDocumentQuestion({ sessionId, userQuery })
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', content: result.response },
      ])
      refreshSession()
    } catch (questionError) {
      setError(questionError.message)
      if (questionError.message.toLowerCase().includes('session not found')) {
        expireSession()
      }
    } finally {
      setIsSending(false)
    }
  }

  const startOver = () => {
    clearExpiryTimer()
    setDocument(null)
    setSessionId(null)
    setMessages([])
    setQuestion('')
    setError('')
    setNotice('')
    setIsExpired(false)
  }

  return {
    document,
    sessionId,
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
  }
}
