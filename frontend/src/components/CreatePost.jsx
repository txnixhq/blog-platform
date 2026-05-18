import { useState } from 'react'
import { API_URL } from '../config'

function parseMarkdown(content) {
  return window.marked ? window.marked.parse(content ?? '') : content ?? ''
}

export default function CreatePost({ token, onCreated, onCancel }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setError('')
    setSubmitting(true)
    try {
      const resp = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      })
      const { data, error } = await resp.json()
      if (error) {
        setError(error)
      } else {
        onCreated(data)
      }
    } catch {
      setError('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <button onClick={onCancel} className="text-blue-600 hover:underline text-sm">
          ← Cancel
        </button>
        <h1 className="text-base font-semibold text-gray-900">New post</h1>
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {preview ? (
            <div
              className="prose min-h-64 bg-white border border-gray-200 rounded-lg p-5 text-gray-800"
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(content || '*Nothing to preview yet.*'),
              }}
            />
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post in Markdown…"
              rows={18}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting || !title.trim() || !content.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Publishing…' : 'Publish'}
            </button>
            <span className="text-xs text-gray-400">Markdown is supported</span>
          </div>
        </form>
      </main>
    </div>
  )
}
