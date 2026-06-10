export default function EntryCard({ entry }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition shadow-lg">

      {entry.coverImageUrl && (
        <img
          src={entry.coverImageUrl}
          alt={entry.title}
          className="w-full h-52 object-cover"
        />
      )}

      <div className="p-5">
        <h3 className="text-white font-semibold text-base leading-snug">
          {entry.title}
        </h3>

        {entry.extraInfo && (
          <p className="text-indigo-400 text-xs font-medium mt-1 uppercase tracking-wide">
            {entry.extraInfo}
          </p>
        )}

        {entry.note && (
          <p className="text-zinc-400 text-sm mt-2 leading-relaxed border-t border-zinc-800 pt-3">
            {entry.note}
          </p>
        )}
      </div>
    </div>
  )
}