import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function PostCard({ post, onLikeToggle }) {
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

  const handleComment = async e => {
    e.preventDefault()
    if (!commentText.trim()) return

    setSubmitting(true)
    try {
      await api.post(`/api/posts/${post.id}/comments`, {
        content: commentText
      })
      setCommentText('')
      window.location.reload()
    } catch (err) {
      console.error('Failed to post comment', err)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg">

      {}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full object-cover max-h-96"
        />
      )}

      <div className="p-5">

        {}
        {post.hobbyName && (
          <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">
            {post.hobbyName}
          </span>
        )}

        {}
        <p className="text-white mt-3 leading-relaxed">{post.content}</p>

        {}
        <p className="text-gray-500 text-xs mt-2">{formatDate(post.createdAt)}</p>

        {}
        <div className="flex items-center gap-5 mt-4 pt-4 border-t border-gray-800">

          {}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm transition ${
              post.likedByCurrentUser
                ? 'text-red-400'
                : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <span>{post.likedByCurrentUser ? '♥' : '♡'}</span>
            <span>{post.likeCount}</span>
          </button>

          {}
          <button
            onClick={() => setShowComments(prev => !prev)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition"
          >
            <span>💬</span>
            <span>{post.commentCount}</span>
          </button>

        </div>

        {}
        {showComments && (
          <div className="mt-4 space-y-3">

            {}
            {post.comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}

            {}
            {user && (
              <form onSubmit={handleComment} className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-sm font-medium px-4 rounded-lg transition"
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
    <div className={`${depth > 0 ? 'ml-6 border-l border-gray-800 pl-3' : ''}`}>
      <div className="bg-gray-800 rounded-xl px-3 py-2.5">
        <span className="text-indigo-400 text-sm font-medium">
          {comment.displayName || comment.username}
        </span>
        <p className="text-gray-300 text-sm mt-0.5">{comment.content}</p>
      </div>

      {}
      {comment.replies && comment.replies.map(reply => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  )
}