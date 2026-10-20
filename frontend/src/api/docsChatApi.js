// const API_BASE = 'http://localhost:3000/api'
const API_BASE = 'https://docschat-8pq3.onrender.com/api'

async function readResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text ? { message: text } : {}
}

async function request(url, options) {
  let response
  try {
    response = await fetch(url, options)
  } catch {
    throw new Error('Could not reach DocsChat. Check that the backend is running and try again.')
  }

  const data = await readResponse(response)
  if (!response.ok || data.success === false) {
    throw new Error(data.message || `Request failed (${response.status}). Please try again.`)
  }
  return data
}

function requireDocumentUploadResult(data) {
  if (
    data.success !== true
    || typeof data.message !== 'string'
    || typeof data.sessionId !== 'string'
    || typeof data.document?.fileName !== 'string'
    || typeof data.document?.totalPages !== 'number'
    || typeof data.document?.totalChunks !== 'number'
  ) {
    throw new Error('The server returned an unexpected document upload response.')
  }
  return data
}

function requireQuestionResult(data) {
  if (data.success !== true || typeof data.response !== 'string') {
    throw new Error('The server returned an unexpected answer response.')
  }
  return data
}

export function uploadDocument(file) {
  const formData = new FormData()
  formData.append('docsFile', file)

  return request(`${API_BASE}/docs/upload`, {
    method: 'POST',
    body: formData,
  }).then(requireDocumentUploadResult)
}

export function askDocumentQuestion({ sessionId, userQuery }) {
  return request(`${API_BASE}/user/question`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, userQuery }),
  }).then(requireQuestionResult)
}
  