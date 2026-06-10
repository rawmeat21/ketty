import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, ChevronUp, Plus, Music2, Gamepad2, Tv2, BookOpen, Film, Search, Loader2, Check, Settings, Home, Compass, MessageSquare, Bell, User, X } from "lucide-react";

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

// ── Colors ───────────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0c0c0c",
  surface: "#141414",
  border: "#222",
  text: "#e8e8e8",
  muted: "#666",
  violet: "#7c3aed",
  violetDark: "#5b21b6",
  maroon: "#dc2626",
  maroonDark: "#991b1b",
};

const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
const FONT_BODY = "'Roboto', 'Segoe UI', sans-serif";

// ── Mock user ────────────────────────────────────────────────────────────────
const MOCK_USER = {
  id: "u_123",
  username: "username",
  displayName: null,
  bio: "I build things, make music, and fold paper.",
  avatarUrl: "https://placehold.co/180x180",
  bannerUrl: "https://placehold.co/1200x340/1a1a2e/ffffff?text=.",
};

// ── Mock section data ────────────────────────────────────────────────────────
const INITIAL_SECTIONS = [
  {
    id: "sec-music", type: "music",
    data: {
      spotifyConnected: false,
      topTracks: [
        { title: "Bohemian Rhapsody", artist: "Queen",         albumArt: "https://placehold.co/72x72/222/aaa?text=♪" },
        { title: "Clair de Lune",     artist: "Debussy",       albumArt: "https://placehold.co/72x72/222/aaa?text=♪" },
        { title: "Redbone",           artist: "Childish Gambino", albumArt: "https://placehold.co/72x72/222/aaa?text=♪" },
        { title: "Gravity",           artist: "John Mayer",    albumArt: "https://placehold.co/72x72/222/aaa?text=♪" },
        { title: "Stairway to Heaven","artist": "Led Zeppelin", albumArt: "https://placehold.co/72x72/222/aaa?text=♪" },
      ],
      topArtists: [
        { name: "Queen",            image: "https://placehold.co/96x96/2a2a2a/aaa?text=Q"  },
        { name: "John Coltrane",    image: "https://placehold.co/96x96/2a2a2a/aaa?text=JC" },
        { name: "Nujabes",          image: "https://placehold.co/96x96/2a2a2a/aaa?text=N"  },
        { name: "Childish Gambino", image: "https://placehold.co/96x96/2a2a2a/aaa?text=CG" },
      ],
      favGenres: ["Progressive Rock", "Jazz", "Lo-fi Hip Hop", "Classical"],
    },
  },
  {
    id: "sec-games", type: "games",
    data: {
      topGames: [
        { title: "Hollow Knight",   genre: "Metroidvania", hoursPlayed: 120, rating: "9/10", thoughts: "Peak indie gaming.",         icon: "https://placehold.co/96x96/1a1a1a/888?text=HK" },
        { title: "Disco Elysium",   genre: "RPG",          hoursPlayed: 80,  rating: "10/10", thoughts: "Nothing like it.",          icon: "https://placehold.co/96x96/1a1a1a/888?text=DE" },
        { title: "Outer Wilds",     genre: "Adventure",    hoursPlayed: 22,  rating: "10/10", thoughts: "Emotional gut punch.",      icon: "https://placehold.co/96x96/1a1a1a/888?text=OW" },
      ],
      totalHours: 1240,
      favGenre: "Metroidvania",
    },
  },
];

// ── Mock post tabs ────────────────���───────────────────────────────────────────
const INITIAL_POST_TABS = [
  { id: "all",      label: "All"      },
  { id: "music",    label: "Music"    },
  { id: "origami",  label: "Origami"  },
  { id: "painting", label: "Painting" },
];

// ── Mock post fetch ────────────────────────────────────────────────────────────
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

const isOwnProfile = true;

// ══════════════════���════════════════════════════════════════════════════════════
// MUSIC SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function MusicSection({ data, onUpdate }) {
  const handleSpotifySync = () => {
    alert("Redirect to Spotify OAuth flow");
  };

  return (
    <div style={sec.wrap}>
      {isOwnProfile && (
        <button style={data.spotifyConnected ? sec.spotifyConnected : sec.spotifyBtn} onClick={handleSpotifySync}>
          <span style={sec.spotifyIcon}>♫</span>
          {data.spotifyConnected ? "Synced with Spotify" : "Connect Spotify to auto-sync"}
        </button>
      )}

      {data.topTracks && data.topTracks.length > 0 && (
        <>
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
        </>
      )}

      {data.topArtists && data.topArtists.length > 0 && (
        <>
          <p style={sec.blockLabel}>TOP ARTISTS</p>
          <div style={sec.artistGrid}>
            {data.topArtists.map((artist, i) => (
              <div key={i} style={sec.artistCard}>
                <img src={artist.image} alt={artist.name} style={sec.artistImg} />
                <span style={sec.artistName}>{artist.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {data.favGenres && data.favGenres.length > 0 && (
        <>
          <p style={sec.blockLabel}>FAVOURITE GENRES</p>
          <div style={sec.chipRow}>
            {data.favGenres.map((g) => <span key={g} style={sec.chip}>{g}</span>)}
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAMES SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function GamesSection({ data }) {
  return (
    <div style={sec.wrap}>
      {data.totalHours && (
        <div style={sec.statsRow}>
          <div style={sec.statPill}><span style={sec.statVal}>{data.totalHours}h</span><span style={sec.statKey}>played</span></div>
          {data.favGenre && <div style={sec.statPill}><span style={sec.statVal}>{data.favGenre}</span><span style={sec.statKey}>fav genre</span></div>}
        </div>
      )}

      {data.topGames && data.topGames.length > 0 && (
        <>
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
        </>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════��══
// ANIME SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function AnimeSection({ data }) {
  return (
    <div style={sec.wrap}>
      {data.favGenre && (
        <div style={sec.statsRow}>
          <div style={sec.statPill}><span style={sec.statVal}>{data.favGenre}</span><span style={sec.statKey}>fav genre</span></div>
        </div>
      )}

      {data.topAnime && data.topAnime.length > 0 && (
        <>
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
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION SHELL (collapsible)
// ═══════════════════════════════════════════════════════════════════════════════
function SpecialSectionShell({ section, children }) {
  const [open, setOpen] = useState(true);
  const TypeIcon = SECTION_TYPES.find(t => t.id === section.type)?.icon;

  return (
    <div style={shell.wrap}>
      <button style={shell.header} onClick={() => setOpen(o => !o)}>
        <div style={shell.headerLeft}>
          {TypeIcon && <TypeIcon size={20} color={COLORS.violet} />}
          <span style={shell.label}>{section.type.charAt(0).toUpperCase() + section.type.slice(1)}</span>
        </div>
        {open ? <ChevronUp size={20} color="#888" /> : <ChevronDown size={20} color="#888" />}
      </button>
      {open && <div style={shell.body}>{children}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD SECTION MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function AddSectionModal({ onClose, onAdd }) {
  const [step, setStep] = useState("pick");
  const [selectedType, setSelectedType] = useState(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [picked, setPicked] = useState([]);

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
      await new Promise(r => setTimeout(r, 600));
      setSearchResults([
        { id: "r1", title: query + " — Result 1", subtitle: "Genre · 2022", image: `https://placehold.co/72x72/222/888?text=1` },
        { id: "r2", title: query + " — Result 2", subtitle: "Genre · 2021", image: `https://placehold.co/72x72/222/888?text=2` },
        { id: "r3", title: query + " — Result 3", subtitle: "Genre · 2020", image: `https://placehold.co/72x72/222/888?text=3` },
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
    onAdd({ id: `sec-${selectedType}-${Date.now()}`, type: selectedType, data: { items: picked } });
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
                  <Icon size={32} color={COLORS.violet} />
                  <span style={modal.typeLabel}>{label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button style={modal.back} onClick={() => setStep("pick")}>← Back</button>
            <p style={modal.title}>Add {selectedType}</p>

            <div style={modal.searchRow}>
              <input
                style={modal.searchInput}
                placeholder={`Search ${selectedType}…`}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
              <button style={modal.searchBtn} onClick={handleSearch}>
                {searching ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Search size={18} />}
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
                      {isSelected && <Check size={18} color="#7ec87e" />}
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
// ADD POST TAB MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function AddPostTabModal({ onClose, onAdd }) {
  const [tabName, setTabName] = useState("");

  const handleSave = () => {
    if (!tabName.trim()) return;
    const id = tabName.toLowerCase().replace(/\s+/g, "-");
    onAdd({ id, label: tabName });
    onClose();
  };

  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={modal.title}>New Tab</p>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, fontSize: 20 }} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <input
          style={modal.searchInput}
          placeholder="Tab name (e.g., Photography)"
          value={tabName}
          onChange={e => setTabName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSave()}
          autoFocus
        />
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button style={{ ...modal.saveBtn, flex: 1 }} onClick={handleSave}>Create</button>
          <button style={{ ...modal.cancelBtn, flex: 1 }} onClick={onClose}>Cancel</button>
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
    onSave({ displayName: displayName || user.username, bio });
    onClose();
  };

  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={modal.title}>Edit Profile</p>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, fontSize: 20 }} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={styles.label}>Display Name</label>
          <input
            style={modal.searchInput}
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="Your display name"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={styles.label}>Bio</label>
          <textarea
            style={{ ...modal.searchInput, minHeight: 100, fontFamily: FONT_BODY, resize: "none" }}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell us about yourself"
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ ...modal.saveBtn, flex: 1 }} onClick={handleSave}>Save Changes</button>
          <button style={{ ...modal.cancelBtn, flex: 1 }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function SettingsModal({ onClose }) {
  const [theme, setTheme] = useState("dark");

  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <p style={modal.title}>Settings</p>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, fontSize: 20 }} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.settingRow}>
          <span style={styles.settingLabel}>Theme</span>
          <select style={styles.settingSelect} value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div style={styles.settingRow}>
          <span style={styles.settingLabel}>Notifications</span>
          <input type="checkbox" defaultChecked style={{ width: 18, height: 18, cursor: "pointer" }} />
        </div>

        <div style={styles.settingRow}>
          <span style={styles.settingLabel}>Private Profile</span>
          <input type="checkbox" style={{ width: 18, height: 18, cursor: "pointer" }} />
        </div>

        <div style={styles.settingRow}>
          <span style={styles.settingLabel}>Language</span>
          <select style={styles.settingSelect} defaultValue="english">
            <option value="english">English</option>
            <option value="spanish">Español</option>
            <option value="french">Français</option>
          </select>
        </div>

        <hr style={{ borderColor: COLORS.border, margin: "20px 0", border: "none", borderTop: `1px solid ${COLORS.border}` }} />

        <button style={styles.logoutBtn}>Logout</button>
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
      {post.images && post.images.length > 0 && <img src={post.images[0]} alt="" style={card.img} />}
      <div style={card.actions}>
        <button style={{ ...card.btn, color: liked ? COLORS.maroon : "#777" }} onClick={() => { setLiked(l => !l); setLikes(n => liked ? n-1 : n+1); }}>
          {liked ? "♥" : "♡"} {likes}
        </button>
        <button style={card.btn}><MessageSquare size={14} /> {post.comments}</button>
        <button style={card.btn}>Share</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST FEED (infinite scroll)
// ═══════════════════════════════════════════════════════════════════════════════
function PostFeed({ activeTab }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
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
      {loading && <p style={{ textAlign: "center", color: "#555", fontSize: 15 }}>Loading…</p>}
      {!hasMore && posts.length > 0 && <p style={{ textAlign: "center", color: "#444", fontSize: 14, padding: "16px 0" }}>You've seen it all.</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOTTOM NAV
// ═══════════════════════════════════════════════════════════════════════════════
function BottomNav({ active }) {
  const items = [
    { id: "feed",          label: "Feed",    icon: Home },
    { id: "explore",       label: "Explore", icon: Compass },
    { id: "post",          label: "Post",    icon: Plus },
    { id: "notifications", label: "Alerts",  icon: Bell },
    { id: "profile",       label: "Profile", icon: User },
  ];
  return (
    <nav style={nav.bar}>
      {items.map(item => {
        const Icon = item.icon;
        return (
          <button key={item.id} style={{ ...nav.item, ...(active === item.id ? nav.active : {}) }}>
            <Icon size={22} />
            <span style={nav.label}>{item.label}</span>
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
  const [user, setUser] = useState(MOCK_USER);
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [postTabs, setPostTabs] = useState(INITIAL_POST_TABS);
  const [activeTab, setActiveTab] = useState(INITIAL_POST_TABS[0].id);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddTabModal, setShowAddTabModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleAddSection = (newSection) => {
    setSections(prev => [...prev, newSection]);
  };

  const handleAddPostTab = (newTab) => {
    setPostTabs(prev => [...prev, newTab]);
    setActiveTab(newTab.id);
  };

  const handleEditProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const renderSection = (sec) => {
    switch (sec.type) {
      case "music":  return <MusicSection  data={sec.data} />;
      case "games":  return <GamesSection  data={sec.data} />;
      case "anime":  return <AnimeSection  data={sec.data} />;
      default:       return <p style={{ color: "#555", fontSize: 14, padding: "8px 0" }}>No content yet.</p>;
    }
  };

  return (
    <div style={pg.page}>
      {/* Banner */}
      <div style={pg.banner}>
        <img src={user.bannerUrl} alt="" style={pg.bannerImg} />
      </div>

      {/* Avatar + Settings Button */}
      <div style={pg.avatarWrap}>
        <img src={user.avatarUrl} alt="avatar" style={pg.avatar} />
        {isOwnProfile && (
          <button style={pg.settingsBtn} onClick={() => setShowSettingsModal(true)} title="Settings">
            <Settings size={20} />
          </button>
        )}
      </div>

      {/* User info */}
      <div style={pg.userInfo}>
        <h2 style={pg.displayName}>{user.displayName || user.username}</h2>
        <p style={pg.handle}>@{user.username}</p>
        <p style={pg.bio}>{user.bio}</p>
        {isOwnProfile && <button style={pg.editBtn} onClick={() => setShowEditModal(true)}>Edit profile</button>}
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
            <Plus size={18} /> Add section
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
            <button style={pg.addTabBtn} onClick={() => setShowAddTabModal(true)} title="Add tab"><Plus size={18} /></button>
          )}
        </div>
      </div>

      {/* Posts */}
      <PostFeed activeTab={activeTab} />

      {/* Bottom nav */}
      <BottomNav active="profile" />

      {/* Modals */}
      {showAddModal && <AddSectionModal onClose={() => setShowAddModal(false)} onAdd={handleAddSection} />}
      {showAddTabModal && <AddPostTabModal onClose={() => setShowAddTabModal(false)} onAdd={handleAddPostTab} />}
      {showEditModal && <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onSave={handleEditProfile} />}
      {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE OBJECTS
// ═══════════════════════════════════════════════════════════════════════════════

// Page
const pg = {
  page:        { maxWidth: 680, margin: "0 auto", paddingBottom: 90, fontFamily: FONT_BODY, background: COLORS.bg, color: COLORS.text, minHeight: "100vh" },
  banner:      { width: "100%", height: 240, overflow: "hidden", background: "#1a1a1a" },
  bannerImg:   { width: "100%", height: "100%", objectFit: "cover" },
  avatarWrap:  { display: "flex", justifyContent: "center", position: "relative", marginTop: -90 },
  avatar:      { width: 180, height: 180, borderRadius: "50%", border: `6px solid ${COLORS.bg}`, objectFit: "cover", background: "#222" },
  settingsBtn: { position: "absolute", right: 12, bottom: 0, width: 48, height: 48, borderRadius: "50%", background: COLORS.violet, border: "none", color: COLORS.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease", boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)" },
  userInfo:    { textAlign: "center", padding: "18px 24px 24px" },
  displayName: { margin: "0 0 6px", fontSize: 32, fontWeight: 700, fontFamily: FONT_DISPLAY },
  handle:      { margin: "0 0 10px", color: COLORS.muted, fontSize: 16 },
  bio:         { margin: "0 0 16px", fontSize: 15, lineHeight: 1.7, color: "#bbb", maxWidth: 450, marginLeft: "auto", marginRight: "auto" },
  editBtn:     { padding: "10px 28px", borderRadius: 24, border: `2px solid ${COLORS.violet}`, background: "transparent", color: COLORS.violet, cursor: "pointer", fontSize: 15, fontWeight: 700, transition: "all 0.2s ease" },
  sectionsWrap:{ padding: "0 16px 12px" },
  addSectionBtn:{ display: "flex", alignItems: "center", gap: 10, width: "100%", justifyContent: "center", padding: "14px 0", background: "none", border: `2px dashed ${COLORS.violet}`, borderRadius: 12, color: COLORS.violet, cursor: "pointer", fontSize: 15, fontWeight: 700, marginTop: 12, transition: "all 0.2s ease" },
  tabBarWrap:  { position: "sticky", top: 0, zIndex: 10, background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` },
  tabBar:      { display: "flex", overflowX: "auto", padding: "0 16px", scrollbarWidth: "none", gap: 2 },
  tab:         { flexShrink: 0, padding: "16px 20px", background: "none", border: "none", borderBottom: "3px solid transparent", color: COLORS.muted, cursor: "pointer", fontSize: 15, fontWeight: 700, whiteSpace: "nowrap", fontFamily: FONT_BODY },
  tabActive:   { color: COLORS.text, borderBottomColor: COLORS.violet },
  addTabBtn:   { flexShrink: 0, padding: "16px 14px", background: "none", border: "none", color: COLORS.muted, cursor: "pointer", display: "flex", alignItems: "center" },
};

// Section shell
const shell = {
  wrap:       { borderBottom: `1px solid ${COLORS.border}` },
  header:     { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", color: COLORS.text, padding: "20px 0", cursor: "pointer" },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  label:      { fontSize: 18, fontWeight: 700, fontFamily: FONT_DISPLAY, letterSpacing: 0.5 },
  body:       { paddingBottom: 24 },
};

// Section content
const sec = {
  wrap:           { display: "flex", flexDirection: "column", gap: 24 },
  blockLabel:     { margin: "0 0 14px", fontSize: 12, letterSpacing: 2.5, color: COLORS.muted, fontFamily: FONT_BODY, fontWeight: 700, textTransform: "uppercase" },
  spotifyBtn:     { display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 10, border: "1px solid #1db954", background: "transparent", color: "#1db954", cursor: "pointer", fontSize: 14, fontWeight: 600 },
  spotifyConnected:{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 10, border: "1px solid #2a3a2a", background: "#0d1f0d", color: "#7ec87e", cursor: "pointer", fontSize: 14 },
  spotifyIcon:    { fontSize: 18 },
  trackList:      { display: "flex", flexDirection: "column", gap: 10 },
  trackCard:      { display: "flex", alignItems: "center", gap: 14, background: COLORS.surface, borderRadius: 10, padding: "12px 16px", border: `1px solid ${COLORS.border}` },
  trackNum:       { width: 22, textAlign: "center", color: COLORS.violet, fontSize: 15, fontFamily: FONT_DISPLAY, fontStyle: "italic", fontWeight: 700 },
  trackArt:       { width: 72, height: 72, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  trackInfo:      { display: "flex", flexDirection: "column", gap: 3 },
  trackTitle:     { fontSize: 16, fontWeight: 700, fontFamily: FONT_DISPLAY, color: COLORS.text },
  trackArtist:    { fontSize: 13, color: COLORS.muted },
  artistGrid:     { display: "flex", gap: 16, flexWrap: "wrap" },
  artistCard:     { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 100 },
  artistImg:      { width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: `3px solid ${COLORS.violet}` },
  artistName:     { fontSize: 13, color: "#bbb", textAlign: "center", lineHeight: 1.4, fontWeight: 600 },
  chipRow:        { display: "flex", flexWrap: "wrap", gap: 10 },
  chip:           { padding: "7px 16px", borderRadius: 24, border: `1px solid ${COLORS.border}`, background: COLORS.surface, fontSize: 14, color: "#bbb", fontFamily: FONT_BODY, fontWeight: 500 },
  statsRow:       { display: "flex", gap: 12, flexWrap: "wrap" },
  statPill:       { display: "flex", flexDirection: "column", padding: "12px 20px", borderRadius: 10, background: COLORS.surface, border: `1px solid ${COLORS.maroon}`, minWidth: 100 },
  statVal:        { fontSize: 19, fontWeight: 700, fontFamily: FONT_DISPLAY, color: COLORS.maroon },
  statKey:        { fontSize: 12, color: COLORS.muted, marginTop: 4, fontWeight: 600 },
  cardList:       { display: "flex", flexDirection: "column", gap: 12 },
  mediaCard:      { display: "flex", alignItems: "flex-start", gap: 14, background: COLORS.surface, borderRadius: 12, padding: "14px 16px", border: `1px solid ${COLORS.border}` },
  mediaRank:      { width: 26, paddingTop: 4, color: COLORS.maroon, fontSize: 16, fontFamily: FONT_DISPLAY, fontStyle: "italic", fontWeight: 700, flexShrink: 0 },
  mediaIcon:      { width: 96, height: 96, borderRadius: 12, objectFit: "cover", flexShrink: 0, border: `1px solid ${COLORS.border}` },
  mediaInfo:      { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  mediaTitle:     { fontSize: 17, fontWeight: 700, fontFamily: FONT_DISPLAY, color: COLORS.text },
  mediaSub:       { fontSize: 13, color: COLORS.muted, fontWeight: 500 },
  mediaThoughts:  { fontSize: 14, color: "#aaa", fontStyle: "italic", marginTop: 3 },
};

// Post card
const card = {
  wrap:    { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 14, overflow: "hidden" },
  meta:    { display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 10px" },
  avatar:  { width: 40, height: 40, borderRadius: "50%", objectFit: "cover" },
  author:  { fontWeight: 700, fontSize: 15 },
  time:    { fontSize: 13, color: COLORS.muted, marginLeft: "auto" },
  text:    { margin: "0 0 12px", padding: "0 16px", fontSize: 15, lineHeight: 1.6, color: "#ccc" },
  img:     { width: "100%", display: "block", maxHeight: 420, objectFit: "cover" },
  actions: { display: "flex", justifyContent: "space-around", padding: "12px 16px", borderTop: `1px solid ${COLORS.border}` },
  btn:     { background: "none", border: "none", color: "#777", cursor: "pointer", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 },
};

// Modal
const modal = {
  overlay:    { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  box:        { background: COLORS.surface, borderRadius: "20px 20px 0 0", padding: "28px 24px 48px", width: "100%", maxWidth: 680, maxHeight: "85vh", overflowY: "auto", border: `1px solid ${COLORS.border}` },
  title:      { margin: "0", fontSize: 26, fontWeight: 700, fontFamily: FONT_DISPLAY, color: COLORS.text },
  sub:        { margin: "0 0 24px", fontSize: 15, color: COLORS.muted },
  typeGrid:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 },
  typeCard:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "22px 14px", background: "#1a1a1a", border: `2px solid ${COLORS.border}`, borderRadius: 14, cursor: "pointer", color: COLORS.text, transition: "all 0.2s ease" },
  typeLabel:  { fontSize: 15, color: "#bbb", fontWeight: 600 },
  back:       { background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 15, marginBottom: 16, padding: 0, fontWeight: 600 },
  searchRow:  { display: "flex", gap: 10, marginBottom: 16 },
  searchInput:{ flex: 1, padding: "12px 16px", background: "#1a1a1a", border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text, fontSize: 15, fontFamily: FONT_BODY, outline: "none" },
  searchBtn:  { padding: "0 20px", background: COLORS.violet, border: "none", borderRadius: 10, color: COLORS.bg, cursor: "pointer", display: "flex", alignItems: "center", fontWeight: 600 },
  results:    { display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 },
  resultRow:  { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1px solid ${COLORS.border}`, cursor: "pointer", textAlign: "left", transition: "all 0.2s ease", background: "#1a1a1a" },
  resultImg:  { width: 64, height: 64, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  resultText: { display: "flex", flexDirection: "column", gap: 3, flex: 1 },
  resultTitle:{ fontSize: 15, color: COLORS.text, fontWeight: 600 },
  resultSub:  { fontSize: 13, color: COLORS.muted },
  pickedBar:  { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0 0", borderTop: `1px solid ${COLORS.border}` },
  pickedCount:{ fontSize: 14, color: COLORS.muted, fontWeight: 600 },
  saveBtn:    { padding: "12px 24px", borderRadius: 24, background: COLORS.violet, color: COLORS.bg, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700 },
  cancelBtn:  { padding: "12px 24px", borderRadius: 24, background: COLORS.surface, color: COLORS.text, border: `1px solid ${COLORS.border}`, cursor: "pointer", fontSize: 15, fontWeight: 700 },
};

// Nav
const nav = {
  bar:   { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 680, display: "flex", justifyContent: "space-around", background: COLORS.bg, borderTop: `1px solid ${COLORS.border}`, padding: "12px 0 18px", zIndex: 100 },
  item:  { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", color: COLORS.muted, cursor: "pointer", padding: "6px 12px", borderRadius: 10, transition: "all 0.2s ease" },
  active:{ color: COLORS.text },
  label: { fontSize: 11, fontWeight: 600 },
};

// Additional styles
const styles = {
  label:       { display: "block", fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 8 },
  settingRow:  { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${COLORS.border}` },
  settingLabel:{ fontSize: 15, fontWeight: 600, color: COLORS.text },
  settingSelect:{ padding: "10px 12px", background: "#1a1a1a", border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 15, cursor: "pointer" },
  logoutBtn:   { width: "100%", padding: "12px", borderRadius: 10, background: COLORS.maroon, color: COLORS.text, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700 },
};
