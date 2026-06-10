import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronDown, ChevronUp, Plus, Music2, Gamepad2, Tv2, BookOpen, Film,
  Search, Loader2, Check, Heart, MessageCircle, Share2,
  Home, Compass, PlusSquare, Bell, User, Settings, X,
  Edit3, Lock, Image, ArrowLeft, Trash2
} from "lucide-react";

// ── Google Fonts ────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

// ── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:         "#0a0a0a",
  surface:    "#111111",
  surface2:   "#181818",
  border:     "#1e1e1e",
  border2:    "#2a2a2a",
  text:       "#eeeeee",
  muted:      "#666666",
  muted2:     "#888888",
  violet:     "#7c3aed",
  violetDim:  "#4c1d95",
  violetFaint:"#1e1040",
  violetGlow: "#a78bfa",
  maroon:     "#7f1d1d",
  maroonBright:"#b91c1c",
  maroonFaint:"#2d0a0a",
  maroonGlow: "#f87171",
};
const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
const FONT_BODY    = "'Inter', 'Segoe UI', sans-serif";

// ── Section types ────────────────────────────────────────────────────────────
const SECTION_TYPES = [
  { id: "music",  label: "Music",  icon: Music2,   accent: C.violetGlow },
  { id: "games",  label: "Games",  icon: Gamepad2, accent: C.maroonGlow },
  { id: "anime",  label: "Anime",  icon: Tv2,      accent: "#60a5fa"    },
  { id: "books",  label: "Books",  icon: BookOpen, accent: "#34d399"    },
  { id: "movies", label: "Movies", icon: Film,     accent: "#fbbf24"    },
];

// ── Mock user ────────────────────────────────────────────────────────────────
// TODO: GET /api/profile/{username}
const MOCK_USER = {
  id: "u_123",
  username: "alex_builds",
  displayName: null,           // null → fall back to username in UI
  bio: "Building things, making music, folding paper. Always learning.",
  avatarUrl: "https://placehold.co/160x160/1e1040/a78bfa?text=A",
  bannerUrl: "https://placehold.co/1200x340/0a0a0a/1e1040?text=.",
};

// ── Mock sections ─────────────────────────────────────────────────────────────
// TODO: GET /api/hobbies/user/{username}  (type field maps to hobby category)
const INITIAL_SECTIONS = [
  {
    id: "sec-music", type: "music",
    data: {
      spotifyConnected: false,
      topTracks: [
        { title: "Bohemian Rhapsody",   artist: "Queen",            albumArt: "https://placehold.co/72x72/1e1040/a78bfa?text=Q"  },
        { title: "Clair de Lune",       artist: "Debussy",          albumArt: "https://placehold.co/72x72/1e1040/a78bfa?text=D"  },
        { title: "Redbone",             artist: "Childish Gambino", albumArt: "https://placehold.co/72x72/2d0a0a/f87171?text=CG" },
        { title: "Gravity",             artist: "John Mayer",       albumArt: "https://placehold.co/72x72/1e1040/a78bfa?text=JM" },
        { title: "Stairway to Heaven",  artist: "Led Zeppelin",     albumArt: "https://placehold.co/72x72/2d0a0a/f87171?text=LZ" },
      ],
      topArtists: [
        { name: "Queen",            image: "https://placehold.co/96x96/1e1040/a78bfa?text=Q"  },
        { name: "John Coltrane",    image: "https://placehold.co/96x96/2d0a0a/f87171?text=JC" },
        { name: "Nujabes",          image: "https://placehold.co/96x96/1e1040/a78bfa?text=N"  },
        { name: "Childish Gambino", image: "https://placehold.co/96x96/2d0a0a/f87171?text=CG" },
      ],
      favGenres: ["Progressive Rock", "Jazz", "Lo-fi Hip Hop", "Classical"],
    },
  },
  {
    id: "sec-games", type: "games",
    data: {
      topGames: [
        { title: "Hollow Knight",  genre: "Metroidvania", hoursPlayed: 120, rating: "9/10",  thoughts: "Peak indie gaming.",     icon: "https://placehold.co/80x80/1e1040/a78bfa?text=HK" },
        { title: "Disco Elysium",  genre: "RPG",          hoursPlayed: 80,  rating: "10/10", thoughts: "Nothing like it.",       icon: "https://placehold.co/80x80/2d0a0a/f87171?text=DE" },
        { title: "Outer Wilds",    genre: "Adventure",    hoursPlayed: 22,  rating: "10/10", thoughts: "Emotional gut punch.",   icon: "https://placehold.co/80x80/1e1040/a78bfa?text=OW" },
        { title: "Celeste",        genre: "Platformer",   hoursPlayed: 40,  rating: "9/10",  thoughts: "Brilliant level design.",icon: "https://placehold.co/80x80/2d0a0a/f87171?text=C"  },
        { title: "Hades",          genre: "Roguelite",    hoursPlayed: 200, rating: "9/10",  thoughts: "Can't stop.",            icon: "https://placehold.co/80x80/1e1040/a78bfa?text=H"  },
      ],
      totalHours: 1240,
      favGenre: "Metroidvania",
    },
  },
  {
    id: "sec-anime", type: "anime",
    data: {
      topAnime: [
        { title: "Ping Pong The Animation", genre: "Sports",       episodes: 11, status: "Completed", thoughts: "Masterpiece of expression.", cover: "https://placehold.co/80x80/1e1040/a78bfa?text=PP" },
        { title: "Mushishi",                genre: "Slice of Life", episodes: 26, status: "Completed", thoughts: "Deeply calming.",           cover: "https://placehold.co/80x80/2d0a0a/f87171?text=M"  },
        { title: "Vinland Saga",            genre: "Historical",   episodes: 48, status: "Completed", thoughts: "Stunning character arcs.",   cover: "https://placehold.co/80x80/1e1040/a78bfa?text=VS" },
        { title: "Monster",                 genre: "Thriller",     episodes: 74, status: "Completed", thoughts: "Slow burn perfection.",      cover: "https://placehold.co/80x80/2d0a0a/f87171?text=Mo" },
        { title: "Dungeon Meshi",           genre: "Fantasy",      episodes: 24, status: "Watching",  thoughts: "Best seasonal in years.",    cover: "https://placehold.co/80x80/1e1040/a78bfa?text=DM" },
      ],
      favGenre: "Slice of Life",
    },
  },
];

// ── Mock post tabs ────────────────────────────────────────────────────────────
// TODO: GET /api/posts/user/{username}  (distinct hobby categories)
const INITIAL_POST_TABS = [
  { id: "personal", label: "Personal" },
  { id: "music",    label: "Music"    },
  { id: "origami",  label: "Origami"  },
  { id: "painting", label: "Painting" },
  { id: "blogs",    label: "Blogs"    },
];

// ── Mock post fetch ───────────────────────────────────────────────────────────
// TODO: GET /api/posts/user/{username}/personal  or  /api/posts/user/{username}/hobby/{hobbyId}
function fetchMockPosts(tabId, page) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = Array.from({ length: 6 }, (_, i) => ({
        id: `${tabId}-p${page}-${i}`,
        author: MOCK_USER,
        text: `Sharing something from my ${tabId} journey — post ${(page - 1) * 6 + i + 1}.`,
        images: i % 3 === 0 ? [`https://placehold.co/600x380/111/1e1040?text=Post+${(page-1)*6+i+1}`] : [],
        likes: Math.floor(Math.random() * 300),
        comments: Math.floor(Math.random() * 40),
        liked: false,
        createdAt: `${i + 1}h ago`,
      }));
      resolve({ posts, hasMore: page < 3 });
    }, 600);
  });
}

// ── Auth ──────────────────────────────────────────────────────────────────────
const isOwnProfile = true;

// ── Helpers ───────────────────────────────────────────────────────────────────
const displayLabel = (user) => user.displayName || user.username;

// ═══════════════════════════════════════════════════════════════════════════════
// MUSIC SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function MusicSection({ data }) {
  return (
    <div style={ss.wrap}>
      {isOwnProfile && (
        <button style={data.spotifyConnected ? ss.spotifyOn : ss.spotifyOff}
          onClick={() => { /* TODO: POST /api/integrations/spotify/connect */ }}>
          <Music2 size={15} />
          {data.spotifyConnected ? "Synced with Spotify" : "Connect Spotify to auto-sync"}
        </button>
      )}

      <p style={ss.blockLabel}>TOP TRACKS</p>
      <div style={ss.trackList}>
        {data.topTracks.map((track, i) => (
          <div key={i} style={ss.trackCard}>
            <span style={ss.trackNum}>{i + 1}</span>
            <img src={track.albumArt} alt="" style={ss.trackArt} />
            <div style={ss.trackInfo}>
              <span style={ss.trackTitle}>{track.title}</span>
              <span style={ss.trackArtist}>{track.artist}</span>
            </div>
          </div>
        ))}
      </div>

      <p style={ss.blockLabel}>TOP ARTISTS</p>
      <div style={ss.artistGrid}>
        {data.topArtists.map((artist, i) => (
          <div key={i} style={ss.artistCard}>
            <img src={artist.image} alt={artist.name} style={ss.artistImg} />
            <span style={ss.artistName}>{artist.name}</span>
          </div>
        ))}
      </div>

      <p style={ss.blockLabel}>FAVOURITE GENRES</p>
      <div style={ss.chipRow}>
        {data.favGenres.map((g) => (
          <span key={g} style={ss.chip}>{g}</span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAMES SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function GamesSection({ data }) {
  return (
    <div style={ss.wrap}>
      <div style={ss.statsRow}>
        <div style={ss.statPill}>
          <span style={ss.statVal}>{data.totalHours}h</span>
          <span style={ss.statKey}>total played</span>
        </div>
        <div style={ss.statPill}>
          <span style={ss.statVal}>{data.favGenre}</span>
          <span style={ss.statKey}>fav genre</span>
        </div>
      </div>
      <p style={ss.blockLabel}>TOP GAMES</p>
      <div style={ss.cardList}>
        {data.topGames.map((game, i) => (
          <div key={i} style={ss.mediaCard}>
            <div style={ss.mediaRank}>{i + 1}</div>
            <img src={game.icon} alt={game.title} style={ss.mediaIcon} />
            <div style={ss.mediaInfo}>
              <span style={ss.mediaTitle}>{game.title}</span>
              <span style={ss.mediaSub}>{game.genre} · {game.hoursPlayed}h · {game.rating}</span>
              <span style={ss.mediaThoughts}>{game.thoughts}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIME SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function AnimeSection({ data }) {
  return (
    <div style={ss.wrap}>
      <div style={ss.statsRow}>
        <div style={ss.statPill}>
          <span style={ss.statVal}>{data.favGenre}</span>
          <span style={ss.statKey}>fav genre</span>
        </div>
      </div>
      <p style={ss.blockLabel}>TOP ANIME</p>
      <div style={ss.cardList}>
        {data.topAnime.map((anime, i) => (
          <div key={i} style={ss.mediaCard}>
            <div style={ss.mediaRank}>{i + 1}</div>
            <img src={anime.cover} alt={anime.title} style={{ ...ss.mediaIcon, borderRadius: 6 }} />
            <div style={ss.mediaInfo}>
              <span style={ss.mediaTitle}>{anime.title}</span>
              <span style={ss.mediaSub}>
                {anime.genre} · {anime.episodes} ep ·{" "}
                <span style={{ color: anime.status === "Watching" ? "#34d399" : C.muted }}>
                  {anime.status}
                </span>
              </span>
              <span style={ss.mediaThoughts}>{anime.thoughts}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Generic fallback for user-added sections without a dedicated component
function GenericSection({ data, type }) {
  return (
    <div style={ss.wrap}>
      {data.items && data.items.length > 0 ? (
        <div style={ss.cardList}>
          {data.items.map((item, i) => (
            <div key={i} style={ss.mediaCard}>
              <div style={ss.mediaRank}>{i + 1}</div>
              {item.image && <img src={item.image} alt={item.title} style={ss.mediaIcon} />}
              <div style={ss.mediaInfo}>
                <span style={ss.mediaTitle}>{item.title}</span>
                {item.subtitle && <span style={ss.mediaSub}>{item.subtitle}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: C.muted, fontSize: 14, padding: "8px 0" }}>
          No entries yet. Edit this section to add content.
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION SHELL (collapsible)
// ═══════════════════════════════════════════════════════════════════════════════
function SpecialSectionShell({ section, children }) {
  const [open, setOpen] = useState(false);
  const typeInfo = SECTION_TYPES.find(t => t.id === section.type);
  const TypeIcon = typeInfo?.icon;
  const accent = typeInfo?.accent || C.violetGlow;

  return (
    <div style={shellSt.wrap}>
      <button style={shellSt.header} onClick={() => setOpen(o => !o)}>
        <div style={shellSt.headerLeft}>
          {TypeIcon && <TypeIcon size={17} color={accent} />}
          <span style={{ ...shellSt.label, color: open ? accent : C.text }}>
            {section.label || (section.type.charAt(0).toUpperCase() + section.type.slice(1))}
          </span>
        </div>
        {open
          ? <ChevronUp size={16} color={C.muted2} />
          : <ChevronDown size={16} color={C.muted2} />}
      </button>
      {open && <div style={shellSt.body}>{children}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD SECTION MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function AddSectionModal({ onClose, onAdd, existingSectionTypes }) {
  const [step, setStep]               = useState("pick");
  const [selectedType, setSelectedType] = useState(null);
  const [query, setQuery]             = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching]     = useState(false);
  const [picked, setPicked]           = useState([]);

  // Filter out already-added types so no duplicates
  const availableTypes = SECTION_TYPES.filter(t => !existingSectionTypes.includes(t.id));

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setStep("form");
    setPicked([]);
    setQuery("");
    setSearchResults([]);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearchResults([]);
    try {
      // TODO: wire to real endpoints
      // /api/search/games?q=  /api/search/anime?q=  /api/search/music?q=  etc.
      await new Promise(r => setTimeout(r, 500));
      const colors = [C.violetFaint, C.maroonFaint, "#0f1f0f"];
      const texts  = [C.violetGlow,  C.maroonGlow,  "#34d399"];
      setSearchResults([
        { id: "r1", title: `${query} — Result 1`, subtitle: "2023",  image: `https://placehold.co/64x64/${colors[0].replace("#","")}/aaa?text=1` },
        { id: "r2", title: `${query} — Result 2`, subtitle: "2022",  image: `https://placehold.co/64x64/${colors[1].replace("#","")}/aaa?text=2` },
        { id: "r3", title: `${query} — Result 3`, subtitle: "2021",  image: `https://placehold.co/64x64/${colors[2].replace("#","")}/aaa?text=3` },
      ]);
    } finally {
      setSearching(false);
    }
  };

  const togglePick = (item) => {
    setPicked(prev =>
      prev.find(p => p.id === item.id)
        ? prev.filter(p => p.id !== item.id)
        : [...prev, item]
    );
  };

  const handleSave = () => {
    if (!selectedType || picked.length === 0) return;
    // TODO: POST /api/hobbies  then POST /api/hobbies/{hobbyId}/entries per item
    onAdd({
      id:   `sec-${selectedType}-${Date.now()}`,
      type: selectedType,
      label: selectedType.charAt(0).toUpperCase() + selectedType.slice(1),
      data: { items: picked.map((item, i) => ({ ...item, rank: i + 1 })) },
    });
    onClose();
  };

  return (
    <div style={md.overlay} onClick={onClose}>
      <div style={md.box} onClick={e => e.stopPropagation()}>
        <div style={md.topBar}>
          {step === "form"
            ? <button style={md.iconBtn} onClick={() => setStep("pick")}><ArrowLeft size={18} /></button>
            : <div style={{ width: 32 }} />}
          <span style={md.title}>{step === "pick" ? "Add a section" : `Add ${selectedType}`}</span>
          <button style={md.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {step === "pick" ? (
          <>
            <p style={md.sub}>
              {availableTypes.length === 0
                ? "You've added all available section types."
                : "Choose what you want to showcase on your profile."}
            </p>
            <div style={md.typeGrid}>
              {availableTypes.map(({ id, label, icon: Icon, accent }) => (
                <button key={id} style={md.typeCard} onClick={() => handleTypeSelect(id)}>
                  <div style={{ ...md.typeIconWrap, background: accent + "22", border: `1px solid ${accent}44` }}>
                    <Icon size={22} color={accent} />
                  </div>
                  <span style={md.typeLabel}>{label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {selectedType === "music" && (
              <button style={md.spotifyPill}
                onClick={() => { /* TODO: POST /api/integrations/spotify/connect */ }}>
                <Music2 size={14} /> Import from Spotify instead
              </button>
            )}
            <div style={md.searchRow}>
              <input
                style={md.searchInput}
                placeholder={`Search ${selectedType}…`}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
              <button style={md.searchBtn} onClick={handleSearch}>
                {searching ? <Loader2 size={16} /> : <Search size={16} />}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div style={md.results}>
                {searchResults.map(item => {
                  const isSelected = !!picked.find(p => p.id === item.id);
                  return (
                    <button key={item.id}
                      style={{ ...md.resultRow, background: isSelected ? C.violetFaint : C.surface2, borderColor: isSelected ? C.violet : C.border }}
                      onClick={() => togglePick(item)}>
                      <img src={item.image} alt="" style={md.resultImg} />
                      <div style={md.resultText}>
                        <span style={md.resultTitle}>{item.title}</span>
                        <span style={md.resultSub}>{item.subtitle}</span>
                      </div>
                      {isSelected && <Check size={16} color={C.violetGlow} />}
                    </button>
                  );
                })}
              </div>
            )}

            {picked.length > 0 && (
              <div style={md.pickedBar}>
                <span style={md.pickedCount}>{picked.length} selected</span>
                <button style={md.saveBtn} onClick={handleSave}>Save section</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD POST TAB MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function AddTabModal({ onClose, onAdd }) {
  const [name, setName] = useState("");

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    // TODO: POST /api/hobbies  { name: trimmed }  then use hobbyId for tab
    onAdd({ id: trimmed.toLowerCase().replace(/\s+/g, "-"), label: trimmed });
    onClose();
  };

  return (
    <div style={md.overlay} onClick={onClose}>
      <div style={{ ...md.box, maxHeight: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={md.topBar}>
          <div style={{ width: 32 }} />
          <span style={md.title}>New post section</span>
          <button style={md.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <p style={md.sub}>Give your section a name — e.g. Origami, Journaling, Photography.</p>
        <input
          style={{ ...md.searchInput, marginBottom: 16, width: "100%", boxSizing: "border-box" }}
          placeholder="Section name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSave()}
          autoFocus
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button style={md.saveBtn} onClick={handleSave}>Create</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EDIT PROFILE MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function EditProfileModal({ user, onClose, onSave }) {
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [bio, setBio] = useState(user.bio || "");

  const handleSave = () => {
    // TODO: PUT /api/profile/me  { displayName, bio }
    onSave({ ...user, displayName: displayName || null, bio });
    onClose();
  };

  return (
    <div style={md.overlay} onClick={onClose}>
      <div style={md.box} onClick={e => e.stopPropagation()}>
        <div style={md.topBar}>
          <div style={{ width: 32 }} />
          <span style={md.title}>Edit profile</span>
          <button style={md.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {/* Avatar */}
        <div style={ep.section}>
          <p style={ep.label}>Profile picture</p>
          <div style={ep.avatarRow}>
            <img src={user.avatarUrl} alt="" style={ep.previewAvatar} />
            <button style={ep.uploadBtn}>
              <Image size={14} /> Upload new photo
              {/* TODO: POST /api/upload/image  then PUT /api/profile/me { avatarUrl } */}
            </button>
          </div>
        </div>

        {/* Banner */}
        <div style={ep.section}>
          <p style={ep.label}>Banner / cover image</p>
          <div style={ep.bannerPreview}>
            <img src={user.bannerUrl} alt="" style={ep.bannerImg} />
          </div>
          <button style={{ ...ep.uploadBtn, marginTop: 8 }}>
            <Image size={14} /> Upload new banner
            {/* TODO: POST /api/upload/image  then PUT /api/profile/me { bannerUrl } */}
          </button>
        </div>

        {/* Display name */}
        <div style={ep.section}>
          <p style={ep.label}>Display name</p>
          <input
            style={ep.input}
            placeholder={`Defaults to @${user.username}`}
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
        </div>

        {/* Bio */}
        <div style={ep.section}>
          <p style={ep.label}>Bio</p>
          <textarea
            style={{ ...ep.input, height: 80, resize: "vertical" }}
            placeholder="Tell people about yourself"
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8 }}>
          <button style={ep.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={md.saveBtn} onClick={handleSave}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function SettingsModal({ onClose }) {
  const [activeGroup, setActiveGroup] = useState("account");

  const groups = [
    { id: "account",      label: "Account"       },
    { id: "privacy",      label: "Privacy"       },
    { id: "notifications",label: "Notifications" },
    { id: "appearance",   label: "Appearance"    },
    { id: "about",        label: "About"         },
  ];

  const renderGroup = () => {
    switch (activeGroup) {
      case "account":
        return (
          <div style={stg.group}>
            <SettingsRow icon={<Edit3 size={16} />}    label="Change display name"   />
            <SettingsRow icon={<Lock size={16} />}     label="Change password"        />
            <SettingsRow icon={<Image size={16} />}    label="Update avatar"          />
            <SettingsRow icon={<Image size={16} />}    label="Update banner"          />
            <SettingsRow icon={<Trash2 size={16} />}   label="Delete account"         danger />
          </div>
        );
      case "privacy":
        return (
          <div style={stg.group}>
            <SettingsToggle label="Public profile"        defaultOn />
            <SettingsToggle label="Show activity status"  defaultOn />
            <SettingsToggle label="Allow post shares"      defaultOn />
            <SettingsRow    icon={<X size={16} />} label="Blocked users" />
          </div>
        );
      case "notifications":
        return (
          <div style={stg.group}>
            <SettingsToggle label="Likes on posts"          defaultOn />
            <SettingsToggle label="Comments on posts"       defaultOn />
            <SettingsToggle label="New followers"           defaultOn />
            <SettingsToggle label="Email notifications"     defaultOn={false} />
          </div>
        );
      case "appearance":
        return (
          <div style={stg.group}>
            <SettingsToggle label="Compact post view"   defaultOn={false} />
            <SettingsToggle label="Reduce motion"       defaultOn={false} />
          </div>
        );
      case "about":
        return (
          <div style={stg.group}>
            <SettingsRow label="Privacy policy"  />
            <SettingsRow label="Terms of service" />
            <SettingsRow label="Version 0.1.0"   muted />
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={md.overlay} onClick={onClose}>
      <div style={{ ...md.box, maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
        <div style={md.topBar}>
          <div style={{ width: 32 }} />
          <span style={md.title}>Settings</span>
          <button style={md.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {/* Group tabs */}
        <div style={stg.tabs}>
          {groups.map(g => (
            <button key={g.id}
              style={{ ...stg.tab, ...(activeGroup === g.id ? stg.tabActive : {}) }}
              onClick={() => setActiveGroup(g.id)}>
              {g.label}
            </button>
          ))}
        </div>

        {renderGroup()}
      </div>
    </div>
  );
}

function SettingsRow({ icon, label, danger, muted }) {
  return (
    <div style={{ ...stg.row, color: danger ? C.maroonGlow : muted ? C.muted : C.text }}>
      {icon && <span style={{ color: danger ? C.maroonGlow : C.muted2 }}>{icon}</span>}
      <span style={stg.rowLabel}>{label}</span>
      {!muted && <ChevronDown size={14} color={C.muted} style={{ transform: "rotate(-90deg)" }} />}
    </div>
  );
}

function SettingsToggle({ label, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={stg.row}>
      <span style={stg.rowLabel}>{label}</span>
      <button
        style={{ ...stg.toggle, background: on ? C.violet : C.border2 }}
        onClick={() => setOn(o => !o)}>
        <div style={{ ...stg.toggleKnob, transform: on ? "translateX(18px)" : "translateX(2px)" }} />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST CARD
// ═══════════════════════════════════════════════════════════════════════════════
function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  const authorName = post.author.displayName || post.author.username;

  return (
    <div style={pc.wrap}>
      <div style={pc.meta}>
        <img src={post.author.avatarUrl} alt="" style={pc.avatar} />
        <div style={{ flex: 1 }}>
          <span style={pc.author}>{authorName}</span>
          <span style={pc.handle}>@{post.author.username}</span>
        </div>
        <span style={pc.time}>{post.createdAt}</span>
      </div>
      {post.text   && <p style={pc.text}>{post.text}</p>}
      {post.images.length > 0 && (
        <img src={post.images[0]} alt="" style={pc.img} />
      )}
      <div style={pc.actions}>
        <button
          style={{ ...pc.btn, color: liked ? C.maroonGlow : C.muted2 }}
          onClick={() => {
            setLiked(l => !l);
            setLikes(n => liked ? n - 1 : n + 1);
            // TODO: POST /api/posts/{postId}/like
          }}>
          <Heart size={17} fill={liked ? C.maroonGlow : "none"} />
          <span>{likes}</span>
        </button>
        <button style={pc.btn}>
          {/* TODO: open comments → POST /api/posts/{postId}/comments */}
          <MessageCircle size={17} />
          <span>{post.comments}</span>
        </button>
        <button style={pc.btn}>
          {/* TODO: share sheet */}
          <Share2 size={17} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST FEED (infinite scroll)
// ═══════════════════════════════════════════════════════════════════════════════
function PostFeed({ activeTab }) {
  const [posts, setPosts]     = useState([]);
  const [page, setPage]       = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef(null);

  useEffect(() => { setPosts([]); setPage(1); setHasMore(true); }, [activeTab]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const { posts: p, hasMore: m } = await fetchMockPosts(activeTab, page);
    setPosts(prev => [...prev, ...p]);
    setHasMore(m);
    setPage(n => n + 1);
    setLoading(false);
  }, [activeTab, page, loading, hasMore]);

  useEffect(() => { loadMore(); }, [activeTab]); // eslint-disable-line

  const sentinelRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) loadMore();
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  return (
    <div style={{ padding: "14px 16px" }}>
      {posts.map(p => <PostCard key={p.id} post={p} />)}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Loader2 size={18} color={C.muted} style={{ animation: "spin 1s linear infinite" }} />
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <p style={{ textAlign: "center", color: C.muted, fontSize: 13, padding: "16px 0" }}>
          All caught up.
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOTTOM NAV
// ═══════════════════════════════════════════════════════════════════════════════
function BottomNav({ active }) {
  const items = [
    { id: "feed",          label: "Feed",    Icon: Home       },
    { id: "explore",       label: "Explore", Icon: Compass    },
    { id: "post",          label: "Post",    Icon: PlusSquare },
    { id: "notifications", label: "Alerts",  Icon: Bell       },
    { id: "profile",       label: "Profile", Icon: User       },
  ];
  return (
    <nav style={nb.bar}>
      {items.map(({ id, label, Icon }) => {
        const isActive = active === id;
        const isPost   = id === "post";
        return (
          <button key={id}
            style={{
              ...nb.item,
              ...(isActive ? nb.active : {}),
              ...(isPost ? nb.postBtn : {}),
            }}
            onClick={() => { /* TODO: navigate */ }}>
            <Icon size={isPost ? 22 : 20} color={isPost ? "#fff" : isActive ? C.violetGlow : C.muted} />
            {!isPost && <span style={{ ...nb.label, color: isActive ? C.violetGlow : C.muted }}>{label}</span>}
          </button>
        );
      })}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function ProfilePage() {
  const [user, setUser]               = useState(MOCK_USER);
  const [sections, setSections]       = useState(INITIAL_SECTIONS);
  const [postTabs, setPostTabs]       = useState(INITIAL_POST_TABS);
  const [activeTab, setActiveTab]     = useState(INITIAL_POST_TABS[0].id);

  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddTab,     setShowAddTab]     = useState(false);
  const [showEditProfile,setShowEditProfile]= useState(false);
  const [showSettings,   setShowSettings]   = useState(false);

  const existingSectionTypes = sections.map(s => s.type);

  const renderSection = (s) => {
    switch (s.type) {
      case "music":  return <MusicSection  data={s.data} />;
      case "games":  return <GamesSection  data={s.data} />;
      case "anime":  return <AnimeSection  data={s.data} />;
      default:       return <GenericSection data={s.data} type={s.type} />;
    }
  };

  return (
    <div style={pg.page}>
      {/* Keyframe for spinner */}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Banner */}
      <div style={pg.banner}>
        <img src={user.bannerUrl} alt="" style={pg.bannerImg} />
        <div style={pg.bannerOverlay} />
      </div>

      {/* Avatar + settings cog */}
      <div style={pg.avatarRow}>
        <div style={pg.avatarWrap}>
          <img src={user.avatarUrl} alt="avatar" style={pg.avatar} />
        </div>
        {isOwnProfile && (
          <button style={pg.cogBtn} onClick={() => setShowSettings(true)} title="Settings">
            <Settings size={18} color={C.muted2} />
          </button>
        )}
      </div>

      {/* User info */}
      <div style={pg.userInfo}>
        <h2 style={pg.displayName}>{displayLabel(user)}</h2>
        <p style={pg.handle}>@{user.username}</p>
        <p style={pg.bio}>{user.bio}</p>
        {isOwnProfile && (
          <button style={pg.editBtn} onClick={() => setShowEditProfile(true)}>
            <Edit3 size={13} /> Edit profile
          </button>
        )}
      </div>

      {/* Special sections */}
      <div style={pg.sectionsWrap}>
        {sections.map(s => (
          <SpecialSectionShell key={s.id} section={s}>
            {renderSection(s)}
          </SpecialSectionShell>
        ))}
        {isOwnProfile && (
          <button style={pg.addSectionBtn} onClick={() => setShowAddSection(true)}>
            <Plus size={14} /> Add section
          </button>
        )}
      </div>

      {/* Post tabs */}
      <div style={pg.tabBarWrap}>
        <div style={pg.tabBar}>
          {postTabs.map(tab => (
            <button key={tab.id}
              style={{ ...pg.tab, ...(activeTab === tab.id ? pg.tabActive : {}) }}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
          {isOwnProfile && (
            <button style={pg.addTabBtn} onClick={() => setShowAddTab(true)} title="New section">
              <Plus size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Posts */}
      <PostFeed activeTab={activeTab} />

      {/* Bottom nav */}
      <BottomNav active="profile" />

      {/* Modals */}
      {showAddSection  && (
        <AddSectionModal
          onClose={() => setShowAddSection(false)}
          onAdd={s => setSections(prev => [...prev, s])}
          existingSectionTypes={existingSectionTypes}
        />
      )}
      {showAddTab && (
        <AddTabModal
          onClose={() => setShowAddTab(false)}
          onAdd={tab => setPostTabs(prev => [...prev, tab])}
        />
      )}
      {showEditProfile && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSave={updated => setUser(updated)}
        />
      )}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE OBJECTS
// ═══════════════════════════════════════════════════════════════════════════════

// Page
const pg = {
  page:         { maxWidth: 680, margin: "0 auto", paddingBottom: 90, fontFamily: FONT_BODY, background: C.bg, color: C.text, minHeight: "100vh" },
  banner:       { width: "100%", height: 210, overflow: "hidden", background: C.surface, position: "relative" },
  bannerImg:    { width: "100%", height: "100%", objectFit: "cover" },
  bannerOverlay:{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, #0a0a0a)" },
  avatarRow:    { display: "flex", justifyContent: "center", position: "relative", marginTop: -70 },
  avatarWrap:   { display: "flex", justifyContent: "center" },
  avatar:       { width: 140, height: 140, borderRadius: "50%", border: `4px solid ${C.bg}`, objectFit: "cover", background: C.violetFaint, boxShadow: `0 0 0 2px ${C.violet}55` },
  cogBtn:       { position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  userInfo:     { textAlign: "center", padding: "14px 24px 22px" },
  displayName:  { margin: "0 0 5px", fontSize: 28, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.text, letterSpacing: 0.3 },
  handle:       { margin: "0 0 10px", color: C.muted, fontSize: 15 },
  bio:          { margin: "0 0 16px", fontSize: 15, lineHeight: 1.7, color: "#aaa", maxWidth: 420, marginLeft: "auto", marginRight: "auto" },
  editBtn:      { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 20px", borderRadius: 20, border: `1px solid ${C.violetDim}`, background: "transparent", color: C.violetGlow, cursor: "pointer", fontSize: 13, fontWeight: 500 },
  sectionsWrap: { padding: "0 16px 10px" },
  addSectionBtn:{ display: "flex", alignItems: "center", gap: 6, width: "100%", justifyContent: "center", padding: "12px 0", background: "none", border: `1px dashed ${C.violetDim}`, borderRadius: 10, color: C.muted, cursor: "pointer", fontSize: 13, marginTop: 10 },
  tabBarWrap:   { position: "sticky", top: 0, zIndex: 10, background: C.bg, borderBottom: `1px solid ${C.border}` },
  tabBar:       { display: "flex", overflowX: "auto", padding: "0 16px", scrollbarWidth: "none", gap: 2 },
  tab:          { flexShrink: 0, padding: "13px 18px", background: "none", border: "none", borderBottom: "2px solid transparent", color: C.muted, cursor: "pointer", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", fontFamily: FONT_BODY },
  tabActive:    { color: C.violetGlow, borderBottomColor: C.violet },
  addTabBtn:    { flexShrink: 0, padding: "13px 10px", background: "none", border: "none", color: C.muted, cursor: "pointer", display: "flex", alignItems: "center" },
};

// Section shell
const shellSt = {
  wrap:       { borderBottom: `1px solid ${C.border}` },
  header:     { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", color: C.text, padding: "16px 0", cursor: "pointer" },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  label:      { fontSize: 16, fontWeight: 600, fontFamily: FONT_DISPLAY, letterSpacing: 0.3, transition: "color 0.2s" },
  body:       { paddingBottom: 22 },
};

// Section content (ss)
const ss = {
  wrap:           { display: "flex", flexDirection: "column", gap: 22 },
  blockLabel:     { margin: "0 0 10px", fontSize: 11, letterSpacing: 2, color: C.muted, fontFamily: FONT_BODY, fontWeight: 600 },

  spotifyOff:     { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 8, border: "1px solid #1db954", background: "transparent", color: "#1db954", cursor: "pointer", fontSize: 14, fontWeight: 500 },
  spotifyOn:      { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 8, border: "1px solid #1a3a1a", background: "#0d1a0d", color: "#4ade80", cursor: "pointer", fontSize: 14 },

  trackList:      { display: "flex", flexDirection: "column", gap: 10 },
  trackCard:      { display: "flex", alignItems: "center", gap: 14, background: C.surface, borderRadius: 10, padding: "12px 16px", border: `1px solid ${C.border}` },
  trackNum:       { width: 20, textAlign: "center", color: C.muted, fontSize: 14, fontFamily: FONT_DISPLAY, fontStyle: "italic" },
  trackArt:       { width: 52, height: 52, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  trackInfo:      { display: "flex", flexDirection: "column", gap: 3 },
  trackTitle:     { fontSize: 16, fontWeight: 600, fontFamily: FONT_DISPLAY, color: C.text },
  trackArtist:    { fontSize: 13, color: C.muted2 },

  artistGrid:     { display: "flex", gap: 16, flexWrap: "wrap" },
  artistCard:     { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 88 },
  artistImg:      { width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.violetDim}` },
  artistName:     { fontSize: 12, color: "#bbb", textAlign: "center", lineHeight: 1.3 },

  chipRow:        { display: "flex", flexWrap: "wrap", gap: 8 },
  chip:           { padding: "6px 16px", borderRadius: 20, border: `1px solid ${C.violetDim}`, background: C.violetFaint, fontSize: 13, color: C.violetGlow, fontFamily: FONT_BODY },

  statsRow:       { display: "flex", gap: 12, flexWrap: "wrap" },
  statPill:       { display: "flex", flexDirection: "column", padding: "10px 18px", borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, minWidth: 90 },
  statVal:        { fontSize: 18, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.text },
  statKey:        { fontSize: 12, color: C.muted, marginTop: 3 },

  cardList:       { display: "flex", flexDirection: "column", gap: 12 },
  mediaCard:      { display: "flex", alignItems: "flex-start", gap: 14, background: C.surface, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.border}` },
  mediaRank:      { width: 22, paddingTop: 3, color: C.muted, fontSize: 14, fontFamily: FONT_DISPLAY, fontStyle: "italic", flexShrink: 0 },
  mediaIcon:      { width: 80, height: 80, borderRadius: 10, objectFit: "cover", flexShrink: 0, border: `1px solid ${C.border2}` },
  mediaInfo:      { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  mediaTitle:     { fontSize: 17, fontWeight: 600, fontFamily: FONT_DISPLAY, color: C.text },
  mediaSub:       { fontSize: 13, color: C.muted2 },
  mediaThoughts:  { fontSize: 14, color: "#aaa", fontStyle: "italic", marginTop: 2 },
};

// Post card (pc)
const pc = {
  wrap:    { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 14, overflow: "hidden" },
  meta:    { display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 10px" },
  avatar:  { width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: `1px solid ${C.violetDim}` },
  author:  { fontWeight: 600, fontSize: 15, display: "block", color: C.text },
  handle:  { fontSize: 12, color: C.muted, display: "block" },
  time:    { fontSize: 12, color: C.muted, marginLeft: "auto" },
  text:    { margin: "0 0 12px", padding: "0 16px", fontSize: 15, lineHeight: 1.65, color: "#ccc" },
  img:     { width: "100%", display: "block", maxHeight: 420, objectFit: "cover" },
  actions: { display: "flex", justifyContent: "center", gap: 36, padding: "12px 16px", borderTop: `1px solid ${C.border}` },
  btn:     { background: "none", border: "none", color: C.muted2, cursor: "pointer", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 },
};

// Modal (md)
const md = {
  overlay:    { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  box:        { background: "#121212", borderRadius: "18px 18px 0 0", padding: "20px 20px 40px", width: "100%", maxWidth: 680, maxHeight: "85vh", overflowY: "auto", border: `1px solid ${C.border2}` },
  topBar:     { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title:      { fontSize: 20, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.text },
  sub:        { margin: "0 0 20px", fontSize: 14, color: C.muted },
  iconBtn:    { background: "none", border: "none", color: C.muted2, cursor: "pointer", padding: 4, display: "flex", alignItems: "center" },

  typeGrid:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
  typeCard:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 10px", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, cursor: "pointer" },
  typeIconWrap:{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" },
  typeLabel:  { fontSize: 13, color: "#bbb" },

  spotifyPill:{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", marginBottom: 14, borderRadius: 8, border: "1px solid #1db954", background: "transparent", color: "#1db954", cursor: "pointer", fontSize: 13 },
  searchRow:  { display: "flex", gap: 8, marginBottom: 14 },
  searchInput:{ flex: 1, padding: "11px 14px", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontFamily: FONT_BODY, outline: "none" },
  searchBtn:  { padding: "0 16px", background: C.violetDim, border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" },

  results:    { display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 },
  resultRow:  { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`, cursor: "pointer", textAlign: "left" },
  resultImg:  { width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  resultText: { display: "flex", flexDirection: "column", gap: 3, flex: 1 },
  resultTitle:{ fontSize: 15, color: C.text },
  resultSub:  { fontSize: 13, color: C.muted },

  pickedBar:  { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 0", borderTop: `1px solid ${C.border}` },
  pickedCount:{ fontSize: 13, color: C.muted },
  saveBtn:    { padding: "9px 22px", borderRadius: 20, background: C.violet, color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 },
};

// Edit profile (ep)
const ep = {
  section:       { marginBottom: 22 },
  label:         { margin: "0 0 8px", fontSize: 12, letterSpacing: 1.5, color: C.muted, fontWeight: 600 },
  avatarRow:     { display: "flex", alignItems: "center", gap: 16 },
  previewAvatar: { width: 70, height: 70, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.violetDim}` },
  bannerPreview: { width: "100%", height: 80, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border2}` },
  bannerImg:     { width: "100%", height: "100%", objectFit: "cover" },
  uploadBtn:     { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: `1px solid ${C.border2}`, background: "transparent", color: C.muted2, cursor: "pointer", fontSize: 13 },
  input:         { width: "100%", padding: "11px 14px", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontFamily: FONT_BODY, outline: "none", boxSizing: "border-box" },
  cancelBtn:     { padding: "9px 22px", borderRadius: 20, background: "transparent", border: `1px solid ${C.border2}`, color: C.muted2, cursor: "pointer", fontSize: 14 },
};

// Settings (stg)
const stg = {
  tabs:       { display: "flex", overflowX: "auto", gap: 4, marginBottom: 20, scrollbarWidth: "none" },
  tab:        { flexShrink: 0, padding: "7px 14px", borderRadius: 20, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: FONT_BODY, whiteSpace: "nowrap" },
  tabActive:  { background: C.violetFaint, borderColor: C.violetDim, color: C.violetGlow },
  group:      { display: "flex", flexDirection: "column", gap: 4 },
  row:        { display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" },
  rowLabel:   { flex: 1, fontSize: 15, color: C.text },
  toggle:     { width: 42, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0, padding: 0 },
  toggleKnob: { position: "absolute", top: 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "transform 0.2s" },
};

// Bottom nav (nb)
const nb = {
  bar:     { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 680, display: "flex", justifyContent: "space-around", alignItems: "center", background: C.bg, borderTop: `1px solid ${C.border}`, padding: "8px 0 14px", zIndex: 100 },
  item:    { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", color: C.muted, cursor: "pointer", padding: "4px 12px", borderRadius: 8 },
  active:  { color: C.violetGlow },
  postBtn: { background: C.violet, borderRadius: "50%", width: 46, height: 46, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px ${C.violet}88`, marginBottom: 6 },
  label:   { fontSize: 10, fontWeight: 500 },
};