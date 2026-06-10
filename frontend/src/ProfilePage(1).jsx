import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, ChevronUp, Plus, Music2, Gamepad2, Tv2, BookOpen, Film, ExternalLink, Search, Loader2, Check, Shuffle } from "lucide-react";

// ── Google Fonts ────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:wght@300;400;500;700&display=swap";
document.head.appendChild(fontLink);

// ── Constants ───────────────────────────────────────────────────────────────
const SECTION_TYPES = [
  { id: "music",  label: "Music",  icon: Music2  },
  { id: "games",  label: "Games",  icon: Gamepad2 },
  { id: "anime",  label: "Anime",  icon: Tv2      },
  { id: "books",  label: "Books",  icon: BookOpen },
  { id: "movies", label: "Movies", icon: Film     },
];

// ── Mock user ────────────────────────────────────────────────────────────────
// TODO: GET /api/users/:username
const MOCK_USER = {
  id: "u_123",
  username: "prefetch",
  displayName: "Prefetch",
  bio: "I build things, make music, and fold paper.",
  avatarUrl: "https://placehold.co/160x160",
  bannerUrl: "https://placehold.co/1200x340/1a1a2e/ffffff?text=.",
};

// ── Mock section data ────────────────────────────────────────────────────────
// TODO: GET /api/users/:username/special-sections  →  array of { id, type, data }
const INITIAL_SECTIONS = [
  {
    id: "sec-music", type: "music",
    data: {
      spotifyConnected: false,
      topTracks: [
        { title: "Bohemian Rhapsody", artist: "Queen",         albumArt: "https://placehold.co/56x56/222/aaa?text=♪" },
        { title: "Clair de Lune",     artist: "Debussy",       albumArt: "https://placehold.co/56x56/222/aaa?text=♪" },
        { title: "Redbone",           artist: "Childish Gambino", albumArt: "https://placehold.co/56x56/222/aaa?text=♪" },
        { title: "Gravity",           artist: "John Mayer",    albumArt: "https://placehold.co/56x56/222/aaa?text=♪" },
        { title: "Stairway to Heaven","artist": "Led Zeppelin", albumArt: "https://placehold.co/56x56/222/aaa?text=♪" },
      ],
      topArtists: [
        { name: "Queen",            image: "https://placehold.co/80x80/2a2a2a/aaa?text=Q"  },
        { name: "John Coltrane",    image: "https://placehold.co/80x80/2a2a2a/aaa?text=JC" },
        { name: "Nujabes",          image: "https://placehold.co/80x80/2a2a2a/aaa?text=N"  },
        { name: "Childish Gambino", image: "https://placehold.co/80x80/2a2a2a/aaa?text=CG" },
      ],
      favGenres: ["Progressive Rock", "Jazz", "Lo-fi Hip Hop", "Classical"],
    },
  },
  {
    id: "sec-games", type: "games",
    data: {
      topGames: [
        { title: "Hollow Knight",   genre: "Metroidvania", hoursPlayed: 120, rating: "9/10", thoughts: "Peak indie gaming.",         icon: "https://placehold.co/72x72/1a1a1a/888?text=HK" },
        { title: "Disco Elysium",   genre: "RPG",          hoursPlayed: 80,  rating: "10/10", thoughts: "Nothing like it.",          icon: "https://placehold.co/72x72/1a1a1a/888?text=DE" },
        { title: "Outer Wilds",     genre: "Adventure",    hoursPlayed: 22,  rating: "10/10", thoughts: "Emotional gut punch.",      icon: "https://placehold.co/72x72/1a1a1a/888?text=OW" },
        { title: "Celeste",         genre: "Platformer",   hoursPlayed: 40,  rating: "9/10", thoughts: "Brilliant level design.",    icon: "https://placehold.co/72x72/1a1a1a/888?text=C"  },
        { title: "Hades",           genre: "Roguelite",    hoursPlayed: 200, rating: "9/10", thoughts: "Can't stop playing it.",     icon: "https://placehold.co/72x72/1a1a1a/888?text=H"  },
      ],
      totalHours: 1240,
      favGenre: "Metroidvania",
    },
  },
  {
    id: "sec-anime", type: "anime",
    data: {
      topAnime: [
        { title: "Ping Pong The Animation", genre: "Sports",      episodes: 11,  status: "Completed", thoughts: "Masterpiece of expression.", cover: "https://placehold.co/72x72/1a1a1a/888?text=PP" },
        { title: "Mushishi",                genre: "Slice of Life", episodes: 26, status: "Completed", thoughts: "Deeply calming.",            cover: "https://placehold.co/72x72/1a1a1a/888?text=M"  },
        { title: "Vinland Saga",            genre: "Historical",   episodes: 48,  status: "Completed", thoughts: "Stunning character arcs.",   cover: "https://placehold.co/72x72/1a1a1a/888?text=VS" },
        { title: "Monster",                 genre: "Thriller",     episodes: 74,  status: "Completed", thoughts: "Slow burn perfection.",       cover: "https://placehold.co/72x72/1a1a1a/888?text=Mo" },
        { title: "Dungeon Meshi",           genre: "Fantasy",      episodes: 24,  status: "Watching",  thoughts: "Best seasonal in years.",     cover: "https://placehold.co/72x72/1a1a1a/888?text=DM" },
      ],
      favGenre: "Slice of Life",
    },
  },
];

// ── Mock post tabs ────────────────────────────────────────────────────────────
// TODO: GET /api/users/:username/post-tabs
const INITIAL_POST_TABS = [
  { id: "all",      label: "All"      },
  { id: "music",    label: "Music"    },
  { id: "origami",  label: "Origami"  },
  { id: "painting", label: "Painting" },
  { id: "blogs",    label: "Blogs"    },
];

// ── Mock post fetch (infinite scroll) ────────────────────────────────────────
// TODO: GET /api/users/:username/posts?tab=:tabId&page=:page&limit=8
function fetchMockPosts(tabId, page) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = Array.from({ length: 6 }, (_, i) => ({
        id: `${tabId}-p${page}-${i}`,
        author: MOCK_USER,
        text: `Post #${(page - 1) * 6 + i + 1} in ${tabId}.`,
        images: i % 3 === 0 ? [`https://placehold.co/600x400/111/555?text=Post+${(page-1)*6+i+1}`] : [],
        likes: Math.floor(Math.random() * 300),
        comments: Math.floor(Math.random() * 40),
        liked: false,
        createdAt: `${i + 1}h ago`,
      }));
      resolve({ posts, hasMore: page < 3 });
    }, 600);
  });
}

// ── Auth helper ───────────────────────────────────────────────────────────────
// TODO: replace with real auth context (e.g. useAuth())
const isOwnProfile = true;

// ═══════════════════════════════════════════════════════════════════════════════
// MUSIC SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function MusicSection({ data, onUpdate }) {
  const handleSpotifySync = () => {
    // TODO: POST /api/integrations/spotify/connect  →  redirects to Spotify OAuth
    // On callback: GET /api/integrations/spotify/sync  →  pulls top tracks & artists
    alert("Redirect to Spotify OAuth flow");
  };

  return (
    <div style={sec.wrap}>
      {/* Spotify sync banner */}
      {isOwnProfile && (
        <button style={data.spotifyConnected ? sec.spotifyConnected : sec.spotifyBtn} onClick={handleSpotifySync}>
          <span style={sec.spotifyIcon}>♫</span>
          {data.spotifyConnected ? "Synced with Spotify" : "Connect Spotify to auto-sync"}
        </button>
      )}

      {/* Top Tracks */}
      <p style={sec.blockLabel}>TOP TRACKS</p>
      <div style={sec.trackList}>
        {data.topTracks.map((track, i) => (
          <div key={i} style={sec.trackCard}>
            <span style={sec.trackNum}>{i + 1}</span>
            <img src={track.albumArt} alt="" style={sec.trackArt} />
            <div style={sec.trackInfo}>
              <span style={sec.trackTitle}>{track.title}</span>
              <span style={sec.trackArtist}>{track.artist}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Artists */}
      <p style={sec.blockLabel}>TOP ARTISTS</p>
      <div style={sec.artistGrid}>
        {data.topArtists.map((artist, i) => (
          <div key={i} style={sec.artistCard}>
            <img src={artist.image} alt={artist.name} style={sec.artistImg} />
            <span style={sec.artistName}>{artist.name}</span>
          </div>
        ))}
      </div>

      {/* Fav Genres */}
      <p style={sec.blockLabel}>FAVOURITE GENRES</p>
      <div style={sec.chipRow}>
        {data.favGenres.map((g) => <span key={g} style={sec.chip}>{g}</span>)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAMES SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function GamesSection({ data }) {
  return (
    <div style={sec.wrap}>
      <div style={sec.statsRow}>
        <div style={sec.statPill}><span style={sec.statVal}>{data.totalHours}h</span><span style={sec.statKey}>played</span></div>
        <div style={sec.statPill}><span style={sec.statVal}>{data.favGenre}</span><span style={sec.statKey}>fav genre</span></div>
      </div>

      <p style={sec.blockLabel}>TOP GAMES</p>
      <div style={sec.cardList}>
        {data.topGames.map((game, i) => (
          <div key={i} style={sec.mediaCard}>
            <div style={sec.mediaRank}>{i + 1}</div>
            <img src={game.icon} alt={game.title} style={sec.mediaIcon} />
            <div style={sec.mediaInfo}>
              <span style={sec.mediaTitle}>{game.title}</span>
              <span style={sec.mediaSub}>{game.genre} · {game.hoursPlayed}h · {game.rating}</span>
              <span style={sec.mediaThoughts}>{game.thoughts}</span>
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
    <div style={sec.wrap}>
      <div style={sec.statsRow}>
        <div style={sec.statPill}><span style={sec.statVal}>{data.favGenre}</span><span style={sec.statKey}>fav genre</span></div>
      </div>

      <p style={sec.blockLabel}>TOP ANIME</p>
      <div style={sec.cardList}>
        {data.topAnime.map((anime, i) => (
          <div key={i} style={sec.mediaCard}>
            <div style={sec.mediaRank}>{i + 1}</div>
            <img src={anime.cover} alt={anime.title} style={{ ...sec.mediaIcon, borderRadius: 6 }} />
            <div style={sec.mediaInfo}>
              <span style={sec.mediaTitle}>{anime.title}</span>
              <span style={sec.mediaSub}>{anime.genre} · {anime.episodes} ep · <span style={{ color: anime.status === "Watching" ? "#7ec87e" : "#666" }}>{anime.status}</span></span>
              <span style={sec.mediaThoughts}>{anime.thoughts}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION SHELL (collapsible)
// ═══════════════════════════════════════════════════════════════════════════════
function SpecialSectionShell({ section, children }) {
  const [open, setOpen] = useState(false);
  const TypeIcon = SECTION_TYPES.find(t => t.id === section.type)?.icon;

  return (
    <div style={shell.wrap}>
      <button style={shell.header} onClick={() => setOpen(o => !o)}>
        <div style={shell.headerLeft}>
          {TypeIcon && <TypeIcon size={16} color="#888" />}
          <span style={shell.label}>{section.type.charAt(0).toUpperCase() + section.type.slice(1)}</span>
        </div>
        {open ? <ChevronUp size={16} color="#555" /> : <ChevronDown size={16} color="#555" />}
      </button>
      {open && <div style={shell.body}>{children}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD SECTION MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function AddSectionModal({ onClose, onAdd }) {
  const [step, setStep] = useState("pick");   // "pick" | "form"
  const [selectedType, setSelectedType] = useState(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [picked, setPicked] = useState([]);   // items user has selected

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
      // Route search query to appropriate backend proxy endpoint
      // Backend uses the right API key and returns a normalised { id, title, subtitle, image } array
      let endpoint = "";
      if (selectedType === "games")  endpoint = `/api/search/games?q=${encodeURIComponent(query)}`;
      // TODO: GET /api/search/games?q=  →  backend proxies RAWG /games
      if (selectedType === "anime")  endpoint = `/api/search/anime?q=${encodeURIComponent(query)}`;
      // TODO: GET /api/search/anime?q=  →  backend proxies Jikan /anime
      if (selectedType === "music")  endpoint = `/api/search/artists?q=${encodeURIComponent(query)}`;
      // TODO: GET /api/search/artists?q=  →  backend proxies Last.fm artist.search
      if (selectedType === "books")  endpoint = `/api/search/books?q=${encodeURIComponent(query)}`;
      // TODO: GET /api/search/books?q=  →  backend proxies Google Books /volumes
      if (selectedType === "movies") endpoint = `/api/search/movies?q=${encodeURIComponent(query)}`;
      // TODO: GET /api/search/movies?q=  →  backend proxies TMDB /search/movie

      // const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      // const json = await res.json();
      // setSearchResults(json.results);

      // ── MOCK while backend isn't wired ──────────────────────────────────
      await new Promise(r => setTimeout(r, 600));
      setSearchResults([
        { id: "r1", title: query + " — Result 1", subtitle: "Genre · 2022", image: `https://placehold.co/56x56/222/888?text=1` },
        { id: "r2", title: query + " — Result 2", subtitle: "Genre · 2021", image: `https://placehold.co/56x56/222/888?text=2` },
        { id: "r3", title: query + " — Result 3", subtitle: "Genre · 2020", image: `https://placehold.co/56x56/222/888?text=3` },
      ]);
      // ────────────────────────────────────────────────────────────────────
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
    // TODO: POST /api/users/:username/special-sections
    // Body: { type: selectedType, items: picked }
    // Returns: the created section object with id
    onAdd({ id: `sec-${Date.now()}`, type: selectedType, data: { items: picked } });
    onClose();
  };

  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        {step === "pick" ? (
          <>
            <p style={modal.title}>Add a section</p>
            <p style={modal.sub}>What do you want to showcase?</p>
            <div style={modal.typeGrid}>
              {SECTION_TYPES.map(({ id, label, icon: Icon }) => (
                <button key={id} style={modal.typeCard} onClick={() => handleTypeSelect(id)}>
                  <Icon size={24} color="#aaa" />
                  <span style={modal.typeLabel}>{label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button style={modal.back} onClick={() => setStep("pick")}>← Back</button>
            <p style={modal.title}>Add {selectedType}</p>

            {/* Spotify special case for music */}
            {selectedType === "music" && (
              <button style={modal.spotifyPill} onClick={() => {
                // TODO: POST /api/integrations/spotify/connect
                alert("Spotify OAuth redirect");
              }}>
                ♫ Import from Spotify instead
              </button>
            )}

            <div style={modal.searchRow}>
              <input
                style={modal.searchInput}
                placeholder={`Search ${selectedType}…`}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
              <button style={modal.searchBtn} onClick={handleSearch}>
                {searching ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div style={modal.results}>
                {searchResults.map(item => {
                  const isSelected = picked.find(p => p.id === item.id);
                  return (
                    <button key={item.id} style={{ ...modal.resultRow, background: isSelected ? "#1e2a1e" : "#1a1a1a" }} onClick={() => togglePick(item)}>
                      <img src={item.image} alt="" style={modal.resultImg} />
                      <div style={modal.resultText}>
                        <span style={modal.resultTitle}>{item.title}</span>
                        <span style={modal.resultSub}>{item.subtitle}</span>
                      </div>
                      {isSelected && <Check size={16} color="#7ec87e" />}
                    </button>
                  );
                })}
              </div>
            )}

            {picked.length > 0 && (
              <div style={modal.pickedBar}>
                <span style={modal.pickedCount}>{picked.length} selected</span>
                <button style={modal.saveBtn} onClick={handleSave}>Save section</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST CARD
// ═══════════════════════════════════════════════════════════════════════════════
function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  return (
    <div style={card.wrap}>
      <div style={card.meta}>
        <img src={post.author.avatarUrl} alt="" style={card.avatar} />
        <span style={card.author}>{post.author.displayName}</span>
        <span style={card.time}>{post.createdAt}</span>
      </div>
      {post.text && <p style={card.text}>{post.text}</p>}
      {post.images.length > 0 && <img src={post.images[0]} alt="" style={card.img} />}
      <div style={card.actions}>
        <button style={{ ...card.btn, color: liked ? "#e05c5c" : "#777" }} onClick={() => { setLiked(l => !l); setLikes(n => liked ? n-1 : n+1); /* TODO: POST /api/posts/:id/like */ }}>
          {liked ? "♥" : "♡"} {likes}
        </button>
        <button style={card.btn}>💬 {post.comments}{/* TODO: open comments */}</button>
        <button style={card.btn}>🔗 Share{/* TODO: share sheet */}</button>
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
    <div style={{ padding: "12px 16px" }}>
      {posts.map(p => <PostCard key={p.id} post={p} />)}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && <p style={{ textAlign: "center", color: "#555", fontSize: 13 }}>Loading…</p>}
      {!hasMore && posts.length > 0 && <p style={{ textAlign: "center", color: "#444", fontSize: 12, padding: "16px 0" }}>You've seen it all.</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOTTOM NAV
// ═══════════════════════════════════════════════════════════════════════════════
function BottomNav({ active }) {
  const items = [
    { id: "feed",          label: "Feed",    icon: "🏠" },
    { id: "explore",       label: "Explore", icon: "🔍" },
    { id: "post",          label: "Post",    icon: "➕" },
    { id: "notifications", label: "Alerts",  icon: "🔔" },
    { id: "profile",       label: "Profile", icon: "👤" },
  ];
  return (
    <nav style={nav.bar}>
      {items.map(item => (
        <button key={item.id} style={{ ...nav.item, ...(active === item.id ? nav.active : {}) }}
          onClick={() => { /* TODO: React Router navigate(`/${item.id}`) */ }}>
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <span style={nav.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function ProfilePage() {
  const [sections, setSections]       = useState(INITIAL_SECTIONS);
  const [postTabs, setPostTabs]       = useState(INITIAL_POST_TABS);
  const [activeTab, setActiveTab]     = useState(INITIAL_POST_TABS[0].id);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddSection = (newSection) => {
    setSections(prev => [...prev, newSection]);
    // TODO: section already saved via POST inside modal; here we just update local state
  };

  const handleAddPostTab = () => {
    const name = prompt("Tab name:");
    if (!name) return;
    // TODO: POST /api/users/:username/post-tabs  { label: name }
    const id = name.toLowerCase().replace(/\s+/g, "-");
    setPostTabs(prev => [...prev, { id, label: name }]);
  };

  const renderSection = (sec) => {
    switch (sec.type) {
      case "music":  return <MusicSection  data={sec.data} />;
      case "games":  return <GamesSection  data={sec.data} />;
      case "anime":  return <AnimeSection  data={sec.data} />;
      default:       return <p style={{ color: "#555", fontSize: 13, padding: "8px 0" }}>No content yet.</p>;
    }
  };

  return (
    <div style={pg.page}>
      {/* Banner */}
      <div style={pg.banner}>
        <img src={MOCK_USER.bannerUrl} alt="" style={pg.bannerImg} />
      </div>

      {/* Avatar */}
      <div style={pg.avatarWrap}>
        <img src={MOCK_USER.avatarUrl} alt="avatar" style={pg.avatar} />
      </div>

      {/* User info */}
      <div style={pg.userInfo}>
        <h2 style={pg.displayName}>{MOCK_USER.displayName}</h2>
        <p style={pg.handle}>@{MOCK_USER.username}</p>
        <p style={pg.bio}>{MOCK_USER.bio}</p>
        {isOwnProfile && <button style={pg.editBtn}>Edit profile{/* TODO: navigate to /settings/profile */}</button>}
      </div>

      {/* Special sections */}
      <div style={pg.sectionsWrap}>
        {sections.map(sec => (
          <SpecialSectionShell key={sec.id} section={sec}>
            {renderSection(sec)}
          </SpecialSectionShell>
        ))}
        {isOwnProfile && (
          <button style={pg.addSectionBtn} onClick={() => setShowAddModal(true)}>
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
            <button style={pg.addTabBtn} onClick={handleAddPostTab}><Plus size={14} /></button>
          )}
        </div>
      </div>

      {/* Posts */}
      <PostFeed activeTab={activeTab} />

      {/* Bottom nav */}
      <BottomNav active="profile" />

      {/* Add section modal */}
      {showAddModal && <AddSectionModal onClose={() => setShowAddModal(false)} onAdd={handleAddSection} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE OBJECTS
// ═══════════════════════════════════════════════════════════════════════════════

const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
const FONT_BODY    = "'Roboto', 'Segoe UI', sans-serif";
const BG           = "#0c0c0c";
const SURFACE      = "#141414";
const BORDER       = "#222";
const TEXT         = "#e8e8e8";
const MUTED        = "#666";

// Page
const pg = {
  page:        { maxWidth: 680, margin: "0 auto", paddingBottom: 90, fontFamily: FONT_BODY, background: BG, color: TEXT, minHeight: "100vh" },
  banner:      { width: "100%", height: 190, overflow: "hidden", background: "#1a1a1a" },
  bannerImg:   { width: "100%", height: "100%", objectFit: "cover" },
  avatarWrap:  { display: "flex", justifyContent: "center", marginTop: -64 },
  avatar:      { width: 128, height: 128, borderRadius: "50%", border: "4px solid #0c0c0c", objectFit: "cover", background: "#222" },
  userInfo:    { textAlign: "center", padding: "12px 24px 20px" },
  displayName: { margin: "0 0 4px", fontSize: 26, fontWeight: 700, fontFamily: FONT_DISPLAY },
  handle:      { margin: "0 0 8px", color: MUTED, fontSize: 14 },
  bio:         { margin: "0 0 14px", fontSize: 14, lineHeight: 1.6, color: "#bbb", maxWidth: 400, marginLeft: "auto", marginRight: "auto" },
  editBtn:     { padding: "6px 20px", borderRadius: 20, border: "1px solid #444", background: "transparent", color: TEXT, cursor: "pointer", fontSize: 13 },
  sectionsWrap:{ padding: "0 16px 8px" },
  addSectionBtn:{ display: "flex", alignItems: "center", gap: 6, width: "100%", justifyContent: "center", padding: "10px 0", background: "none", border: `1px dashed #2a2a2a`, borderRadius: 8, color: MUTED, cursor: "pointer", fontSize: 13, marginTop: 8 },
  tabBarWrap:  { position: "sticky", top: 0, zIndex: 10, background: BG, borderBottom: `1px solid ${BORDER}` },
  tabBar:      { display: "flex", overflowX: "auto", padding: "0 16px", scrollbarWidth: "none", gap: 2 },
  tab:         { flexShrink: 0, padding: "12px 16px", background: "none", border: "none", borderBottom: "2px solid transparent", color: MUTED, cursor: "pointer", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", fontFamily: FONT_BODY },
  tabActive:   { color: TEXT, borderBottomColor: TEXT },
  addTabBtn:   { flexShrink: 0, padding: "12px 10px", background: "none", border: "none", color: MUTED, cursor: "pointer", display: "flex", alignItems: "center" },
};

// Section shell
const shell = {
  wrap:       { borderBottom: `1px solid ${BORDER}` },
  header:     { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", color: TEXT, padding: "15px 0", cursor: "pointer" },
  headerLeft: { display: "flex", alignItems: "center", gap: 8 },
  label:      { fontSize: 15, fontWeight: 600, fontFamily: FONT_DISPLAY, letterSpacing: 0.3 },
  body:       { paddingBottom: 20 },
};

// Section content
const sec = {
  wrap:           { display: "flex", flexDirection: "column", gap: 20 },
  blockLabel:     { margin: "0 0 10px", fontSize: 11, letterSpacing: 2, color: MUTED, fontFamily: FONT_BODY, fontWeight: 500 },

  // Spotify
  spotifyBtn:     { display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, border: "1px solid #1db954", background: "transparent", color: "#1db954", cursor: "pointer", fontSize: 13, fontWeight: 500 },
  spotifyConnected:{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, border: "1px solid #2a3a2a", background: "#0d1f0d", color: "#7ec87e", cursor: "pointer", fontSize: 13 },
  spotifyIcon:    { fontSize: 16 },

  // Tracks
  trackList:      { display: "flex", flexDirection: "column", gap: 8 },
  trackCard:      { display: "flex", alignItems: "center", gap: 12, background: SURFACE, borderRadius: 8, padding: "10px 14px", border: `1px solid ${BORDER}` },
  trackNum:       { width: 18, textAlign: "center", color: MUTED, fontSize: 13, fontFamily: FONT_DISPLAY, fontStyle: "italic" },
  trackArt:       { width: 46, height: 46, borderRadius: 6, objectFit: "cover", flexShrink: 0 },
  trackInfo:      { display: "flex", flexDirection: "column", gap: 2 },
  trackTitle:     { fontSize: 15, fontWeight: 600, fontFamily: FONT_DISPLAY, color: TEXT },
  trackArtist:    { fontSize: 12, color: MUTED },

  // Artists
  artistGrid:     { display: "flex", gap: 12, flexWrap: "wrap" },
  artistCard:     { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 72 },
  artistImg:      { width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `2px solid ${BORDER}` },
  artistName:     { fontSize: 11, color: "#bbb", textAlign: "center", lineHeight: 1.3 },

  // Genres/chips
  chipRow:        { display: "flex", flexWrap: "wrap", gap: 8 },
  chip:           { padding: "5px 14px", borderRadius: 20, border: `1px solid #2a2a2a`, background: SURFACE, fontSize: 13, color: "#bbb", fontFamily: FONT_BODY },

  // Stats row
  statsRow:       { display: "flex", gap: 10, flexWrap: "wrap" },
  statPill:       { display: "flex", flexDirection: "column", padding: "8px 16px", borderRadius: 8, background: SURFACE, border: `1px solid ${BORDER}`, minWidth: 80 },
  statVal:        { fontSize: 16, fontWeight: 700, fontFamily: FONT_DISPLAY, color: TEXT },
  statKey:        { fontSize: 11, color: MUTED, marginTop: 2 },

  // Media cards (games / anime)
  cardList:       { display: "flex", flexDirection: "column", gap: 10 },
  mediaCard:      { display: "flex", alignItems: "flex-start", gap: 12, background: SURFACE, borderRadius: 10, padding: "12px 14px", border: `1px solid ${BORDER}` },
  mediaRank:      { width: 20, paddingTop: 2, color: MUTED, fontSize: 13, fontFamily: FONT_DISPLAY, fontStyle: "italic", flexShrink: 0 },
  mediaIcon:      { width: 64, height: 64, borderRadius: 10, objectFit: "cover", flexShrink: 0, border: `1px solid #2a2a2a` },
  mediaInfo:      { display: "flex", flexDirection: "column", gap: 3, flex: 1 },
  mediaTitle:     { fontSize: 16, fontWeight: 600, fontFamily: FONT_DISPLAY, color: TEXT },
  mediaSub:       { fontSize: 12, color: MUTED },
  mediaThoughts:  { fontSize: 13, color: "#aaa", fontStyle: "italic", marginTop: 2 },
};

// Post card
const card = {
  wrap:    { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, marginBottom: 12, overflow: "hidden" },
  meta:    { display: "flex", alignItems: "center", gap: 8, padding: "12px 14px 8px" },
  avatar:  { width: 30, height: 30, borderRadius: "50%", objectFit: "cover" },
  author:  { fontWeight: 600, fontSize: 13 },
  time:    { fontSize: 12, color: MUTED, marginLeft: "auto" },
  text:    { margin: "0 0 10px", padding: "0 14px", fontSize: 14, lineHeight: 1.6, color: "#ccc" },
  img:     { width: "100%", display: "block", maxHeight: 400, objectFit: "cover" },
  actions: { display: "flex", justifyContent: "center", gap: 32, padding: "10px 14px", borderTop: `1px solid ${BORDER}` },
  btn:     { background: "none", border: "none", color: "#777", cursor: "pointer", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 },
};

// Modal
const modal = {
  overlay:    { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  box:        { background: "#141414", borderRadius: "16px 16px 0 0", padding: "24px 20px 40px", width: "100%", maxWidth: 680, maxHeight: "85vh", overflowY: "auto", border: `1px solid ${BORDER}` },
  title:      { margin: "0 0 4px", fontSize: 20, fontWeight: 700, fontFamily: FONT_DISPLAY, color: TEXT },
  sub:        { margin: "0 0 20px", fontSize: 14, color: MUTED },
  typeGrid:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
  typeCard:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 10px", background: "#1a1a1a", border: `1px solid ${BORDER}`, borderRadius: 10, cursor: "pointer", color: TEXT },
  typeLabel:  { fontSize: 13, color: "#bbb" },
  back:       { background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 13, marginBottom: 12, padding: 0 },
  spotifyPill:{ display: "block", width: "100%", padding: "10px", marginBottom: 14, borderRadius: 8, border: "1px solid #1db954", background: "transparent", color: "#1db954", cursor: "pointer", fontSize: 13 },
  searchRow:  { display: "flex", gap: 8, marginBottom: 12 },
  searchInput:{ flex: 1, padding: "10px 14px", background: "#1a1a1a", border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, fontSize: 14, fontFamily: FONT_BODY, outline: "none" },
  searchBtn:  { padding: "0 16px", background: "#222", border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, cursor: "pointer", display: "flex", alignItems: "center" },
  results:    { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
  resultRow:  { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, cursor: "pointer", textAlign: "left" },
  resultImg:  { width: 48, height: 48, borderRadius: 6, objectFit: "cover", flexShrink: 0 },
  resultText: { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
  resultTitle:{ fontSize: 14, color: TEXT },
  resultSub:  { fontSize: 12, color: MUTED },
  pickedBar:  { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0 0", borderTop: `1px solid ${BORDER}` },
  pickedCount:{ fontSize: 13, color: MUTED },
  saveBtn:    { padding: "8px 20px", borderRadius: 20, background: TEXT, color: "#0c0c0c", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 },
};

// Nav
const nav = {
  bar:   { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 680, display: "flex", justifyContent: "space-around", background: BG, borderTop: `1px solid ${BORDER}`, padding: "8px 0 14px", zIndex: 100 },
  item:  { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", color: MUTED, cursor: "pointer", padding: "4px 12px", borderRadius: 8 },
  active:{ color: TEXT },
  label: { fontSize: 10, fontWeight: 500 },
};
