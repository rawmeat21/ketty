import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function ProfileHeader({ profile }) {
  const { user } = useAuth()

  const isOwnProfile = user?.username === profile.username

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
      <div className="flex items-start gap-5">
        <div className="flex-shrink-0">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-indigo-500"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center ring-2 ring-indigo-500">
              <span className="text-white text-2xl font-bold">
                {profile.displayName?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-white text-xl font-bold leading-tight">
                {profile.displayName}
              </h1>
              <p className="text-gray-400 text-sm">@{profile.username}</p>
            </div>

            {isOwnProfile && (
              <Link
                to="/settings"
                className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 rounded-full transition"
              >
                Edit profile
              </Link>
            )}
          </div>

          {profile.status && (
            <p className="text-indigo-300 text-sm mt-2 italic">"{profile.status}"</p>
          )}

          {profile.bio && (
            <p className="text-gray-300 text-sm mt-2 leading-relaxed">{profile.bio}</p>
          )}

          {profile.links && profile.links.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.links.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full transition"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}