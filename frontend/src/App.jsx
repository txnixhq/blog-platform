import { useState } from 'react'
import AuthForm from './components/AuthForm'
import PostList from './components/PostList'
import PostDetail from './components/PostDetail'
import CreatePost from './components/CreatePost'

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [view, setView] = useState('list')
  const [selectedPostId, setSelectedPostId] = useState(null)

  function handleLogin(session) {
    const { access_token, user: u } = session
    const userInfo = { id: u.id, email: u.email }
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(userInfo))
    setToken(access_token)
    setUser(userInfo)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setView('list')
    setSelectedPostId(null)
  }

  function openPost(id) {
    setSelectedPostId(id)
    setView('detail')
  }

  if (!token) return <AuthForm onLogin={handleLogin} />

  if (view === 'create') {
    return (
      <CreatePost
        token={token}
        onCreated={(post) => openPost(post.id)}
        onCancel={() => setView('list')}
      />
    )
  }

  if (view === 'detail' && selectedPostId) {
    return (
      <PostDetail
        postId={selectedPostId}
        token={token}
        user={user}
        onBack={() => setView('list')}
      />
    )
  }

  return (
    <PostList
      token={token}
      user={user}
      onNewPost={() => setView('create')}
      onOpenPost={openPost}
      onLogout={handleLogout}
    />
  )
}
