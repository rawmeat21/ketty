export default function HobbyTabs({ hobbies, activeTab, onTabChange }) {
    
  const tabs = [
    { slug: 'personal', name: 'Personal' },
    ...hobbies.map(h => ({ slug: h.slug, name: h.name }))
  ]

  return (
    <div className="relative">
      <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-1">
        {}

        {tabs.map(tab => (
          <button
            key={tab.slug}
            onClick={() => onTabChange(tab.slug)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap
              ${activeTab === tab.slug
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  )
}