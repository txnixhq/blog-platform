# Build Plan — Blog Platform

## Phase 1: Skeleton + Deploy (target: 25 min)
- [ ] FastAPI app with /health route
- [ ] React + Vite placeholder homepage
- [ ] Supabase project connected, env vars set
- [ ] Deployed to Railway with live URL
- [ ] vite.config.js has allowedHosts set

## Phase 2: Auth + Posts (target: 40 min)
- [ ] Supabase tables: posts, comments
- [ ] Auth: signup, login, logout
- [ ] API: GET /posts, POST /posts, GET /posts/:id, DELETE /posts/:id
- [ ] Frontend: post list, post detail, create post with markdown editor
- [ ] Markdown rendering in post detail view

## Phase 3: Comments (target: 20 min)
- [ ] API: GET /comments/:post_id, POST /comments, DELETE /comments/:id
- [ ] Frontend: comment list + add comment on post detail page
- [ ] Only show delete button on own content

## Phase 4: Polish (remaining time)
- [ ] Loading states, error messages
- [ ] Empty states
- [ ] Responsive layout
- [ ] Author name on posts and comments

## Deferred if out of time
- Rich markdown editor (use simple textarea)
- Image uploads
- Post editing
- Likes/reactions

## Supabase tables needed
posts: id, user_id, title, content (markdown), created_at
comments: id, post_id, user_id, content, created_at
Both need RLS: users can only delete their own rows