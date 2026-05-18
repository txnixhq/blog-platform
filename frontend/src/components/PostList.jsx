import { useState, useEffect } from 'react'
import { API_URL } from '../config'

export default function PostList({ user, onNewPost, onOpenPost, onLogout }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((r) => r.json())
      .then(({ data }) => setPosts(data ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Blog Platform</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user.email}</span>
          <button
            onClick={onNewPost}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            New post
          </button>
          <button
            onClick={onLogout}
            className="text-sm text-gray-400 hover:text-gray-700"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {loading && (
          <p className="text-center text-gray-400 text-sm">Loading…</p>
        )}
        {!loading && posts.length === 0 && (
          <p className="text-center text-gray-400 text-sm">No posts yet. Write the first one!</p>
        )}
        <div className="space-y-3">
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => onOpenPost(post.id)}
              className="w-full bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <h2 className="text-base font-semibold text-gray-900">{post.title}</h2>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(post.created_at).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </p>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
