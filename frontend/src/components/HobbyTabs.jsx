export default function HobbyTabs({ hobbies, activeTab, onTabChange }) {
  const tabs = [
    { slug: 'personal', name: 'Personal' },
    ...hobbies.map(h => ({ slug: h.slug, name: h.name }))
  ]

  return (
    <div className="flex overflow-x-auto scrollbar-hide gap-2 py-1">
      {tabs.map(tab => (
        <button
          key={tab.slug}
          onClick={() => onTabChange(tab.slug)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap border
            ${activeTab === tab.slug
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
            }`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  )
}