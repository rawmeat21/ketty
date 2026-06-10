import { useState, useEffect, useRef, useCallback } from "react";
import { 
  ChevronDown, ChevronUp, Plus, Music2, Gamepad2, Tv2, BookOpen, Film, 
  Search, Loader2, Check, Home, Compass, PlusSquare, Bell, User, 
  Settings, Heart, MessageCircle, Share2, Edit3, X, Camera, Link, Copy
} from "lucide-react";

// ── Google Fonts ────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:wght@300;400;500;700&display=swap";
document.head.appendChild(fontLink);

// ── Constants & Helpers ──────────────────────────────────────────────────────
const SECTION_TYPES = [
  { id: "music",  label: "Music",  icon: Music2  },
  { id: "games",  label: "Games",  icon: Gamepad2 },
  { id: "anime",  label: "Anime",  icon: Tv2      },
  { id: "books",  label: "Books",  icon: BookOpen },
  { id: "movies", label: "Movies", icon: Film     },
];

const getSectionColor = (type) => {
  switch (type) {
    case "music":  return "#9f1239"; // Premium Maroon
    case "games":  return "#6d28d9"; // Violet
    case "anime":  return "#4c1d95"; // Deep Violet
    case "books":  return "#881337"; // Dark Red / Deep Maroon
    case "movies": return "#5b21b6"; // Medium Purple-Violet
    default:       return "#27272a";
  }
};

// ── Mock Initial Profiles ───────────────────────────────────────────────────
const MOCK_USER = {
  id: "u_123",
  username: "prefetch",
  displayName: "Prefetch",
  bio: "I build things, make music, and design immersive digital spaces.",
  avatarUrl: "https://placehold.co/200x200/2d1b4e/ffffff?text=P",
  bannerUrl: "https://placehold.co/1200x400/0a0a0a/4c1d95?text=+", 
};

const INITIAL_SECTIONS = [
  {
    id: "sec-music", type: "music",
    data: {
      spotifyConnected: false,
      topTracks: [
        { title: "Bohemian Rhapsody", artist: "Queen", albumArt: "https://placehold.co/96x96/222/9f1239?text=♪" },
        { title: "Clair de Lune", artist: "Debussy", albumArt: "https://placehold.co/96x96/222/6d28d9?text=♪" },
        { title: "Redbone", artist: "Childish Gambino", albumArt: "https://placehold.co/96x96/222/4c1d95?text=♪" },
      ],
      topArtists: [
        { name: "Queen", image: "https://placehold.co/100x100/1a1a2e/aaa?text=Q" },
        { name: "Nujabes", image: "https://placehold.co/100x100/1a1a2e/aaa?text=N" },
      ],
      favGenres: ["Progressive Rock", "Jazz", "Lo-fi Hip Hop"],
    },
  },
  {
    id: "sec-games", type: "games",
    data: {
      topGames: [
        { title: "Hollow Knight", genre: "Metroidvania", hoursPlayed: 120, rating: "9/10", thoughts: "Peak indie gaming structure.", icon: "https://placehold.co/96x96/1a1a1a/6d28d9?text=HK" },
        { title: "Disco Elysium", genre: "RPG", hoursPlayed: 80, rating: "10/10", thoughts: "Masterpiece storytelling.", icon: "https://placehold.co/96x96/1a1a1a/9f1239?text=DE" },
      ],
      totalHours: 1240,
      favGenre: "Metroidvania",
    },
  },
];

const INITIAL_POST_TABS = [
  { id: "all",      label: "All"      },
  { id: "music",    label: "Music"    },
  { id: "origami",  label: "Origami"  },
  { id: "blogs",    label: "Blogs"    },
];

function fetchMockPosts(tabId, page) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = Array.from({ length: 4 }, (_, i) => ({
        id: `${tabId}-p${page}-${i}`,
        author: MOCK_USER,
        text: `Exploration log context entry sequential reference sequence dynamically mapped into tab ${tabId}. Node index item #${(page - 1) * 4 + i + 1}.`,
        images: i % 2 === 0 ? [`https://placehold.co/800x500/121214/6d28d9?text=Post+Showcase`] : [],
        likes: Math.floor(Math.random() * 400),
        comments: Math.floor(Math.random() * 60),
        liked: false,
        createdAt: `${i + 1}h ago`,
      }));
      resolve({ posts, hasMore: page < 3 });
    }, 500);
  });
}

const isOwnProfile = true;

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC COMPONENT SUBSECTIONS
// ═══════════════════════════════════════════════════════════════════════════════
function MusicSection({ data }) {
  const tracks = data.topTracks || data.items || [];
  return (
    <div style={sec.wrap}>
      <p style={sec.blockLabel}>TRACK SHOWCASE</p>
      <div style={sec.trackList}>
        {tracks.map((track, i) => (
          <div key={track.id || i} style={sec.trackCard}>
            <span style={sec.trackNum}>{i + 1}</span>
            <img src={track.albumArt || track.image} alt="" style={sec.trackArt} />
            <div style={sec.trackInfo}>
              <span style={sec.trackTitle}>{track.title}</span>
              <span style={sec.trackArtist}>{track.artist || track.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
      {data.topArtists && (
        <>
          <p style={sec.blockLabel}>FEATURED ARTISTS</p>
          <div style={sec.artistGrid}>
            {data.topArtists.map((artist, i) => (
              <div key={i} style={sec.artistCard}>
                <img src={artist.image} alt="" style={sec.artistImg} />
                <span style={sec.artistName}>{artist.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function GamesSection({ data }) {
  const games = data.topGames || data.items || [];
  return (
    <div style={sec.wrap}>
      <div style={sec.statsRow}>
        {data.totalHours && <div style={sec.statPill}><span style={sec.statVal}>{data.totalHours}h</span><span style={sec.statKey}>played</span></div>}
        {data.favGenre && <div style={sec.statPill}><span style={sec.statVal}>{data.favGenre}</span><span style={sec.statKey}>genre</span></div>}
      </div>
      <div style={sec.cardList}>
        {games.map((game, i) => (
          <div key={game.id || i} style={sec.mediaCard}>
            <div style={sec.mediaRank}>{i + 1}</div>
            <img src={game.icon || game.image} alt="" style={sec.mediaIcon} />
            <div style={sec.mediaInfo}>
              <span style={sec.mediaTitle}>{game.title}</span>
              <span style={sec.mediaSub}>{game.genre || game.subtitle}</span>
              {game.thoughts && <span style={sec.mediaThoughts}>{game.thoughts}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimeSection({ data }) {
  const animes = data.topAnime || data.items || [];
  return (
    <div style={sec.wrap}>
      <div style={sec.cardList}>
        {animes.map((anime, i) => (
          <div key={anime.id || i} style={sec.mediaCard}>
            <div style={sec.mediaRank}>{i + 1}</div>
            <img src={anime.cover || anime.image} alt="" style={{ ...sec.mediaIcon, borderRadius: 10 }} />
            <div style={sec.mediaInfo}>
              <span style={sec.mediaTitle}>{anime.title}</span>
              <span style={sec.mediaSub}>{anime.genre || anime.subtitle}</span>
              {anime.thoughts && <span style={sec.mediaThoughts}>{anime.thoughts}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIAL CONTAINER & DIALOGS
// ═══════════════════════════════════════════════════════════════════════════════
function SpecialSectionShell({ section, children }) {
  const [open, setOpen] = useState(false);
  const TypeIcon = SECTION_TYPES.find(t => t.id === section.type)?.icon;
  const targetBorderColor = getSectionColor(section.type);

  return (
    <div style={{
      ...shell.wrap,
      border: `1px solid ${targetBorderColor}`,
      boxShadow: open ? `0 4px 20px -5px ${targetBorderColor}40` : "none"
    }}>
      <button style={shell.header} onClick={() => setOpen(o => !o)}>
        <div style={shell.headerLeft}>
          {TypeIcon && <TypeIcon size={20} color={targetBorderColor} />}
          <span style={shell.label}>{section.type.toUpperCase()}</span>
        </div>
        {open ? <ChevronUp size={20} color="#a1a1aa" /> : <ChevronDown size={20} color="#a1a1aa" />}
      </button>
      {open && <div style={shell.body}>{children}</div>}
    </div>
  );
}

function ShareModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={modal.overlay} className="animate-overlay" onClick={onClose}>
      <div style={modal.box} className="animate-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <p style={modal.title}>Share Post</p>
          <button style={modal.iconBtn} onClick={onClose}><X size={22}/></button>
        </div>
        <div style={modal.shareGrid}>
          {/* WhatsApp */}
          <a href="https://api.whatsapp.com/send" target="_blank" rel="noreferrer" style={{...modal.shareItem, color: "#25D366"}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66.986 3.288 1.481 5.352 1.482 5.424 0 9.835-4.413 9.838-9.84.002-2.63-1.023-5.101-2.883-6.963C17.036 1.97 14.57 .945 12.008.945c-5.428 0-9.842 4.415-9.845 9.843-.001 2.11.557 3.716 1.564 5.32l-.995 3.633 3.725-.977z"/></svg>
            <span>WhatsApp</span>
          </a>
          {/* Instagram */}
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{...modal.shareItem, color: "#E1306C"}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            <span>Instagram</span>
          </a>
          {/* Twitter / X */}
          <a href="https://x.com" target="_blank" rel="noreferrer" style={{...modal.shareItem, color: "#ffffff"}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span>Twitter / X</span>
          </a>
          {/* Clipboard Copy */}
          <button onClick={handleCopy} style={{...modal.shareItem, color: "#a1a1aa", background: "none", border: "none", cursor: "pointer"}}>
            {copied ? <Check size={28} color="#10b981"/> : <Copy size={28} />}
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

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
        { id: `r1-${Date.now()}`, title: query + " · Alpha Matrix", subtitle: "Dynamic Entry Core · 2026", image: `https://placehold.co/96x96/1a1a2e/6d28d9?text=1` },
        { id: `r2-${Date.now()}`, title: query + " · Alternate Sequence", subtitle: "Premium Edition Vector · 2025", image: `https://placehold.co/96x96/1a1a2e/9f1239?text=2` },
      ]);
    } finally {
      setSearching(false);
    }
  };

  const togglePick = (item) => {
    setPicked(prev => prev.find(p => p.id === item.id) ? prev.filter(p => p.id !== item.id) : [...prev, item]);
  };

  const handleSave = () => {
    if (!selectedType || picked.length === 0) return;
    onAdd({ id: `sec-${Date.now()}`, type: selectedType, data: { items: picked } });
    onClose();
  };

  return (
    <div style={modal.overlay} className="animate-overlay" onClick={onClose}>
      <div style={modal.box} className="animate-box" onClick={e => e.stopPropagation()}>
        {step === "pick" ? (
          <>
            <p style={modal.title}>Add Showcase Component</p>
            <p style={modal.sub}>Select a specific type classification to feature:</p>
            <div style={modal.typeGrid}>
              {SECTION_TYPES.map(({ id, label, icon: Icon }) => (
                <button key={id} style={modal.typeCard} onClick={() => handleTypeSelect(id)}>
                  <Icon size={28} color={getSectionColor(id)} />
                  <span style={modal.typeLabel}>{label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button style={modal.back} onClick={() => setStep("pick")}>← Showcase Selections</button>
            <p style={modal.title}>Search {selectedType.toUpperCase()}</p>
            <div style={modal.searchRow}>
              <input
                style={modal.searchInput}
                placeholder={`Query string parameter…`}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
              <button style={modal.searchBtn} onClick={handleSearch}>
                {searching ? <Loader2 size={18} className="spin" /> : <Search size={18} />}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div style={modal.results}>
                {searchResults.map(item => {
                  const isSelected = picked.find(p => p.id === item.id);
                  return (
                    <button key={item.id} style={{ ...modal.resultRow, borderColor: isSelected ? "#6d28d9" : BORDER, background: isSelected ? "#1c1433" : SURFACE }} onClick={() => togglePick(item)}>
                      <img src={item.image} alt="" style={modal.resultImg} />
                      <div style={modal.resultText}>
                        <span style={modal.resultTitle}>{item.title}</span>
                        <span style={modal.resultSub}>{item.subtitle}</span>
                      </div>
                      {isSelected && <Check size={20} color="#8b5cf6" />}
                    </button>
                  );
                })}
              </div>
            )}

            {picked.length > 0 && (
              <div style={modal.pickedBar}>
                <span style={modal.pickedCount}>{picked.length} selected</span>
                <button style={modal.saveBtn} onClick={handleSave}>Apply to Showcase</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EditProfileModal({ onClose }) {
  return (
    <div style={modal.overlay} className="animate-overlay" onClick={onClose}>
      <div style={modal.box} className="animate-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <p style={modal.title}>Edit Profile Configuration</p>
          <button style={modal.iconBtn} onClick={onClose}><X size={22}/></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={modal.label}>Display Label Identifier</label>
            <input style={{...modal.searchInput, width: "100%"}} defaultValue={MOCK_USER.displayName} />
          </div>
          <div>
            <label style={modal.label}>Biography Summary Context</label>
            <textarea style={{...modal.searchInput, width: "100%", height: 80, resize: "none"}} defaultValue={MOCK_USER.bio} />
          </div>
          <button style={{...modal.saveBtn, width: "100%", marginTop: 8}} onClick={onClose}>Commit Alterations</button>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ onClose }) {
  return (
    <div style={modal.overlay} className="animate-overlay" onClick={onClose}>
      <div style={modal.box} className="animate-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <p style={modal.title}>System Options</p>
          <button style={modal.iconBtn} onClick={onClose}><X size={22}/></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button style={modal.settingsRow}>Credential & Security Matrix</button>
          <button style={modal.settingsRow}>Push Notification Channels</button>
          <button style={modal.settingsRow}>Data Export & Privacy</button>
          <button style={{...modal.settingsRow, color: "#e11d48"}}>Terminate Session (Log Out)</button>
        </div>
      </div>
    </div>
  );
}

function AddTabModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  return (
    <div style={modal.overlay} className="animate-overlay" onClick={onClose}>
      <div style={modal.box} className="animate-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={modal.title}>Instantiate Feed Stream Tab</p>
          <button style={modal.iconBtn} onClick={onClose}><X size={22}/></button>
        </div>
        <input 
          style={{ ...modal.searchInput, width: "100%", marginBottom: 16 }} 
          placeholder="e.g., Architecture, Devlogs..." 
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
        <button 
          style={{ ...modal.saveBtn, width: "100%" }} 
          onClick={() => { if(name.trim()) { onSave(name); onClose(); } }}>
          Build Stream Track
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST PRESENTATION ENTITIES
// ═══════════════════════════════════════════════════════════════════════════════
function PostCard({ post, onShareClick }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  return (
    <div style={card.wrap}>
      <div style={card.meta}>
        <img src={post.author.avatarUrl} alt="" style={card.avatar} />
        <span style={card.author}>{post.author.displayName || post.author.username}</span>
        <span style={card.time}>{post.createdAt}</span>
      </div>
      {post.text && <p style={card.text}>{post.text}</p>}
      {post.images.length > 0 && <img src={post.images[0]} alt="" style={card.img} />}
      <div style={card.actions}>
        <button style={{ ...card.btn, color: liked ? "#e11d48" : "#a1a1aa" }} onClick={() => { setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1); }}>
          <Heart size={20} fill={liked ? "#e11d48" : "none"} /> {likes}
        </button>
        <button style={card.btn}><MessageCircle size={20} /> {post.comments}</button>
        <button style={card.btn} onClick={onShareClick}><Share2 size={20} /> Distribution</button>
      </div>
    </div>
  );
}

function PostFeed({ activeTab, onSharePost }) {
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

  useEffect(() => { loadMore(); }, [activeTab]);

  const sentinelRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) loadMore();
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  return (
    <div style={{ padding: "16px" }}>
      {posts.map(p => <PostCard key={p.id} post={p} onShareClick={onSharePost} />)}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && <p style={{ textAlign: "center", color: "#666", fontSize: 15 }}>Awaiting buffer segment sequence…</p>}
      {!hasMore && posts.length > 0 && <p style={{ textAlign: "center", color: "#444", fontSize: 14, padding: "24px 0" }}>Terminal index boundary confirmed.</p>}
    </div>
  );
}

function BottomNav({ active }) {
  const items = [
    { id: "feed",          label: "Home",    icon: Home },
    { id: "explore",       label: "Explore", icon: Compass },
    { id: "post",          label: "Create",  icon: PlusSquare },
    { id: "notifications", label: "Alerts",  icon: Bell },
    { id: "profile",       label: "Identity", icon: User },
  ];
  return (
    <nav style={nav.bar}>
      {items.map(item => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button key={item.id} style={{ ...nav.item, ...(isActive ? nav.active : {}) }}>
            <Icon size={26} color={isActive ? "#f4f4f5" : "#666"} />
            <span style={nav.label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CORE PARENT CONTROLLER ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ProfilePage() {
  const [sections, setSections]       = useState(INITIAL_SECTIONS);
  const [postTabs, setPostTabs]       = useState(INITIAL_POST_TABS);
  const [activeTab, setActiveTab]     = useState(INITIAL_POST_TABS[0].id);
  
  // Dialog visibility controls
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddTab, setShowAddTab]         = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings]     = useState(false);
  const [showShare, setShowShare]           = useState(false);

  const handleAddSection = (newSection) => {
    setSections(prev => {
      const existsIndex = prev.findIndex(s => s.type === newSection.type);
      if (existsIndex >= 0) {
        const updated = [...prev];
        const target = updated[existsIndex];
        const combined = [...(target.data.items || target.data.topTracks || target.data.topGames || []), ...(newSection.data.items || [])];
        updated[existsIndex] = { ...target, data: { ...target.data, items: combined } };
        return updated;
      }
      return [...prev, newSection];
    });
  };

  const handleCreatePostTab = (name) => {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    setPostTabs(prev => [...prev, { id, label: name }]);
  };

  const renderSectionContent = (sec) => {
    switch (sec.type) {
      case "music":  return <MusicSection data={sec.data} />;
      case "games":  return <GamesSection data={sec.data} />;
      case "anime":  return <AnimeSection data={sec.data} />;
      default:       return <p style={{ color: "#555", fontSize: 14, padding: "8px 0" }}>Matrix partition void.</p>;
    }
  };

  return (
    <div style={pg.page}>
      {/* Structural Animation Node Injection */}
      <style>{`
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalScaleUp { 
          from { transform: scale(0.94); opacity: 0; } 
          to { transform: scale(1); opacity: 1; } 
        }
        .animate-overlay { animation: modalFadeIn 0.22s ease-out forwards; }
        .animate-box { animation: modalScaleUp 0.28s cubic-bezier(0.34, 1.4, 0.64, 1) forwards; }
        .spin { animation: rotationRef 1s linear infinite; }
        @keyframes rotationRef { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={pg.banner}>
        <img src={MOCK_USER.bannerUrl} alt="" style={pg.bannerImg} />
        {isOwnProfile && <button style={pg.bannerEditBtn}><Camera size={18}/></button>}
      </div>

      <div style={pg.topControls}>
        <div style={pg.avatarWrap}>
          <img src={MOCK_USER.avatarUrl} alt="" style={pg.avatar} />
          {isOwnProfile && <button style={pg.avatarEditBtn}><Camera size={18}/></button>}
        </div>
        {isOwnProfile && (
          <button style={pg.settingsBtn} onClick={() => setShowSettings(true)}>
            <Settings size={24} color="#a1a1aa" />
          </button>
        )}
      </div>

      <div style={pg.userInfo}>
        <h2 style={pg.displayName}>{MOCK_USER.displayName || MOCK_USER.username}</h2>
        <p style={pg.handle}>@{MOCK_USER.username}</p>
        <p style={pg.bio}>{MOCK_USER.bio}</p>
        {isOwnProfile && (
          <button style={pg.editProfileBtn} onClick={() => setShowEditProfile(true)}>
            <Edit3 size={16} /> Update Profile Configuration
          </button>
        )}
      </div>

      <div style={pg.sectionsWrap}>
        {sections.map(sec => (
          <SpecialSectionShell key={sec.id} section={sec}>
            {renderSectionContent(sec)}
          </SpecialSectionShell>
        ))}
        {isOwnProfile && (
          <button style={pg.addSectionBtn} onClick={() => setShowAddSection(true)}>
            <Plus size={20} /> Include Showcase Track
          </button>
        )}
      </div>

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
            <button style={pg.addTabBtn} onClick={() => setShowAddTab(true)}><Plus size={20} /></button>
          )}
        </div>
      </div>

      <PostFeed activeTab={activeTab} onSharePost={() => setShowShare(true)} />
      <BottomNav active="profile" />

      {/* Synchronous Portal Modals */}
      {showAddSection && <AddSectionModal onClose={() => setShowAddSection(false)} onAdd={handleAddSection} />}
      {showAddTab && <AddTabModal onClose={() => setShowAddTab(false)} onSave={handleCreatePostTab} />}
      {showEditProfile && <EditProfileModal onClose={() => setShowEditProfile(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARALLEL PALETTE STYLING STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════
const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
const FONT_BODY    = "'Roboto', 'Segoe UI', sans-serif";
const BG           = "#09090b"; 
const SURFACE      = "#121214"; 
const BORDER       = "#27272a";
const TEXT         = "#f4f4f5";
const MUTED        = "#a1a1aa";

const pg = {
  page:          { maxWidth: 680, margin: "0 auto", paddingBottom: 110, fontFamily: FONT_BODY, background: BG, color: TEXT, minHeight: "100vh" },
  banner:        { width: "100%", height: 230, overflow: "hidden", background: "#121214", position: "relative" },
  bannerImg:     { width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 },
  bannerEditBtn: { position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", padding: 10, borderRadius: "50%", cursor: "pointer" },
  topControls:   { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0 24px", marginTop: -100, position: "relative", zIndex: 2 },
  avatarWrap:    { position: "relative" },
  avatar:        { width: 170, height: 170, borderRadius: "50%", border: `6px solid ${BG}`, objectFit: "cover", background: SURFACE },
  avatarEditBtn: { position: "absolute", bottom: 8, right: 8, background: SURFACE, border: `2px solid ${BORDER}`, color: TEXT, padding: 10, borderRadius: "50%", cursor: "pointer" },
  settingsBtn:   { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "50%", padding: 12, cursor: "pointer", marginTop: 110 },
  userInfo:      { textAlign: "center", padding: "20px 24px 32px" },
  displayName:   { margin: "0 0 6px", fontSize: 34, fontWeight: 700, fontFamily: FONT_DISPLAY, letterSpacing: 0.5 },
  handle:        { margin: "0 0 14px", color: MUTED, fontSize: 17 },
  bio:           { margin: "0 0 24px", fontSize: 16, lineHeight: 1.6, color: "#d4d4d8", maxWidth: 480, marginLeft: "auto", marginRight: "auto" },
  editProfileBtn:{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 26px", borderRadius: 30, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, cursor: "pointer", fontSize: 15, fontWeight: 500 },
  sectionsWrap:  { padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 14 },
  addSectionBtn: { display: "flex", alignItems: "center", gap: 8, width: "100%", justifyContent: "center", padding: "16px 0", background: "none", border: `1px dashed ${BORDER}`, borderRadius: 14, color: MUTED, cursor: "pointer", fontSize: 15, fontWeight: 500 },
  tabBarWrap:    { position: "sticky", top: 0, zIndex: 10, background: `rgba(9, 9, 11, 0.9)`, backdropFilter: "blur(8px)", borderBottom: `1px solid ${BORDER}` },
  tabBar:        { display: "flex", overflowX: "auto", padding: "0 16px", scrollbarWidth: "none", gap: 8 },
  tab:           { flexShrink: 0, padding: "18px 14px", background: "none", border: "none", borderBottom: "3px solid transparent", color: MUTED, cursor: "pointer", fontSize: 16, fontWeight: 500, whiteSpace: "nowrap" },
  tabActive:     { color: TEXT, borderBottomColor: "#6d28d9" },
  addTabBtn:     { flexShrink: 0, padding: "18px 10px", background: "none", border: "none", color: MUTED, cursor: "pointer", display: "flex", alignItems: "center" },
};

const shell = {
  wrap:       { borderRadius: "14px", padding: "0 18px", background: SURFACE, overflow: "hidden", transition: "all 0.3s ease" },
  header:     { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", color: TEXT, padding: "22px 0", cursor: "pointer" },
  headerLeft: { display: "flex", alignItems: "center", gap: 14 },
  label:      { fontSize: 16, fontWeight: 700, letterSpacing: 1 },
  body:       { paddingBottom: 26 },
};

const sec = {
  wrap:            { display: "flex", flexDirection: "column", gap: 24 },
  blockLabel:      { margin: "0 0 12px", fontSize: 12, letterSpacing: 2, color: MUTED, fontWeight: 600 },
  trackList:       { display: "flex", flexDirection: "column", gap: 12 },
  trackCard:       { display: "flex", alignItems: "center", gap: 16, background: BG, borderRadius: 12, padding: "14px 18px", border: `1px solid ${BORDER}` },
  trackNum:        { width: 24, textAlign: "center", color: MUTED, fontSize: 16, fontFamily: FONT_DISPLAY, fontStyle: "italic" },
  trackArt:        { width: 72, height: 72, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  trackInfo:       { display: "flex", flexDirection: "column", gap: 4 },
  trackTitle:      { fontSize: 17, fontWeight: 600, fontFamily: FONT_DISPLAY, color: TEXT },
  trackArtist:     { fontSize: 14, color: MUTED },
  artistGrid:      { display: "flex", gap: 16, flexWrap: "wrap" },
  artistCard:      { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 100 },
  artistImg:       { width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: `2px solid ${BORDER}` },
  artistName:      { fontSize: 13, color: "#d4d4d8", textAlign: "center" },
  statsRow:        { display: "flex", gap: 12, flexWrap: "wrap" },
  statPill:        { display: "flex", flexDirection: "column", padding: "14px 22px", borderRadius: 12, background: BG, border: `1px solid ${BORDER}`, minWidth: 110 },
  statVal:         { fontSize: 22, fontWeight: 700, fontFamily: FONT_DISPLAY, color: TEXT },
  statKey:         { fontSize: 12, color: MUTED, marginTop: 4, textTransform: "uppercase" },
  cardList:        { display: "flex", flexDirection: "column", gap: 14 },
  mediaCard:       { display: "flex", alignItems: "flex-start", gap: 18, background: BG, borderRadius: 12, padding: "18px", border: `1px solid ${BORDER}` },
  mediaRank:       { width: 24, paddingTop: 4, color: MUTED, fontSize: 16, fontFamily: FONT_DISPLAY, fontStyle: "italic", flexShrink: 0 },
  mediaIcon:       { width: 96, height: 96, borderRadius: 8, objectFit: "cover", flexShrink: 0, border: `1px solid ${BORDER}` },
  mediaInfo:       { display: "flex", flexDirection: "column", gap: 6, flex: 1 },
  mediaTitle:      { fontSize: 19, fontWeight: 600, fontFamily: FONT_DISPLAY, color: TEXT },
  mediaSub:        { fontSize: 14, color: MUTED },
  mediaThoughts:   { fontSize: 14, color: "#a1a1aa", fontStyle: "italic", marginTop: 4 },
};

const card = {
  wrap:    { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, marginBottom: 18, overflow: "hidden" },
  meta:    { display: "flex", alignItems: "center", gap: 12, padding: "18px 18px 14px" },
  avatar:  { width: 40, height: 40, borderRadius: "50%", objectFit: "cover" },
  author:  { fontWeight: 600, fontSize: 16, color: TEXT },
  time:    { fontSize: 13, color: MUTED, marginLeft: "auto" },
  text:    { margin: "0 0 16px", padding: "0 18px", fontSize: 16, lineHeight: 1.6, color: "#d4d4d8" },
  img:     { width: "100%", display: "block", maxHeight: 520, objectFit: "cover" },
  actions: { display: "flex", justifyContent: "center", gap: 44, padding: "16px", borderTop: `1px solid ${BORDER}` },
  btn:     { background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 15, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 },
};

const modal = {
  overlay:    { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(5px)", padding: 20 },
  box:        { background: BG, borderRadius: 20, padding: "32px 28px", width: "100%", maxWidth: 540, maxHeight: "85vh", overflowY: "auto", border: `1px solid ${BORDER}`, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7)" },
  title:      { margin: "0 0 6px", fontSize: 24, fontWeight: 700, fontFamily: FONT_DISPLAY, color: TEXT },
  sub:        { margin: "0 0 24px", fontSize: 15, color: MUTED },
  typeGrid:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 },
  typeCard:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "26px 14px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, cursor: "pointer", color: TEXT },
  typeLabel:  { fontSize: 15, color: "#d4d4d8", fontWeight: 500 },
  back:       { background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 15, marginBottom: 18, padding: 0 },
  searchRow:  { display: "flex", gap: 10, marginBottom: 20 },
  searchInput:{ flex: 1, padding: "14px 16px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT, fontSize: 16, outline: "none" },
  searchBtn:  { padding: "0 22px", background: "#27272a", border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT, cursor: "pointer", display: "flex", alignItems: "center" },
  results:    { display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 },
  resultRow:  { display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderRadius: 12, border: `1px solid ${BORDER}`, cursor: "pointer", textAlign: "left" },
  resultImg:  { width: 68, height: 68, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  resultText: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  resultTitle:{ fontSize: 17, color: TEXT, fontWeight: 500 },
  resultSub:  { fontSize: 14, color: MUTED },
  pickedBar:  { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0 0", borderTop: `1px solid ${BORDER}` },
  pickedCount:{ fontSize: 15, color: MUTED },
  saveBtn:    { padding: "14px 32px", borderRadius: 30, background: TEXT, color: BG, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600 },
  iconBtn:    { background: "none", border: "none", color: MUTED, cursor: "pointer" },
  label:      { display: "block", marginBottom: 8, color: MUTED, fontSize: 14, fontWeight: 500 },
  settingsRow:{ width: "100%", textAlign: "left", padding: "18px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT, fontSize: 16, cursor: "pointer" },
  shareGrid:  { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 },
  shareItem:  { display: "flex", alignItems: "center", gap: 14, padding: "16px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, textDecoration: "none", fontSize: 15, fontWeight: 600 }
};

const nav = {
  bar:   { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 680, display: "flex", justifyContent: "space-around", background: `rgba(9, 9, 11, 0.95)`, backdropFilter: "blur(12px)", borderTop: `1px solid ${BORDER}`, padding: "14px 0 24px", zIndex: 100 },
  item:  { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "6px 14px", borderRadius: 12 },
  active:{ color: TEXT },
  label: { fontSize: 12, fontWeight: 500, color: MUTED },
};