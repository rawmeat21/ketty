import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import ProfileHeader from '../components/ProfileHeader'
import HobbyTabs from '../components/HobbyTabs'
import EntryCard from '../components/EntryCard'
import PostCard from '../components/PostCard'

export default function Profile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [hobbies, setHobbies] = useState([])
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('personal')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [username])

  const fetchProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const [profileRes, hobbiesRes, postsRes] = await Promise.all([
        api.get(`/api/profile/${username}`),
        api.get(`/api/hobbies/user/${username}`),
        api.get(`/api/posts/user/${username}`)
      ])
      setProfile(profileRes.data)
      setHobbies(hobbiesRes.data)
      setPosts(postsRes.data)
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLikeToggle = (postId, newLikeCount) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? {
            ...post,
            likeCount: newLikeCount,
            likedByCurrentUser: !post.likedByCurrentUser
          }
        : post
    ))
  }

  const getTabContent = () => {
    if (activeTab === 'personal') {
      const personalPosts = posts.filter(p => p.hobbyName === null)
      return { entries: [], posts: personalPosts }
    }

    const hobby = hobbies.find(h => h.slug === activeTab)
    if (!hobby) return { entries: [], posts: [] }

    const hobbyPosts = posts.filter(p => p.hobbyId === hobby.id)

    return { entries: hobby.entries, posts: hobbyPosts }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-red-400">{error || 'Profile not found'}</p>
      </div>
    )
  }

  const { entries, posts: tabPosts } = getTabContent()

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-xl mx-auto space-y-5">

        <ProfileHeader profile={profile} />

        <HobbyTabs
          hobbies={hobbies}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="space-y-4">

          {entries.length > 0 && (
            <div className="space-y-4">
              {entries.map(entry => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}

          {tabPosts.length > 0 && (
            <div className="space-y-4">
              {tabPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLikeToggle={handleLikeToggle}
                />
              ))}
            </div>
          )}

          {entries.length === 0 && tabPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nothing here yet</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}