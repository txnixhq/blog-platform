import { useState, useEffect } from 'react'
import { API_URL } from '../config'

function parseMarkdown(content) {
  return window.marked ? window.marked.parse(content ?? '') : content ?? ''
}

export default function PostDetail({ postId, token, user, onBack }) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}/posts/${postId}`)
      .then((r) => r.json())
      .then(({ data }) => setPost(data))
      .finally(() => setLoading(false))
  }, [postId])

  async function handleDeletePost() {
    if (!confirm('Delete this post and all its comments?')) return
    await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    onBack()
  }

  async function handleAddComment(e) {
    e.preventDefault()
    if (!commentText.trim()) return
    setSubmitting(true)
    try {
      const resp = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ post_id: postId, content: commentText }),
      })
      const { data } = await resp.json()
      if (data) {
        setPost((p) => ({ ...p, comments: [...(p.comments ?? []), data] }))
        setCommentText('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteComment(commentId) {
    await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setPost((p) => ({ ...p, comments: p.comments.filter((c) => c.id !== commentId) }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Post not found.</p>
      </div>
    )
  }

  const comments = post.comments ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="text-blue-600 hover:underline text-sm">
          ← All posts
        </button>
        {post.user_id === user.id && (
          <button
            onClick={handleDeletePost}
            className="text-sm text-red-400 hover:text-red-600"
          >
            Delete post
          </button>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{post.title}</h1>
        <p className="text-xs text-gray-400 mb-8">
          {new Date(post.created_at).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>

        <div
          className="prose text-gray-800 mb-14"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
        />

        <hr className="border-gray-200 mb-8" />

        <h2 className="text-base font-semibold text-gray-900 mb-4">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </h2>

        <div className="space-y-3 mb-6">
          {comments.length === 0 && (
            <p className="text-gray-400 text-sm">No comments yet.</p>
          )}
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-gray-800 leading-relaxed">{comment.content}</p>
                {user && comment.user_id === user.id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-xs text-red-400 hover:text-red-600 shrink-0"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(comment.created_at).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment} className="space-y-2">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment…"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Posting…' : 'Post comment'}
          </button>
        </form>
      </main>
    </div>
  )
}
