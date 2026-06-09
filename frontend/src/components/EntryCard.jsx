export default function EntryCard({ entry }) {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
      {}

      {entry.coverImageUrl && (
        <img
          src={entry.coverImageUrl}
          alt={entry.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4">
        <h3 className="text-white font-semibold text-lg leading-tight">
          {entry.title}
        </h3>

        {entry.extraInfo && (
          <p className="text-indigo-400 text-sm mt-1">{entry.extraInfo}</p>
        )}

        {entry.note && (
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">{entry.note}</p>
        )}
      </div>
    </div>
  )
}