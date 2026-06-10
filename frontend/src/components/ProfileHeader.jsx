import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function ProfileHeader({ profile }) {
  const { user } = useAuth()
  const isOwnProfile = user?.username === profile.username

  return (
    <div className="rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl">

      {/* Banner */}
      <div className="h-28 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
      {/* A gradient banner gives the profile visual richness without
          needing an actual uploaded image. We'll make it customisable later. */}

      <div className="px-6 pb-6">

        {/* Avatar row — overlaps the banner */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div>
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-zinc-900 shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center ring-4 ring-zinc-900 shadow-xl">
                <span className="text-white text-3xl font-bold">
                  {profile.displayName?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {isOwnProfile && (
            <Link
              to="/settings"
              className="text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl transition border border-zinc-700"
            >
              Edit profile
            </Link>
          )}
        </div>

        {/* Name and username */}
        <h1 className="text-white text-xl font-bold leading-tight">
          {profile.displayName}
        </h1>
        <p className="text-zinc-500 text-sm">@{profile.username}</p>

        {/* Status */}
        {profile.status && (
          <p className="text-indigo-400 text-sm mt-3 font-medium">
            {profile.status}
          </p>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Links */}
        {profile.links && profile.links.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.links.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}