import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function PostCard({ post, onLikeToggle, onComment  }) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleLike = async () => {
    if (!user) return
    try {
      const response = await api.post(`/api/posts/${post.id}/like`)
      onLikeToggle(post.id, response.data)
    } catch (err) {
      console.error('Failed to toggle like', err)
    }
  }

  // const handleComment = async e => {
  //   e.preventDefault()
  //   if (!commentText.trim()) return
  //   setSubmitting(true)
  //   try {
  //     await api.post(`/api/posts/${post.id}/comments`, { content: commentText })
  //     setCommentText('')
  //     window.location.reload()
  //   } catch (err) {
  //     console.error('Failed to post comment', err)
  //   } finally {
  //     setSubmitting(false)
  //   }
  // }
  const handleComment = async e => {
      e.preventDefault()
      if (!commentText.trim()) return
      setSubmitting(true)
      try {
        await api.post(`/api/posts/${post.id}/comments`, { content: commentText })
        setCommentText('')
        onComment()
        // Call the parent's refresh function instead of reloading the page.
        // The parent will refetch all posts and update the state cleanly.
      } catch (err) {
        console.error('Failed to post comment', err)
      } finally {
        setSubmitting(false)
      }
    }
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition shadow-lg">

      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post" className="w-full object-cover max-h-96" />
      )}

      <div className="p-5">

        {/* Hobby tag */}
        {post.hobbyName && (
          <span className="inline-block text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-lg mb-3">
            {post.hobbyName}
          </span>
        )}

        {/* Content */}
        <p className="text-zinc-100 text-sm leading-relaxed">{post.content}</p>

        {/* Date */}
        <p className="text-zinc-600 text-xs mt-2">{formatDate(post.createdAt)}</p>

        {/* Action row */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-800">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm font-medium transition ${
              post.likedByCurrentUser
                ? 'text-rose-400'
                : 'text-zinc-500 hover:text-rose-400'
            }`}
          >
            {post.likedByCurrentUser ? '♥' : '♡'} {post.likeCount}
          </button>

          <button
            onClick={() => setShowComments(prev => !prev)}
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition"
          >
            💬 {post.commentCount}
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-4 space-y-2">

            {post.comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}

            {user && (
              <form onSubmit={handleComment} className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold px-4 rounded-xl transition"
                >
                  Post
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  )
}

function CommentItem({ comment, depth = 0 }) {
  return (
    <div className={depth > 0 ? 'ml-5 border-l-2 border-zinc-800 pl-3' : ''}>
      <div className="bg-zinc-800/60 rounded-xl px-3.5 py-2.5">
        <span className="text-indigo-400 text-xs font-semibold">
          {comment.displayName || comment.username}
        </span>
        <p className="text-zinc-300 text-sm mt-0.5 leading-relaxed">{comment.content}</p>
      </div>
      {comment.replies?.map(reply => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  )
}