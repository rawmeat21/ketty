// import { useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import api from '../api/axios'
// import ProfileHeader from '../components/ProfileHeader'
// import HobbyTabs from '../components/HobbyTabs'
// import EntryCard from '../components/EntryCard'
// import PostCard from '../components/PostCard'

// export default function Profile() {
//   const { username } = useParams()
//   const [profile, setProfile] = useState(null)
//   const [hobbies, setHobbies] = useState([])
//   const [posts, setPosts] = useState([])
//   const [activeTab, setActiveTab] = useState('personal')
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     fetchProfile()
//   }, [username])

//   const fetchProfile = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const [profileRes, hobbiesRes, postsRes] = await Promise.all([
//         api.get(`/api/profile/${username}`),
//         api.get(`/api/hobbies/user/${username}`),
//         api.get(`/api/posts/user/${username}`)
//       ])
//       setProfile(profileRes.data)
//       setHobbies(hobbiesRes.data)
//       setPosts(postsRes.data)
//     } catch (err) {
//       setError('Failed to load profile')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleLikeToggle = (postId, newLikeCount) => {
//     setPosts(prev => prev.map(post =>
//       post.id === postId
//         ? {
//             ...post,
//             likeCount: newLikeCount,
//             likedByCurrentUser: !post.likedByCurrentUser
//           }
//         : post
//     ))
//   }

//   const getTabContent = () => {
//     if (activeTab === 'personal') {
//       const personalPosts = posts.filter(p => p.hobbyName === null)
//       return { entries: [], posts: personalPosts }
//     }

//     const hobby = hobbies.find(h => h.slug === activeTab)
//     if (!hobby) return { entries: [], posts: [] }

//     const hobbyPosts = posts.filter(p => p.hobbyId === hobby.id)

//     return { entries: hobby.entries, posts: hobbyPosts }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//         <p className="text-gray-400">Loading...</p>
//       </div>
//     )
//   }

//   if (error || !profile) {
//     return (
//       <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//         <p className="text-red-400">{error || 'Profile not found'}</p>
//       </div>
//     )
//   }

//   const { entries, posts: tabPosts } = getTabContent()

//   return (
//     <div className="min-h-screen bg-[#09090b] py-8 px-4">
//       <div className="max-w-xl mx-auto space-y-5">

//         <ProfileHeader profile={profile} />

//         <HobbyTabs
//           hobbies={hobbies}
//           activeTab={activeTab}
//           onTabChange={setActiveTab}
//         />

//         <div className="space-y-4">

//           {entries.length > 0 && (
//             <div className="space-y-4">
//               {entries.map(entry => (
//                 <EntryCard key={entry.id} entry={entry} />
//               ))}
//             </div>
//           )}

//           {tabPosts.length > 0 && (
//             <div className="space-y-4">
//               {tabPosts.map(post => (
//                 <PostCard
//                   key={post.id}
//                   post={post}
//                   onLikeToggle={handleLikeToggle}
//                   onComment={fetchProfile}
//                 />
//               ))}
//             </div>
//           )}

//           {entries.length === 0 && tabPosts.length === 0 && (
//             <div className="text-center py-12">
//               <p className="text-gray-500">Nothing here yet</p>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   )
// }


// import { useState, useEffect, useRef, useCallback } from "react";
// import { ChevronDown, ChevronUp, Plus, Music2, Gamepad2, Tv2, BookOpen, Film, ExternalLink, Search, Loader2, Check, Shuffle } from "lucide-react";

// // ── Google Fonts ────────────────────────────────────────────────────────────
// const fontLink = document.createElement("link");
// fontLink.rel = "stylesheet";
// fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:wght@300;400;500;700&display=swap";
// document.head.appendChild(fontLink);

// // ── Constants ───────────────────────────────────────────────────────────────
// const SECTION_TYPES = [
//   { id: "music",  label: "Music",  icon: Music2  },
//   { id: "games",  label: "Games",  icon: Gamepad2 },
//   { id: "anime",  label: "Anime",  icon: Tv2      },
//   { id: "books",  label: "Books",  icon: BookOpen },
//   { id: "movies", label: "Movies", icon: Film     },
// ];

// // ── Mock user ────────────────────────────────────────────────────────────────
// // TODO: GET /api/users/:username
// const MOCK_USER = {
//   id: "u_123",
//   username: "prefetch",
//   displayName: "Prefetch",
//   bio: "I build things, make music, and fold paper.",
//   avatarUrl: "https://placehold.co/160x160",
//   bannerUrl: "https://placehold.co/1200x340/1a1a2e/ffffff?text=.",
// };

// // ── Mock section data ────────────────────────────────────────────────────────
// // TODO: GET /api/users/:username/special-sections  →  array of { id, type, data }
// const INITIAL_SECTIONS = [
//   {
//     id: "sec-music", type: "music",
//     data: {
//       spotifyConnected: false,
//       topTracks: [
//         { title: "Bohemian Rhapsody", artist: "Queen",         albumArt: "https://placehold.co/56x56/222/aaa?text=♪" },
//         { title: "Clair de Lune",     artist: "Debussy",       albumArt: "https://placehold.co/56x56/222/aaa?text=♪" },
//         { title: "Redbone",           artist: "Childish Gambino", albumArt: "https://placehold.co/56x56/222/aaa?text=♪" },
//         { title: "Gravity",           artist: "John Mayer",    albumArt: "https://placehold.co/56x56/222/aaa?text=♪" },
//         { title: "Stairway to Heaven","artist": "Led Zeppelin", albumArt: "https://placehold.co/56x56/222/aaa?text=♪" },
//       ],
//       topArtists: [
//         { name: "Queen",            image: "https://placehold.co/80x80/2a2a2a/aaa?text=Q"  },
//         { name: "John Coltrane",    image: "https://placehold.co/80x80/2a2a2a/aaa?text=JC" },
//         { name: "Nujabes",          image: "https://placehold.co/80x80/2a2a2a/aaa?text=N"  },
//         { name: "Childish Gambino", image: "https://placehold.co/80x80/2a2a2a/aaa?text=CG" },
//       ],
//       favGenres: ["Progressive Rock", "Jazz", "Lo-fi Hip Hop", "Classical"],
//     },
//   },
//   {
//     id: "sec-games", type: "games",
//     data: {
//       topGames: [
//         { title: "Hollow Knight",   genre: "Metroidvania", hoursPlayed: 120, rating: "9/10", thoughts: "Peak indie gaming.",         icon: "https://placehold.co/72x72/1a1a1a/888?text=HK" },
//         { title: "Disco Elysium",   genre: "RPG",          hoursPlayed: 80,  rating: "10/10", thoughts: "Nothing like it.",          icon: "https://placehold.co/72x72/1a1a1a/888?text=DE" },
//         { title: "Outer Wilds",     genre: "Adventure",    hoursPlayed: 22,  rating: "10/10", thoughts: "Emotional gut punch.",      icon: "https://placehold.co/72x72/1a1a1a/888?text=OW" },
//         { title: "Celeste",         genre: "Platformer",   hoursPlayed: 40,  rating: "9/10", thoughts: "Brilliant level design.",    icon: "https://placehold.co/72x72/1a1a1a/888?text=C"  },
//         { title: "Hades",           genre: "Roguelite",    hoursPlayed: 200, rating: "9/10", thoughts: "Can't stop playing it.",     icon: "https://placehold.co/72x72/1a1a1a/888?text=H"  },
//       ],
//       totalHours: 1240,
//       favGenre: "Metroidvania",
//     },
//   },
//   {
//     id: "sec-anime", type: "anime",
//     data: {
//       topAnime: [
//         { title: "Ping Pong The Animation", genre: "Sports",      episodes: 11,  status: "Completed", thoughts: "Masterpiece of expression.", cover: "https://placehold.co/72x72/1a1a1a/888?text=PP" },
//         { title: "Mushishi",                genre: "Slice of Life", episodes: 26, status: "Completed", thoughts: "Deeply calming.",            cover: "https://placehold.co/72x72/1a1a1a/888?text=M"  },
//         { title: "Vinland Saga",            genre: "Historical",   episodes: 48,  status: "Completed", thoughts: "Stunning character arcs.",   cover: "https://placehold.co/72x72/1a1a1a/888?text=VS" },
//         { title: "Monster",                 genre: "Thriller",     episodes: 74,  status: "Completed", thoughts: "Slow burn perfection.",       cover: "https://placehold.co/72x72/1a1a1a/888?text=Mo" },
//         { title: "Dungeon Meshi",           genre: "Fantasy",      episodes: 24,  status: "Watching",  thoughts: "Best seasonal in years.",     cover: "https://placehold.co/72x72/1a1a1a/888?text=DM" },
//       ],
//       favGenre: "Slice of Life",
//     },
//   },
// ];

// // ── Mock post tabs ────────────────────────────────────────────────────────────
// // TODO: GET /api/users/:username/post-tabs
// const INITIAL_POST_TABS = [
//   { id: "all",      label: "All"      },
//   { id: "music",    label: "Music"    },
//   { id: "origami",  label: "Origami"  },
//   { id: "painting", label: "Painting" },
//   { id: "blogs",    label: "Blogs"    },
// ];

// // ── Mock post fetch (infinite scroll) ────────────────────────────────────────
// // TODO: GET /api/users/:username/posts?tab=:tabId&page=:page&limit=8
// function fetchMockPosts(tabId, page) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const posts = Array.from({ length: 6 }, (_, i) => ({
//         id: `${tabId}-p${page}-${i}`,
//         author: MOCK_USER,
//         text: `Post #${(page - 1) * 6 + i + 1} in ${tabId}.`,
//         images: i % 3 === 0 ? [`https://placehold.co/600x400/111/555?text=Post+${(page-1)*6+i+1}`] : [],
//         likes: Math.floor(Math.random() * 300),
//         comments: Math.floor(Math.random() * 40),
//         liked: false,
//         createdAt: `${i + 1}h ago`,
//       }));
//       resolve({ posts, hasMore: page < 3 });
//     }, 600);
//   });
// }

// // ── Auth helper ───────────────────────────────────────────────────────────────
// // TODO: replace with real auth context (e.g. useAuth())
// const isOwnProfile = true;

// // ═══════════════════════════════════════════════════════════════════════════════
// // MUSIC SECTION
// // ═══════════════════════════════════════════════════════════════════════════════
// function MusicSection({ data, onUpdate }) {
//   const handleSpotifySync = () => {
//     // TODO: POST /api/integrations/spotify/connect  →  redirects to Spotify OAuth
//     // On callback: GET /api/integrations/spotify/sync  →  pulls top tracks & artists
//     alert("Redirect to Spotify OAuth flow");
//   };

//   return (
//     <div style={sec.wrap}>
//       {/* Spotify sync banner */}
//       {isOwnProfile && (
//         <button style={data.spotifyConnected ? sec.spotifyConnected : sec.spotifyBtn} onClick={handleSpotifySync}>
//           <span style={sec.spotifyIcon}>♫</span>
//           {data.spotifyConnected ? "Synced with Spotify" : "Connect Spotify to auto-sync"}
//         </button>
//       )}

//       {/* Top Tracks */}
//       <p style={sec.blockLabel}>TOP TRACKS</p>
//       <div style={sec.trackList}>
//         {data.topTracks.map((track, i) => (
//           <div key={i} style={sec.trackCard}>
//             <span style={sec.trackNum}>{i + 1}</span>
//             <img src={track.albumArt} alt="" style={sec.trackArt} />
//             <div style={sec.trackInfo}>
//               <span style={sec.trackTitle}>{track.title}</span>
//               <span style={sec.trackArtist}>{track.artist}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Top Artists */}
//       <p style={sec.blockLabel}>TOP ARTISTS</p>
//       <div style={sec.artistGrid}>
//         {data.topArtists.map((artist, i) => (
//           <div key={i} style={sec.artistCard}>
//             <img src={artist.image} alt={artist.name} style={sec.artistImg} />
//             <span style={sec.artistName}>{artist.name}</span>
//           </div>
//         ))}
//       </div>

//       {/* Fav Genres */}
//       <p style={sec.blockLabel}>FAVOURITE GENRES</p>
//       <div style={sec.chipRow}>
//         {data.favGenres.map((g) => <span key={g} style={sec.chip}>{g}</span>)}
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // GAMES SECTION
// // ═══════════════════════════════════════════════════════════════════════════════
// function GamesSection({ data }) {
//   return (
//     <div style={sec.wrap}>
//       <div style={sec.statsRow}>
//         <div style={sec.statPill}><span style={sec.statVal}>{data.totalHours}h</span><span style={sec.statKey}>played</span></div>
//         <div style={sec.statPill}><span style={sec.statVal}>{data.favGenre}</span><span style={sec.statKey}>fav genre</span></div>
//       </div>

//       <p style={sec.blockLabel}>TOP GAMES</p>
//       <div style={sec.cardList}>
//         {data.topGames.map((game, i) => (
//           <div key={i} style={sec.mediaCard}>
//             <div style={sec.mediaRank}>{i + 1}</div>
//             <img src={game.icon} alt={game.title} style={sec.mediaIcon} />
//             <div style={sec.mediaInfo}>
//               <span style={sec.mediaTitle}>{game.title}</span>
//               <span style={sec.mediaSub}>{game.genre} · {game.hoursPlayed}h · {game.rating}</span>
//               <span style={sec.mediaThoughts}>{game.thoughts}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ANIME SECTION
// // ═══════════════════════════════════════════════════════════════════════════════
// function AnimeSection({ data }) {
//   return (
//     <div style={sec.wrap}>
//       <div style={sec.statsRow}>
//         <div style={sec.statPill}><span style={sec.statVal}>{data.favGenre}</span><span style={sec.statKey}>fav genre</span></div>
//       </div>

//       <p style={sec.blockLabel}>TOP ANIME</p>
//       <div style={sec.cardList}>
//         {data.topAnime.map((anime, i) => (
//           <div key={i} style={sec.mediaCard}>
//             <div style={sec.mediaRank}>{i + 1}</div>
//             <img src={anime.cover} alt={anime.title} style={{ ...sec.mediaIcon, borderRadius: 6 }} />
//             <div style={sec.mediaInfo}>
//               <span style={sec.mediaTitle}>{anime.title}</span>
//               <span style={sec.mediaSub}>{anime.genre} · {anime.episodes} ep · <span style={{ color: anime.status === "Watching" ? "#7ec87e" : "#666" }}>{anime.status}</span></span>
//               <span style={sec.mediaThoughts}>{anime.thoughts}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // SECTION SHELL (collapsible)
// // ═══════════════════════════════════════════════════════════════════════════════
// function SpecialSectionShell({ section, children }) {
//   const [open, setOpen] = useState(false);
//   const TypeIcon = SECTION_TYPES.find(t => t.id === section.type)?.icon;

//   return (
//     <div style={shell.wrap}>
//       <button style={shell.header} onClick={() => setOpen(o => !o)}>
//         <div style={shell.headerLeft}>
//           {TypeIcon && <TypeIcon size={16} color="#888" />}
//           <span style={shell.label}>{section.type.charAt(0).toUpperCase() + section.type.slice(1)}</span>
//         </div>
//         {open ? <ChevronUp size={16} color="#555" /> : <ChevronDown size={16} color="#555" />}
//       </button>
//       {open && <div style={shell.body}>{children}</div>}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ADD SECTION MODAL
// // ═══════════════════════════════════════════════════════════════════════════════
// function AddSectionModal({ onClose, onAdd }) {
//   const [step, setStep] = useState("pick");   // "pick" | "form"
//   const [selectedType, setSelectedType] = useState(null);
//   const [query, setQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [searching, setSearching] = useState(false);
//   const [picked, setPicked] = useState([]);   // items user has selected

//   const handleTypeSelect = (type) => {
//     setSelectedType(type);
//     setStep("form");
//     setPicked([]);
//     setQuery("");
//     setSearchResults([]);
//   };

//   const handleSearch = async () => {
//     if (!query.trim()) return;
//     setSearching(true);
//     setSearchResults([]);

//     try {
//       // Route search query to appropriate backend proxy endpoint
//       // Backend uses the right API key and returns a normalised { id, title, subtitle, image } array
//       let endpoint = "";
//       if (selectedType === "games")  endpoint = `/api/search/games?q=${encodeURIComponent(query)}`;
//       // TODO: GET /api/search/games?q=  →  backend proxies RAWG /games
//       if (selectedType === "anime")  endpoint = `/api/search/anime?q=${encodeURIComponent(query)}`;
//       // TODO: GET /api/search/anime?q=  →  backend proxies Jikan /anime
//       if (selectedType === "music")  endpoint = `/api/search/artists?q=${encodeURIComponent(query)}`;
//       // TODO: GET /api/search/artists?q=  →  backend proxies Last.fm artist.search
//       if (selectedType === "books")  endpoint = `/api/search/books?q=${encodeURIComponent(query)}`;
//       // TODO: GET /api/search/books?q=  →  backend proxies Google Books /volumes
//       if (selectedType === "movies") endpoint = `/api/search/movies?q=${encodeURIComponent(query)}`;
//       // TODO: GET /api/search/movies?q=  →  backend proxies TMDB /search/movie

//       // const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
//       // const json = await res.json();
//       // setSearchResults(json.results);

//       // ── MOCK while backend isn't wired ──────────────────────────────────
//       await new Promise(r => setTimeout(r, 600));
//       setSearchResults([
//         { id: "r1", title: query + " — Result 1", subtitle: "Genre · 2022", image: `https://placehold.co/56x56/222/888?text=1` },
//         { id: "r2", title: query + " — Result 2", subtitle: "Genre · 2021", image: `https://placehold.co/56x56/222/888?text=2` },
//         { id: "r3", title: query + " — Result 3", subtitle: "Genre · 2020", image: `https://placehold.co/56x56/222/888?text=3` },
//       ]);
//       // ────────────────────────────────────────────────────────────────────
//     } finally {
//       setSearching(false);
//     }
//   };

//   const togglePick = (item) => {
//     setPicked(prev =>
//       prev.find(p => p.id === item.id)
//         ? prev.filter(p => p.id !== item.id)
//         : [...prev, item]
//     );
//   };

//   const handleSave = () => {
//     if (!selectedType || picked.length === 0) return;
//     // TODO: POST /api/users/:username/special-sections
//     // Body: { type: selectedType, items: picked }
//     // Returns: the created section object with id
//     onAdd({ id: `sec-${Date.now()}`, type: selectedType, data: { items: picked } });
//     onClose();
//   };

//   return (
//     <div style={modal.overlay} onClick={onClose}>
//       <div style={modal.box} onClick={e => e.stopPropagation()}>
//         {step === "pick" ? (
//           <>
//             <p style={modal.title}>Add a section</p>
//             <p style={modal.sub}>What do you want to showcase?</p>
//             <div style={modal.typeGrid}>
//               {SECTION_TYPES.map(({ id, label, icon: Icon }) => (
//                 <button key={id} style={modal.typeCard} onClick={() => handleTypeSelect(id)}>
//                   <Icon size={24} color="#aaa" />
//                   <span style={modal.typeLabel}>{label}</span>
//                 </button>
//               ))}
//             </div>
//           </>
//         ) : (
//           <>
//             <button style={modal.back} onClick={() => setStep("pick")}>← Back</button>
//             <p style={modal.title}>Add {selectedType}</p>

//             {/* Spotify special case for music */}
//             {selectedType === "music" && (
//               <button style={modal.spotifyPill} onClick={() => {
//                 // TODO: POST /api/integrations/spotify/connect
//                 alert("Spotify OAuth redirect");
//               }}>
//                 ♫ Import from Spotify instead
//               </button>
//             )}

//             <div style={modal.searchRow}>
//               <input
//                 style={modal.searchInput}
//                 placeholder={`Search ${selectedType}…`}
//                 value={query}
//                 onChange={e => setQuery(e.target.value)}
//                 onKeyDown={e => e.key === "Enter" && handleSearch()}
//               />
//               <button style={modal.searchBtn} onClick={handleSearch}>
//                 {searching ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
//               </button>
//             </div>

//             {searchResults.length > 0 && (
//               <div style={modal.results}>
//                 {searchResults.map(item => {
//                   const isSelected = picked.find(p => p.id === item.id);
//                   return (
//                     <button key={item.id} style={{ ...modal.resultRow, background: isSelected ? "#1e2a1e" : "#1a1a1a" }} onClick={() => togglePick(item)}>
//                       <img src={item.image} alt="" style={modal.resultImg} />
//                       <div style={modal.resultText}>
//                         <span style={modal.resultTitle}>{item.title}</span>
//                         <span style={modal.resultSub}>{item.subtitle}</span>
//                       </div>
//                       {isSelected && <Check size={16} color="#7ec87e" />}
//                     </button>
//                   );
//                 })}
//               </div>
//             )}

//             {picked.length > 0 && (
//               <div style={modal.pickedBar}>
//                 <span style={modal.pickedCount}>{picked.length} selected</span>
//                 <button style={modal.saveBtn} onClick={handleSave}>Save section</button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // POST CARD
// // ═══════════════════════════════════════════════════════════════════════════════
// function PostCard({ post }) {
//   const [liked, setLiked] = useState(post.liked);
//   const [likes, setLikes] = useState(post.likes);

//   return (
//     <div style={card.wrap}>
//       <div style={card.meta}>
//         <img src={post.author.avatarUrl} alt="" style={card.avatar} />
//         <span style={card.author}>{post.author.displayName}</span>
//         <span style={card.time}>{post.createdAt}</span>
//       </div>
//       {post.text && <p style={card.text}>{post.text}</p>}
//       {post.images.length > 0 && <img src={post.images[0]} alt="" style={card.img} />}
//       <div style={card.actions}>
//         <button style={{ ...card.btn, color: liked ? "#e05c5c" : "#777" }} onClick={() => { setLiked(l => !l); setLikes(n => liked ? n-1 : n+1); /* TODO: POST /api/posts/:id/like */ }}>
//           {liked ? "♥" : "♡"} {likes}
//         </button>
//         <button style={card.btn}>💬 {post.comments}{/* TODO: open comments */}</button>
//         <button style={card.btn}>🔗 Share{/* TODO: share sheet */}</button>
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // POST FEED (infinite scroll)
// // ═══════════════════════════════════════════════════════════════════════════════
// function PostFeed({ activeTab }) {
//   const [posts, setPosts]     = useState([]);
//   const [page, setPage]       = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const observer = useRef(null);

//   useEffect(() => { setPosts([]); setPage(1); setHasMore(true); }, [activeTab]);

//   const loadMore = useCallback(async () => {
//     if (loading || !hasMore) return;
//     setLoading(true);
//     const { posts: p, hasMore: m } = await fetchMockPosts(activeTab, page);
//     setPosts(prev => [...prev, ...p]);
//     setHasMore(m);
//     setPage(n => n + 1);
//     setLoading(false);
//   }, [activeTab, page, loading, hasMore]);

//   useEffect(() => { loadMore(); }, [activeTab]); // eslint-disable-line

//   const sentinelRef = useCallback(node => {
//     if (observer.current) observer.current.disconnect();
//     observer.current = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && hasMore) loadMore();
//     });
//     if (node) observer.current.observe(node);
//   }, [loading, hasMore, loadMore]);

//   return (
//     <div style={{ padding: "12px 16px" }}>
//       {posts.map(p => <PostCard key={p.id} post={p} />)}
//       <div ref={sentinelRef} style={{ height: 1 }} />
//       {loading && <p style={{ textAlign: "center", color: "#555", fontSize: 13 }}>Loading…</p>}
//       {!hasMore && posts.length > 0 && <p style={{ textAlign: "center", color: "#444", fontSize: 12, padding: "16px 0" }}>You've seen it all.</p>}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // BOTTOM NAV
// // ═══════════════════════════════════════════════════════════════════════════════
// function BottomNav({ active }) {
//   const items = [
//     { id: "feed",          label: "Feed",    icon: "🏠" },
//     { id: "explore",       label: "Explore", icon: "🔍" },
//     { id: "post",          label: "Post",    icon: "➕" },
//     { id: "notifications", label: "Alerts",  icon: "🔔" },
//     { id: "profile",       label: "Profile", icon: "👤" },
//   ];
//   return (
//     <nav style={nav.bar}>
//       {items.map(item => (
//         <button key={item.id} style={{ ...nav.item, ...(active === item.id ? nav.active : {}) }}
//           onClick={() => { /* TODO: React Router navigate(`/${item.id}`) */ }}>
//           <span style={{ fontSize: 20 }}>{item.icon}</span>
//           <span style={nav.label}>{item.label}</span>
//         </button>
//       ))}
//     </nav>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // PROFILE PAGE
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function ProfilePage() {
//   const [sections, setSections]       = useState(INITIAL_SECTIONS);
//   const [postTabs, setPostTabs]       = useState(INITIAL_POST_TABS);
//   const [activeTab, setActiveTab]     = useState(INITIAL_POST_TABS[0].id);
//   const [showAddModal, setShowAddModal] = useState(false);

//   const handleAddSection = (newSection) => {
//     setSections(prev => [...prev, newSection]);
//     // TODO: section already saved via POST inside modal; here we just update local state
//   };

//   const handleAddPostTab = () => {
//     const name = prompt("Tab name:");
//     if (!name) return;
//     // TODO: POST /api/users/:username/post-tabs  { label: name }
//     const id = name.toLowerCase().replace(/\s+/g, "-");
//     setPostTabs(prev => [...prev, { id, label: name }]);
//   };

//   const renderSection = (sec) => {
//     switch (sec.type) {
//       case "music":  return <MusicSection  data={sec.data} />;
//       case "games":  return <GamesSection  data={sec.data} />;
//       case "anime":  return <AnimeSection  data={sec.data} />;
//       default:       return <p style={{ color: "#555", fontSize: 13, padding: "8px 0" }}>No content yet.</p>;
//     }
//   };

//   return (
//     <div style={pg.page}>
//       {/* Banner */}
//       <div style={pg.banner}>
//         <img src={MOCK_USER.bannerUrl} alt="" style={pg.bannerImg} />
//       </div>

//       {/* Avatar */}
//       <div style={pg.avatarWrap}>
//         <img src={MOCK_USER.avatarUrl} alt="avatar" style={pg.avatar} />
//       </div>

//       {/* User info */}
//       <div style={pg.userInfo}>
//         <h2 style={pg.displayName}>{MOCK_USER.displayName}</h2>
//         <p style={pg.handle}>@{MOCK_USER.username}</p>
//         <p style={pg.bio}>{MOCK_USER.bio}</p>
//         {isOwnProfile && <button style={pg.editBtn}>Edit profile{/* TODO: navigate to /settings/profile */}</button>}
//       </div>

//       {/* Special sections */}
//       <div style={pg.sectionsWrap}>
//         {sections.map(sec => (
//           <SpecialSectionShell key={sec.id} section={sec}>
//             {renderSection(sec)}
//           </SpecialSectionShell>
//         ))}
//         {isOwnProfile && (
//           <button style={pg.addSectionBtn} onClick={() => setShowAddModal(true)}>
//             <Plus size={14} /> Add section
//           </button>
//         )}
//       </div>

//       {/* Post tabs */}
//       <div style={pg.tabBarWrap}>
//         <div style={pg.tabBar}>
//           {postTabs.map(tab => (
//             <button key={tab.id}
//               style={{ ...pg.tab, ...(activeTab === tab.id ? pg.tabActive : {}) }}
//               onClick={() => setActiveTab(tab.id)}>
//               {tab.label}
//             </button>
//           ))}
//           {isOwnProfile && (
//             <button style={pg.addTabBtn} onClick={handleAddPostTab}><Plus size={14} /></button>
//           )}
//         </div>
//       </div>

//       {/* Posts */}
//       <PostFeed activeTab={activeTab} />

//       {/* Bottom nav */}
//       <BottomNav active="profile" />

//       {/* Add section modal */}
//       {showAddModal && <AddSectionModal onClose={() => setShowAddModal(false)} onAdd={handleAddSection} />}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // STYLE OBJECTS
// // ═══════════════════════════════════════════════════════════════════════════════

// const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
// const FONT_BODY    = "'Roboto', 'Segoe UI', sans-serif";
// const BG           = "#0c0c0c";
// const SURFACE      = "#141414";
// const BORDER       = "#222";
// const TEXT         = "#e8e8e8";
// const MUTED        = "#666";

// // Page
// const pg = {
//   page:        { maxWidth: 680, margin: "0 auto", paddingBottom: 90, fontFamily: FONT_BODY, background: BG, color: TEXT, minHeight: "100vh" },
//   banner:      { width: "100%", height: 190, overflow: "hidden", background: "#1a1a1a" },
//   bannerImg:   { width: "100%", height: "100%", objectFit: "cover" },
//   avatarWrap:  { display: "flex", justifyContent: "center", marginTop: -64 },
//   avatar:      { width: 128, height: 128, borderRadius: "50%", border: "4px solid #0c0c0c", objectFit: "cover", background: "#222" },
//   userInfo:    { textAlign: "center", padding: "12px 24px 20px" },
//   displayName: { margin: "0 0 4px", fontSize: 26, fontWeight: 700, fontFamily: FONT_DISPLAY },
//   handle:      { margin: "0 0 8px", color: MUTED, fontSize: 14 },
//   bio:         { margin: "0 0 14px", fontSize: 14, lineHeight: 1.6, color: "#bbb", maxWidth: 400, marginLeft: "auto", marginRight: "auto" },
//   editBtn:     { padding: "6px 20px", borderRadius: 20, border: "1px solid #444", background: "transparent", color: TEXT, cursor: "pointer", fontSize: 13 },
//   sectionsWrap:{ padding: "0 16px 8px" },
//   addSectionBtn:{ display: "flex", alignItems: "center", gap: 6, width: "100%", justifyContent: "center", padding: "10px 0", background: "none", border: `1px dashed #2a2a2a`, borderRadius: 8, color: MUTED, cursor: "pointer", fontSize: 13, marginTop: 8 },
//   tabBarWrap:  { position: "sticky", top: 0, zIndex: 10, background: BG, borderBottom: `1px solid ${BORDER}` },
//   tabBar:      { display: "flex", overflowX: "auto", padding: "0 16px", scrollbarWidth: "none", gap: 2 },
//   tab:         { flexShrink: 0, padding: "12px 16px", background: "none", border: "none", borderBottom: "2px solid transparent", color: MUTED, cursor: "pointer", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", fontFamily: FONT_BODY },
//   tabActive:   { color: TEXT, borderBottomColor: TEXT },
//   addTabBtn:   { flexShrink: 0, padding: "12px 10px", background: "none", border: "none", color: MUTED, cursor: "pointer", display: "flex", alignItems: "center" },
// };

// // Section shell
// const shell = {
//   wrap:       { borderBottom: `1px solid ${BORDER}` },
//   header:     { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", color: TEXT, padding: "15px 0", cursor: "pointer" },
//   headerLeft: { display: "flex", alignItems: "center", gap: 8 },
//   label:      { fontSize: 15, fontWeight: 600, fontFamily: FONT_DISPLAY, letterSpacing: 0.3 },
//   body:       { paddingBottom: 20 },
// };

// // Section content
// const sec = {
//   wrap:           { display: "flex", flexDirection: "column", gap: 20 },
//   blockLabel:     { margin: "0 0 10px", fontSize: 11, letterSpacing: 2, color: MUTED, fontFamily: FONT_BODY, fontWeight: 500 },

//   // Spotify
//   spotifyBtn:     { display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, border: "1px solid #1db954", background: "transparent", color: "#1db954", cursor: "pointer", fontSize: 13, fontWeight: 500 },
//   spotifyConnected:{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, border: "1px solid #2a3a2a", background: "#0d1f0d", color: "#7ec87e", cursor: "pointer", fontSize: 13 },
//   spotifyIcon:    { fontSize: 16 },

//   // Tracks
//   trackList:      { display: "flex", flexDirection: "column", gap: 8 },
//   trackCard:      { display: "flex", alignItems: "center", gap: 12, background: SURFACE, borderRadius: 8, padding: "10px 14px", border: `1px solid ${BORDER}` },
//   trackNum:       { width: 18, textAlign: "center", color: MUTED, fontSize: 13, fontFamily: FONT_DISPLAY, fontStyle: "italic" },
//   trackArt:       { width: 46, height: 46, borderRadius: 6, objectFit: "cover", flexShrink: 0 },
//   trackInfo:      { display: "flex", flexDirection: "column", gap: 2 },
//   trackTitle:     { fontSize: 15, fontWeight: 600, fontFamily: FONT_DISPLAY, color: TEXT },
//   trackArtist:    { fontSize: 12, color: MUTED },

//   // Artists
//   artistGrid:     { display: "flex", gap: 12, flexWrap: "wrap" },
//   artistCard:     { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 72 },
//   artistImg:      { width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `2px solid ${BORDER}` },
//   artistName:     { fontSize: 11, color: "#bbb", textAlign: "center", lineHeight: 1.3 },

//   // Genres/chips
//   chipRow:        { display: "flex", flexWrap: "wrap", gap: 8 },
//   chip:           { padding: "5px 14px", borderRadius: 20, border: `1px solid #2a2a2a`, background: SURFACE, fontSize: 13, color: "#bbb", fontFamily: FONT_BODY },

//   // Stats row
//   statsRow:       { display: "flex", gap: 10, flexWrap: "wrap" },
//   statPill:       { display: "flex", flexDirection: "column", padding: "8px 16px", borderRadius: 8, background: SURFACE, border: `1px solid ${BORDER}`, minWidth: 80 },
//   statVal:        { fontSize: 16, fontWeight: 700, fontFamily: FONT_DISPLAY, color: TEXT },
//   statKey:        { fontSize: 11, color: MUTED, marginTop: 2 },

//   // Media cards (games / anime)
//   cardList:       { display: "flex", flexDirection: "column", gap: 10 },
//   mediaCard:      { display: "flex", alignItems: "flex-start", gap: 12, background: SURFACE, borderRadius: 10, padding: "12px 14px", border: `1px solid ${BORDER}` },
//   mediaRank:      { width: 20, paddingTop: 2, color: MUTED, fontSize: 13, fontFamily: FONT_DISPLAY, fontStyle: "italic", flexShrink: 0 },
//   mediaIcon:      { width: 64, height: 64, borderRadius: 10, objectFit: "cover", flexShrink: 0, border: `1px solid #2a2a2a` },
//   mediaInfo:      { display: "flex", flexDirection: "column", gap: 3, flex: 1 },
//   mediaTitle:     { fontSize: 16, fontWeight: 600, fontFamily: FONT_DISPLAY, color: TEXT },
//   mediaSub:       { fontSize: 12, color: MUTED },
//   mediaThoughts:  { fontSize: 13, color: "#aaa", fontStyle: "italic", marginTop: 2 },
// };

// // Post card
// const card = {
//   wrap:    { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, marginBottom: 12, overflow: "hidden" },
//   meta:    { display: "flex", alignItems: "center", gap: 8, padding: "12px 14px 8px" },
//   avatar:  { width: 30, height: 30, borderRadius: "50%", objectFit: "cover" },
//   author:  { fontWeight: 600, fontSize: 13 },
//   time:    { fontSize: 12, color: MUTED, marginLeft: "auto" },
//   text:    { margin: "0 0 10px", padding: "0 14px", fontSize: 14, lineHeight: 1.6, color: "#ccc" },
//   img:     { width: "100%", display: "block", maxHeight: 400, objectFit: "cover" },
//   actions: { display: "flex", justifyContent: "center", gap: 32, padding: "10px 14px", borderTop: `1px solid ${BORDER}` },
//   btn:     { background: "none", border: "none", color: "#777", cursor: "pointer", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 },
// };

// // Modal
// const modal = {
//   overlay:    { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" },
//   box:        { background: "#141414", borderRadius: "16px 16px 0 0", padding: "24px 20px 40px", width: "100%", maxWidth: 680, maxHeight: "85vh", overflowY: "auto", border: `1px solid ${BORDER}` },
//   title:      { margin: "0 0 4px", fontSize: 20, fontWeight: 700, fontFamily: FONT_DISPLAY, color: TEXT },
//   sub:        { margin: "0 0 20px", fontSize: 14, color: MUTED },
//   typeGrid:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
//   typeCard:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 10px", background: "#1a1a1a", border: `1px solid ${BORDER}`, borderRadius: 10, cursor: "pointer", color: TEXT },
//   typeLabel:  { fontSize: 13, color: "#bbb" },
//   back:       { background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 13, marginBottom: 12, padding: 0 },
//   spotifyPill:{ display: "block", width: "100%", padding: "10px", marginBottom: 14, borderRadius: 8, border: "1px solid #1db954", background: "transparent", color: "#1db954", cursor: "pointer", fontSize: 13 },
//   searchRow:  { display: "flex", gap: 8, marginBottom: 12 },
//   searchInput:{ flex: 1, padding: "10px 14px", background: "#1a1a1a", border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, fontSize: 14, fontFamily: FONT_BODY, outline: "none" },
//   searchBtn:  { padding: "0 16px", background: "#222", border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, cursor: "pointer", display: "flex", alignItems: "center" },
//   results:    { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
//   resultRow:  { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, cursor: "pointer", textAlign: "left" },
//   resultImg:  { width: 48, height: 48, borderRadius: 6, objectFit: "cover", flexShrink: 0 },
//   resultText: { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
//   resultTitle:{ fontSize: 14, color: TEXT },
//   resultSub:  { fontSize: 12, color: MUTED },
//   pickedBar:  { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0 0", borderTop: `1px solid ${BORDER}` },
//   pickedCount:{ fontSize: 13, color: MUTED },
//   saveBtn:    { padding: "8px 20px", borderRadius: 20, background: TEXT, color: "#0c0c0c", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 },
// };

// // Nav
// const nav = {
//   bar:   { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 680, display: "flex", justifyContent: "space-around", background: BG, borderTop: `1px solid ${BORDER}`, padding: "8px 0 14px", zIndex: 100 },
//   item:  { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", color: MUTED, cursor: "pointer", padding: "4px 12px", borderRadius: 8 },
//   active:{ color: TEXT },
//   label: { fontSize: 10, fontWeight: 500 },
// };

// import { useState, useEffect, useRef, useCallback } from "react";
// import { 
//   ChevronDown, ChevronUp, Plus, Music2, Gamepad2, Tv2, BookOpen, Film, 
//   ExternalLink, Search, Loader2, Check, Settings, Home, Compass, MessageSquare, 
//   Bell, User, LogOut, Moon, Sun, Lock, Mail, Eye, EyeOff, Upload, X
// } from "lucide-react";

// // ── Google Fonts ────────────────────────────────────────────────────────────
// const fontLink = document.createElement("link");
// fontLink.rel = "stylesheet";
// fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:wght@300;400;500;700&display=swap";
// document.head.appendChild(fontLink);

// // ── Constants ─────────────��─────────────────────────────────────────────────
// const SECTION_TYPES = [
//   { id: "music",  label: "Music",  icon: Music2  },
//   { id: "games",  label: "Games",  icon: Gamepad2 },
//   { id: "anime",  label: "Anime",  icon: Tv2      },
//   { id: "books",  label: "Books",  icon: BookOpen },
//   { id: "movies", label: "Movies", icon: Film     },
// ];

// // ── Colors ───────────────────────────────────────────────────────────────────
// const COLORS = {
//   bg: "#0c0c0c",
//   surface: "#141414",
//   border: "#222",
//   text: "#e8e8e8",
//   muted: "#666",
//   accent: {
//     violet: "#7c3aed",
//     violetDark: "#5b21b6",
//     maroon: "#dc2626",
//     maroonDark: "#991b1b",
//   }
// };

// const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
// const FONT_BODY = "'Roboto', 'Segoe UI', sans-serif";

// // ── API Helper ───────────────────────────────────────────────────────────────
// const API_BASE = "http://localhost:/api";

// const apiCall = async (endpoint, options = {}) => {
//   const token = localStorage.getItem("authToken");
//   const headers = {
//     "Content-Type": "application/json",
//     ...(token && { Authorization: `Bearer ${token}` }),
//     ...options.headers,
//   };
  
//   const response = await fetch(`${API_BASE}${endpoint}`, {
//     ...options,
//     headers,
//   });
  
//   if (!response.ok) throw new Error(`API Error: ${response.status}`);
//   return response.json();
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// // MUSIC SECTION
// // ═══════════════════════════════════════════════════════════════════════════════
// function MusicSection({ data, onUpdate }) {
//   const handleSpotifySync = () => {
//     alert("Redirect to Spotify OAuth flow");
//   };

//   return (
//     <div style={sec.wrap}>
//       {data.spotifyConnected && (
//         <button style={sec.spotifyConnected} onClick={handleSpotifySync}>
//           <span style={sec.spotifyIcon}>♫</span>
//           Synced with Spotify
//         </button>
//       )}

//       {data.topTracks && data.topTracks.length > 0 && (
//         <>
//           <p style={sec.blockLabel}>TOP TRACKS</p>
//           <div style={sec.trackList}>
//             {data.topTracks.map((track, i) => (
//               <div key={i} style={sec.trackCard}>
//                 <span style={sec.trackNum}>{i + 1}</span>
//                 <img src={track.albumArt || "https://placehold.co/64x64"} alt="" style={sec.trackArt} />
//                 <div style={sec.trackInfo}>
//                   <span style={sec.trackTitle}>{track.title}</span>
//                   <span style={sec.trackArtist}>{track.artist}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {data.topArtists && data.topArtists.length > 0 && (
//         <>
//           <p style={sec.blockLabel}>TOP ARTISTS</p>
//           <div style={sec.artistGrid}>
//             {data.topArtists.map((artist, i) => (
//               <div key={i} style={sec.artistCard}>
//                 <img src={artist.image || "https://placehold.co/96x96"} alt={artist.name} style={sec.artistImg} />
//                 <span style={sec.artistName}>{artist.name}</span>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {data.favGenres && data.favGenres.length > 0 && (
//         <>
//           <p style={sec.blockLabel}>FAVOURITE GENRES</p>
//           <div style={sec.chipRow}>
//             {data.favGenres.map((g) => <span key={g} style={sec.chip}>{g}</span>)}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // GAMES SECTION
// // ═══════════════════════════════════════════════════════════════════════════════
// function GamesSection({ data }) {
//   return (
//     <div style={sec.wrap}>
//       {data.totalHours && (
//         <div style={sec.statsRow}>
//           <div style={sec.statPill}><span style={sec.statVal}>{data.totalHours}h</span><span style={sec.statKey}>played</span></div>
//           {data.favGenre && <div style={sec.statPill}><span style={sec.statVal}>{data.favGenre}</span><span style={sec.statKey}>fav genre</span></div>}
//         </div>
//       )}

//       {data.topGames && data.topGames.length > 0 && (
//         <>
//           <p style={sec.blockLabel}>TOP GAMES</p>
//           <div style={sec.cardList}>
//             {data.topGames.map((game, i) => (
//               <div key={i} style={sec.mediaCard}>
//                 <div style={sec.mediaRank}>{i + 1}</div>
//                 <img src={game.icon || "https://placehold.co/96x96"} alt={game.title} style={sec.mediaIcon} />
//                 <div style={sec.mediaInfo}>
//                   <span style={sec.mediaTitle}>{game.title}</span>
//                   <span style={sec.mediaSub}>{game.genre} · {game.hoursPlayed}h · {game.rating}</span>
//                   <span style={sec.mediaThoughts}>{game.thoughts}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ANIME SECTION
// // ═══════════════════════════════════════════════════════════════════════════════
// function AnimeSection({ data }) {
//   return (
//     <div style={sec.wrap}>
//       {data.favGenre && (
//         <div style={sec.statsRow}>
//           <div style={sec.statPill}><span style={sec.statVal}>{data.favGenre}</span><span style={sec.statKey}>fav genre</span></div>
//         </div>
//       )}

//       {data.topAnime && data.topAnime.length > 0 && (
//         <>
//           <p style={sec.blockLabel}>TOP ANIME</p>
//           <div style={sec.cardList}>
//             {data.topAnime.map((anime, i) => (
//               <div key={i} style={sec.mediaCard}>
//                 <div style={sec.mediaRank}>{i + 1}</div>
//                 <img src={anime.cover || "https://placehold.co/96x96"} alt={anime.title} style={{ ...sec.mediaIcon, borderRadius: 6 }} />
//                 <div style={sec.mediaInfo}>
//                   <span style={sec.mediaTitle}>{anime.title}</span>
//                   <span style={sec.mediaSub}>{anime.genre} · {anime.episodes} ep · <span style={{ color: anime.status === "Watching" ? "#7ec87e" : "#666" }}>{anime.status}</span></span>
//                   <span style={sec.mediaThoughts}>{anime.thoughts}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// // ══════════════════════════════════��════════════════════════════════════════════
// // SECTION SHELL (collapsible)
// // ═══════════════════════════════════════════════════════════════════════════════
// function SpecialSectionShell({ section, children, onDelete }) {
//   const [open, setOpen] = useState(true);
//   const TypeIcon = SECTION_TYPES.find(t => t.id === section.type)?.icon;

//   return (
//     <div style={shell.wrap}>
//       <button style={shell.header} onClick={() => setOpen(o => !o)}>
//         <div style={shell.headerLeft}>
//           {TypeIcon && <TypeIcon size={18} color={COLORS.accent.violet} />}
//           <span style={shell.label}>{section.type.charAt(0).toUpperCase() + section.type.slice(1)}</span>
//         </div>
//         <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//           {open ? <ChevronUp size={18} color="#555" /> : <ChevronDown size={18} color="#555" />}
//         </div>
//       </button>
//       {open && <div style={shell.body}>{children}</div>}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ADD SECTION MODAL
// // ═══════════════════════════════════════════════════════════════════════════════
// function AddSectionModal({ onClose, onAdd }) {
//   const [step, setStep] = useState("pick");
//   const [selectedType, setSelectedType] = useState(null);
//   const [query, setQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [searching, setSearching] = useState(false);
//   const [picked, setPicked] = useState([]);

//   const handleTypeSelect = (type) => {
//     setSelectedType(type);
//     setStep("form");
//     setPicked([]);
//     setQuery("");
//     setSearchResults([]);
//   };

//   const handleSearch = async () => {
//     if (!query.trim()) return;
//     setSearching(true);
//     setSearchResults([]);

//     try {
//       let endpoint = "";
//       if (selectedType === "games")  endpoint = `/search/games?q=${encodeURIComponent(query)}`;
//       if (selectedType === "anime")  endpoint = `/search/anime?q=${encodeURIComponent(query)}`;
//       if (selectedType === "music")  endpoint = `/search/music?q=${encodeURIComponent(query)}`;
//       if (selectedType === "books")  endpoint = `/search/books?q=${encodeURIComponent(query)}`;
//       if (selectedType === "movies") endpoint = `/search/movies?q=${encodeURIComponent(query)}`;

//       // const json = await apiCall(endpoint);
//       // setSearchResults(json.results);

//       // ── MOCK while backend isn't fully wired ──────────────────────
//       await new Promise(r => setTimeout(r, 400));
//       setSearchResults([
//         { id: "r1", title: query + " — Result 1", subtitle: "Genre · 2022", image: `https://placehold.co/64x64/222/888?text=1` },
//         { id: "r2", title: query + " — Result 2", subtitle: "Genre · 2021", image: `https://placehold.co/64x64/222/888?text=2` },
//         { id: "r3", title: query + " — Result 3", subtitle: "Genre · 2020", image: `https://placehold.co/64x64/222/888?text=3` },
//       ]);
//       // ──────────────────────────────���────────────────────────────────
//     } finally {
//       setSearching(false);
//     }
//   };

//   const togglePick = (item) => {
//     setPicked(prev =>
//       prev.find(p => p.id === item.id)
//         ? prev.filter(p => p.id !== item.id)
//         : [...prev, item]
//     );
//   };

//   const handleSave = async () => {
//     if (!selectedType || picked.length === 0) return;
//     try {
//       // TODO: POST /api/hobbies with type and items
//       onAdd({ id: `hobby-${Date.now()}`, type: selectedType, data: { items: picked } });
//       onClose();
//     } catch (error) {
//       console.error("Failed to add section:", error);
//     }
//   };

//   return (
//     <div style={modal.overlay} onClick={onClose}>
//       <div style={modal.box} onClick={e => e.stopPropagation()}>
//         {step === "pick" ? (
//           <>
//             <p style={modal.title}>Add a section</p>
//             <p style={modal.sub}>What do you want to showcase?</p>
//             <div style={modal.typeGrid}>
//               {SECTION_TYPES.map(({ id, label, icon: Icon }) => (
//                 <button key={id} style={modal.typeCard} onClick={() => handleTypeSelect(id)}>
//                   <Icon size={28} color={COLORS.accent.violet} />
//                   <span style={modal.typeLabel}>{label}</span>
//                 </button>
//               ))}
//             </div>
//           </>
//         ) : (
//           <>
//             <button style={modal.back} onClick={() => setStep("pick")}>← Back</button>
//             <p style={modal.title}>Add {selectedType}</p>

//             <div style={modal.searchRow}>
//               <input
//                 style={modal.searchInput}
//                 placeholder={`Search ${selectedType}…`}
//                 value={query}
//                 onChange={e => setQuery(e.target.value)}
//                 onKeyDown={e => e.key === "Enter" && handleSearch()}
//               />
//               <button style={modal.searchBtn} onClick={handleSearch}>
//                 {searching ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Search size={18} />}
//               </button>
//             </div>

//             {searchResults.length > 0 && (
//               <div style={modal.results}>
//                 {searchResults.map(item => {
//                   const isSelected = picked.find(p => p.id === item.id);
//                   return (
//                     <button key={item.id} style={{ ...modal.resultRow, background: isSelected ? "#1e2a1e" : "#1a1a1a" }} onClick={() => togglePick(item)}>
//                       <img src={item.image} alt="" style={modal.resultImg} />
//                       <div style={modal.resultText}>
//                         <span style={modal.resultTitle}>{item.title}</span>
//                         <span style={modal.resultSub}>{item.subtitle}</span>
//                       </div>
//                       {isSelected && <Check size={18} color="#7ec87e" />}
//                     </button>
//                   );
//                 })}
//               </div>
//             )}

//             {picked.length > 0 && (
//               <div style={modal.pickedBar}>
//                 <span style={modal.pickedCount}>{picked.length} selected</span>
//                 <button style={modal.saveBtn} onClick={handleSave}>Save section</button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ADD POST TAB MODAL
// // ═══════════════════════════════════════════════════════════════════════════════
// function AddPostTabModal({ onClose, onAdd }) {
//   const [tabName, setTabName] = useState("");

//   const handleSave = () => {
//     if (!tabName.trim()) return;
//     const id = tabName.toLowerCase().replace(/\s+/g, "-");
//     onAdd({ id, label: tabName });
//     onClose();
//   };

//   return (
//     <div style={modal.overlay} onClick={onClose}>
//       <div style={modal.box} onClick={e => e.stopPropagation()}>
//         <p style={modal.title}>Add a new tab</p>
//         <input
//           style={modal.searchInput}
//           placeholder="Tab name (e.g., Photography)"
//           value={tabName}
//           onChange={e => setTabName(e.target.value)}
//           onKeyDown={e => e.key === "Enter" && handleSave()}
//         />
//         <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
//           <button style={{ ...modal.saveBtn, flex: 1 }} onClick={handleSave}>Create</button>
//           <button style={{ ...modal.saveBtn, background: COLORS.surface, color: COLORS.text, flex: 1 }} onClick={onClose}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // EDIT PROFILE MODAL
// // ═══════════════════════════════════════════════════════════════════════════════
// function EditProfileModal({ user, onClose, onSave }) {
//   const [displayName, setDisplayName] = useState(user.displayName || "");
//   const [bio, setBio] = useState(user.bio || "");
//   const [profileImage, setProfileImage] = useState(null);
//   const [bannerImage, setBannerImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       if (displayName !== user.displayName) formData.append("displayName", displayName);
//       if (bio !== user.bio) formData.append("bio", bio);
//       if (profileImage) formData.append("profileImage", profileImage);
//       if (bannerImage) formData.append("bannerImage", bannerImage);

//       // TODO: PUT /api/profile/me with form data
//       onSave({ displayName, bio });
//       onClose();
//     } catch (error) {
//       console.error("Failed to update profile:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={modal.overlay} onClick={onClose}>
//       <div style={modal.box} onClick={e => e.stopPropagation()}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
//           <p style={modal.title}>Edit Profile</p>
//           <button style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted }} onClick={onClose}>
//             <X size={20} />
//           </button>
//         </div>

//         <div style={{ marginBottom: 16 }}>
//           <label style={styles.label}>Display Name</label>
//           <input
//             style={modal.searchInput}
//             value={displayName}
//             onChange={e => setDisplayName(e.target.value)}
//             placeholder="Your display name"
//           />
//         </div>

//         <div style={{ marginBottom: 16 }}>
//           <label style={styles.label}>Bio</label>
//           <textarea
//             style={{ ...modal.searchInput, minHeight: 80, fontFamily: FONT_BODY, resize: "none" }}
//             value={bio}
//             onChange={e => setBio(e.target.value)}
//             placeholder="Tell us about yourself"
//           />
//         </div>

//         <div style={{ marginBottom: 16 }}>
//           <label style={styles.label}>Profile Picture</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={e => setProfileImage(e.target.files?.[0])}
//             style={styles.fileInput}
//           />
//         </div>

//         <div style={{ marginBottom: 16 }}>
//           <label style={styles.label}>Banner/Thumbnail</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={e => setBannerImage(e.target.files?.[0])}
//             style={styles.fileInput}
//           />
//         </div>

//         <div style={{ display: "flex", gap: 12 }}>
//           <button style={{ ...modal.saveBtn, flex: 1 }} onClick={handleSave} disabled={loading}>
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//           <button style={{ ...modal.saveBtn, background: COLORS.surface, color: COLORS.text, flex: 1 }} onClick={onClose}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // SETTINGS MODAL
// // ═══════════════════════════════════════════════════════════════════════════════
// function SettingsModal({ user, onClose, onLogout }) {
//   const [settings, setSettings] = useState({
//     theme: "dark",
//     notifications: true,
//     privateProfile: false,
//     language: "english",
//   });

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     onLogout();
//   };

//   return (
//     <div style={modal.overlay} onClick={onClose}>
//       <div style={modal.box} onClick={e => e.stopPropagation()}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
//           <p style={modal.title}>Settings</p>
//           <button style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted }} onClick={onClose}>
//             <X size={20} />
//           </button>
//         </div>

//         <div style={styles.settingRow}>
//           <span style={styles.settingLabel}>Theme</span>
//           <select style={styles.settingSelect} value={settings.theme} onChange={e => setSettings({...settings, theme: e.target.value})}>
//             <option value="dark">Dark</option>
//             <option value="light">Light</option>
//             <option value="auto">Auto</option>
//           </select>
//         </div>

//         <div style={styles.settingRow}>
//           <span style={styles.settingLabel}>Notifications</span>
//           <input type="checkbox" checked={settings.notifications} onChange={e => setSettings({...settings, notifications: e.target.checked})} />
//         </div>

//         <div style={styles.settingRow}>
//           <span style={styles.settingLabel}>Private Profile</span>
//           <input type="checkbox" checked={settings.privateProfile} onChange={e => setSettings({...settings, privateProfile: e.target.checked})} />
//         </div>

//         <div style={styles.settingRow}>
//           <span style={styles.settingLabel}>Language</span>
//           <select style={styles.settingSelect} value={settings.language} onChange={e => setSettings({...settings, language: e.target.value})}>
//             <option value="english">English</option>
//             <option value="spanish">Español</option>
//             <option value="french">Français</option>
//             <option value="german">Deutsch</option>
//           </select>
//         </div>

//         <hr style={{ borderColor: COLORS.border, margin: "20px 0" }} />

//         <button style={styles.logoutBtn} onClick={handleLogout}>
//           <LogOut size={16} /> Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // POST CARD
// // ═══════════════════════════════════════════════════════════════════════════════
// function PostCard({ post }) {
//   const [liked, setLiked] = useState(post.liked);
//   const [likes, setLikes] = useState(post.likes);

//   return (
//     <div style={card.wrap}>
//       <div style={card.meta}>
//         <img src={post.author.avatarUrl} alt="" style={card.avatar} />
//         <span style={card.author}>{post.author.displayName}</span>
//         <span style={card.time}>{post.createdAt}</span>
//       </div>
//       {post.text && <p style={card.text}>{post.text}</p>}
//       {post.images && post.images.length > 0 && <img src={post.images[0]} alt="" style={card.img} />}
//       <div style={card.actions}>
//         <button style={{ ...card.btn, color: liked ? COLORS.accent.maroon : "#777" }} onClick={() => { setLiked(l => !l); setLikes(n => liked ? n-1 : n+1); }}>
//           {liked ? "♥" : "♡"} {likes}
//         </button>
//         <button style={card.btn}>💬 {post.comments}</button>
//         <button style={card.btn}>🔗 Share</button>
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // POST FEED (infinite scroll)
// // ══════════════════════════════════════════════════════════════════════════��════
// function PostFeed({ activeTab, username }) {
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const observer = useRef(null);

//   useEffect(() => { setPosts([]); setPage(1); setHasMore(true); }, [activeTab]);

//   const loadMore = useCallback(async () => {
//     if (loading || !hasMore) return;
//     setLoading(true);
//     try {
//       // TODO: GET /api/posts/user/{username} with tab filter
//       // Mock data for now
//       await new Promise(r => setTimeout(r, 400));
//       const mockPosts = Array.from({ length: 6 }, (_, i) => ({
//         id: `post-${page}-${i}`,
//         author: { displayName: "User", avatarUrl: "https://placehold.co/48x48" },
//         text: `Post #${(page - 1) * 6 + i + 1}`,
//         images: [],
//         likes: Math.floor(Math.random() * 300),
//         comments: Math.floor(Math.random() * 40),
//         liked: false,
//         createdAt: `${Math.floor(Math.random() * 24)}h ago`,
//       }));
//       setPosts(prev => [...prev, ...mockPosts]);
//       setHasMore(page < 3);
//       setPage(n => n + 1);
//     } finally {
//       setLoading(false);
//     }
//   }, [activeTab, page, loading, hasMore]);

//   useEffect(() => { loadMore(); }, [activeTab]); // eslint-disable-line

//   const sentinelRef = useCallback(node => {
//     if (observer.current) observer.current.disconnect();
//     observer.current = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && hasMore) loadMore();
//     });
//     if (node) observer.current.observe(node);
//   }, [loading, hasMore, loadMore]);

//   return (
//     <div style={{ padding: "12px 16px" }}>
//       {posts.map(p => <PostCard key={p.id} post={p} />)}
//       <div ref={sentinelRef} style={{ height: 1 }} />
//       {loading && <p style={{ textAlign: "center", color: "#555", fontSize: 14 }}>Loading…</p>}
//       {!hasMore && posts.length > 0 && <p style={{ textAlign: "center", color: "#444", fontSize: 13, padding: "16px 0" }}>You've seen it all.</p>}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // BOTTOM NAV
// // ═════════��═════════════════════════════════════════════════════════════════════
// function BottomNav({ active }) {
//   const items = [
//     { id: "feed",          label: "Feed",    icon: Home },
//     { id: "explore",       label: "Explore", icon: Compass },
//     { id: "post",          label: "Post",    icon: Plus },
//     { id: "notifications", label: "Alerts",  icon: Bell },
//     { id: "profile",       label: "Profile", icon: User },
//   ];
//   return (
//     <nav style={nav.bar}>
//       {items.map(item => {
//         const Icon = item.icon;
//         return (
//           <button key={item.id} style={{ ...nav.item, ...(active === item.id ? nav.active : {}) }}
//             onClick={() => { /* TODO: React Router navigate */ }}>
//             <Icon size={20} />
//             <span style={nav.label}>{item.label}</span>
//           </button>
//         );
//       })}
//     </nav>
//   );
// }

// // ══════════════════════════════════════════════════════════════��════════════════
// // PROFILE PAGE
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function ProfilePage() {
//   const [user, setUser] = useState({
//     username: "username",
//     displayName: null,
//     bio: "Loading...",
//     avatarUrl: "https://placehold.co/180x180",
//     bannerUrl: "https://placehold.co/1200x340",
//   });
//   const [sections, setSections] = useState([]);
//   const [postTabs, setPostTabs] = useState([
//     { id: "all", label: "All" },
//   ]);
//   const [activeTab, setActiveTab] = useState("all");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showAddTabModal, setShowAddTabModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showSettingsModal, setShowSettingsModal] = useState(false);
//   const [isOwnProfile, setIsOwnProfile] = useState(true);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         // TODO: Get username from route params or auth context
//         const username = "prefetch"; // placeholder
//         // const profileData = await apiCall(`/profile/${username}`);
//         // const hobbies = await apiCall(`/hobbies/user/${username}`);
        
//         setUser({
//           username,
//           displayName: null,
//           bio: "I build things, make music, and fold paper.",
//           avatarUrl: "https://placehold.co/180x180",
//           bannerUrl: "https://placehold.co/1200x340",
//         });
//         setSections([]);
//       } catch (error) {
//         console.error("Failed to fetch profile:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleAddSection = (newSection) => {
//     setSections(prev => [...prev, newSection]);
//   };

//   const handleAddPostTab = (newTab) => {
//     setPostTabs(prev => [...prev, newTab]);
//   };

//   const handleEditProfile = (updates) => {
//     setUser(prev => ({ ...prev, ...updates }));
//   };

//   const renderSection = (sec) => {
//     switch (sec.type) {
//       case "music":  return <MusicSection  data={sec.data || {}} />;
//       case "games":  return <GamesSection  data={sec.data || {}} />;
//       case "anime":  return <AnimeSection  data={sec.data || {}} />;
//       case "books":  return <div style={sec.wrap}><p style={sec.blockLabel}>Books section content</p></div>;
//       case "movies": return <div style={sec.wrap}><p style={sec.blockLabel}>Movies section content</p></div>;
//       default:       return <p style={{ color: "#555", fontSize: 14, padding: "8px 0" }}>No content yet.</p>;
//     }
//   };

//   if (loading) {
//     return <div style={{ ...pg.page, display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 size={32} /></div>;
//   }

//   return (
//     <div style={pg.page}>
//       {/* Banner */}
//       <div style={pg.banner}>
//         <img src={user.bannerUrl} alt="" style={pg.bannerImg} />
//       </div>

//       {/* Avatar + Settings */}
//       <div style={pg.avatarWrap}>
//         <img src={user.avatarUrl} alt="avatar" style={pg.avatar} />
//         {isOwnProfile && (
//           <button style={pg.settingsBtn} onClick={() => setShowSettingsModal(true)}>
//             <Settings size={18} />
//           </button>
//         )}
//       </div>

//       {/* User info */}
//       <div style={pg.userInfo}>
//         <h2 style={pg.displayName}>{user.displayName || user.username}</h2>
//         <p style={pg.handle}>@{user.username}</p>
//         <p style={pg.bio}>{user.bio}</p>
//         {isOwnProfile && <button style={pg.editBtn} onClick={() => setShowEditModal(true)}>Edit profile</button>}
//       </div>

//       {/* Special sections */}
//       <div style={pg.sectionsWrap}>
//         {sections.map(sec => (
//           <SpecialSectionShell key={sec.id} section={sec}>
//             {renderSection(sec)}
//           </SpecialSectionShell>
//         ))}
//         {isOwnProfile && (
//           <button style={pg.addSectionBtn} onClick={() => setShowAddModal(true)}>
//             <Plus size={16} /> Add section
//           </button>
//         )}
//       </div>

//       {/* Post tabs */}
//       <div style={pg.tabBarWrap}>
//         <div style={pg.tabBar}>
//           {postTabs.map(tab => (
//             <button key={tab.id}
//               style={{ ...pg.tab, ...(activeTab === tab.id ? pg.tabActive : {}) }}
//               onClick={() => setActiveTab(tab.id)}>
//               {tab.label}
//             </button>
//           ))}
//           {isOwnProfile && (
//             <button style={pg.addTabBtn} onClick={() => setShowAddTabModal(true)}><Plus size={16} /></button>
//           )}
//         </div>
//       </div>

//       {/* Posts */}
//       <PostFeed activeTab={activeTab} username={user.username} />

//       {/* Bottom nav */}
//       <BottomNav active="profile" />

//       {/* Modals */}
//       {showAddModal && <AddSectionModal onClose={() => setShowAddModal(false)} onAdd={handleAddSection} />}
//       {showAddTabModal && <AddPostTabModal onClose={() => setShowAddTabModal(false)} onAdd={handleAddPostTab} />}
//       {showEditModal && <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onSave={handleEditProfile} />}
//       {showSettingsModal && <SettingsModal user={user} onClose={() => setShowSettingsModal(false)} onLogout={() => {}} />}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════��═══
// // STYLE OBJECTS
// // ═══════════════════════════════════════════════════════════════════════════════

// // Page
// const pg = {
//   page:        { maxWidth: 680, margin: "0 auto", paddingBottom: 90, fontFamily: FONT_BODY, background: COLORS.bg, color: COLORS.text, minHeight: "100vh" },
//   banner:      { width: "100%", height: 240, overflow: "hidden", background: "#1a1a1a" },
//   bannerImg:   { width: "100%", height: "100%", objectFit: "cover" },
//   avatarWrap:  { display: "flex", justifyContent: "center", position: "relative", marginTop: -90 },
//   avatar:      { width: 180, height: 180, borderRadius: "50%", border: `6px solid ${COLORS.bg}`, objectFit: "cover", background: "#222" },
//   settingsBtn: { position: "absolute", right: -12, bottom: 12, width: 44, height: 44, borderRadius: "50%", background: COLORS.accent.violet, border: "none", color: COLORS.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" },
//   userInfo:    { textAlign: "center", padding: "16px 24px 24px" },
//   displayName: { margin: "0 0 6px", fontSize: 32, fontWeight: 700, fontFamily: FONT_DISPLAY },
//   handle:      { margin: "0 0 10px", color: COLORS.muted, fontSize: 15 },
//   bio:         { margin: "0 0 16px", fontSize: 15, lineHeight: 1.6, color: "#bbb", maxWidth: 450, marginLeft: "auto", marginRight: "auto" },
//   editBtn:     { padding: "8px 24px", borderRadius: 24, border: `1px solid ${COLORS.accent.violet}`, background: "transparent", color: COLORS.accent.violet, cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s" },
//   sectionsWrap:{ padding: "0 16px 12px" },
//   addSectionBtn:{ display: "flex", alignItems: "center", gap: 8, width: "100%", justifyContent: "center", padding: "12px 0", background: "none", border: `2px dashed ${COLORS.accent.violet}`, borderRadius: 10, color: COLORS.accent.violet, cursor: "pointer", fontSize: 14, fontWeight: 600, marginTop: 12, transition: "all 0.2s" },
//   tabBarWrap:  { position: "sticky", top: 0, zIndex: 10, background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` },
//   tabBar:      { display: "flex", overflowX: "auto", padding: "0 16px", scrollbarWidth: "none", gap: 2 },
//   tab:         { flexShrink: 0, padding: "14px 18px", background: "none", border: "none", borderBottom: "3px solid transparent", color: COLORS.muted, cursor: "pointer", fontSize: 15, fontWeight: 600, whiteSpace: "nowrap", fontFamily: FONT_BODY },
//   tabActive:   { color: COLORS.text, borderBottomColor: COLORS.accent.violet },
//   addTabBtn:   { flexShrink: 0, padding: "14px 12px", background: "none", border: "none", color: COLORS.muted, cursor: "pointer", display: "flex", alignItems: "center" },
// };

// // Section shell
// const shell = {
//   wrap:       { borderBottom: `1px solid ${COLORS.border}` },
//   header:     { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", color: COLORS.text, padding: "18px 0", cursor: "pointer" },
//   headerLeft: { display: "flex", alignItems: "center", gap: 10 },
//   label:      { fontSize: 17, fontWeight: 700, fontFamily: FONT_DISPLAY, letterSpacing: 0.5 },
//   body:       { paddingBottom: 24 },
// };

// // Section content
// const sec = {
//   wrap:           { display: "flex", flexDirection: "column", gap: 24 },
//   blockLabel:     { margin: "0 0 12px", fontSize: 12, letterSpacing: 2.5, color: COLORS.muted, fontFamily: FONT_BODY, fontWeight: 700, textTransform: "uppercase" },

//   // Spotify
//   spotifyConnected:{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 10, border: "1px solid #1db954", background: "#0d1f0d", color: "#7ec87e", cursor: "pointer", fontSize: 14, fontWeight: 600 },
//   spotifyIcon:    { fontSize: 18 },

//   // Tracks
//   trackList:      { display: "flex", flexDirection: "column", gap: 10 },
//   trackCard:      { display: "flex", alignItems: "center", gap: 14, background: COLORS.surface, borderRadius: 10, padding: "12px 16px", border: `1px solid ${COLORS.border}` },
//   trackNum:       { width: 20, textAlign: "center", color: COLORS.muted, fontSize: 14, fontFamily: FONT_DISPLAY, fontStyle: "italic" },
//   trackArt:       { width: 64, height: 64, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
//   trackInfo:      { display: "flex", flexDirection: "column", gap: 3 },
//   trackTitle:     { fontSize: 16, fontWeight: 700, fontFamily: FONT_DISPLAY, color: COLORS.text },
//   trackArtist:    { fontSize: 13, color: COLORS.muted },

//   // Artists
//   artistGrid:     { display: "flex", gap: 16, flexWrap: "wrap" },
//   artistCard:     { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 96 },
//   artistImg:      { width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: `3px solid ${COLORS.accent.violet}` },
//   artistName:     { fontSize: 13, color: "#bbb", textAlign: "center", lineHeight: 1.4, fontWeight: 600 },

//   // Genres/chips
//   chipRow:        { display: "flex", flexWrap: "wrap", gap: 10 },
//   chip:           { padding: "6px 16px", borderRadius: 24, border: `1px solid ${COLORS.border}`, background: COLORS.surface, fontSize: 14, color: "#bbb", fontFamily: FONT_BODY, fontWeight: 500 },

//   // Stats row
//   statsRow:       { display: "flex", gap: 12, flexWrap: "wrap" },
//   statPill:       { display: "flex", flexDirection: "column", padding: "10px 18px", borderRadius: 10, background: COLORS.surface, border: `1px solid ${COLORS.border}`, minWidth: 90 },
//   statVal:        { fontSize: 18, fontWeight: 700, fontFamily: FONT_DISPLAY, color: COLORS.accent.violet },
//   statKey:        { fontSize: 12, color: COLORS.muted, marginTop: 4, fontWeight: 600 },

//   // Media cards (games / anime)
//   cardList:       { display: "flex", flexDirection: "column", gap: 12 },
//   mediaCard:      { display: "flex", alignItems: "flex-start", gap: 14, background: COLORS.surface, borderRadius: 12, padding: "14px 16px", border: `1px solid ${COLORS.border}` },
//   mediaRank:      { width: 24, paddingTop: 4, color: COLORS.muted, fontSize: 14, fontFamily: FONT_DISPLAY, fontStyle: "italic", fontWeight: 700, flexShrink: 0 },
//   mediaIcon:      { width: 96, height: 96, borderRadius: 12, objectFit: "cover", flexShrink: 0, border: `1px solid ${COLORS.border}` },
//   mediaInfo:      { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
//   mediaTitle:     { fontSize: 17, fontWeight: 700, fontFamily: FONT_DISPLAY, color: COLORS.text },
//   mediaSub:       { fontSize: 13, color: COLORS.muted, fontWeight: 500 },
//   mediaThoughts:  { fontSize: 14, color: "#aaa", fontStyle: "italic", marginTop: 3 },
// };

// // Post card
// const card = {
//   wrap:    { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 14, overflow: "hidden" },
//   meta:    { display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 10px" },
//   avatar:  { width: 36, height: 36, borderRadius: "50%", objectFit: "cover" },
//   author:  { fontWeight: 700, fontSize: 14 },
//   time:    { fontSize: 13, color: COLORS.muted, marginLeft: "auto" },
//   text:    { margin: "0 0 12px", padding: "0 16px", fontSize: 15, lineHeight: 1.6, color: "#ccc" },
//   img:     { width: "100%", display: "block", maxHeight: 420, objectFit: "cover" },
//   actions: { display: "flex", justifyContent: "space-around", padding: "12px 16px", borderTop: `1px solid ${COLORS.border}` },
//   btn:     { background: "none", border: "none", color: "#777", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 },
// };

// // Modal
// const modal = {
//   overlay:    { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" },
//   box:        { background: COLORS.surface, borderRadius: "20px 20px 0 0", padding: "28px 24px 48px", width: "100%", maxWidth: 680, maxHeight: "85vh", overflowY: "auto", border: `1px solid ${COLORS.border}` },
//   title:      { margin: "0 0 6px", fontSize: 24, fontWeight: 700, fontFamily: FONT_DISPLAY, color: COLORS.text },
//   sub:        { margin: "0 0 24px", fontSize: 15, color: COLORS.muted },
//   typeGrid:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
//   typeCard:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 12px", background: "#1a1a1a", border: `2px solid ${COLORS.border}`, borderRadius: 12, cursor: "pointer", color: COLORS.text, transition: "all 0.2s" },
//   typeLabel:  { fontSize: 14, color: "#bbb", fontWeight: 600 },
//   back:       { background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 16, padding: 0, fontWeight: 600 },
//   searchRow:  { display: "flex", gap: 10, marginBottom: 14 },
//   searchInput:{ flex: 1, padding: "12px 16px", background: "#1a1a1a", border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text, fontSize: 15, fontFamily: FONT_BODY, outline: "none" },
//   searchBtn:  { padding: "0 18px", background: COLORS.accent.violet, border: "none", borderRadius: 10, color: COLORS.bg, cursor: "pointer", display: "flex", alignItems: "center", fontWeight: 600 },
//   results:    { display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 },
//   resultRow:  { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1px solid ${COLORS.border}`, cursor: "pointer", textAlign: "left", transition: "all 0.2s" },
//   resultImg:  { width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
//   resultText: { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
//   resultTitle:{ fontSize: 15, color: COLORS.text, fontWeight: 600 },
//   resultSub:  { fontSize: 13, color: COLORS.muted },
//   pickedBar:  { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 0", borderTop: `1px solid ${COLORS.border}` },
//   pickedCount:{ fontSize: 14, color: COLORS.muted, fontWeight: 600 },
//   saveBtn:    { padding: "10px 24px", borderRadius: 24, background: COLORS.accent.violet, color: COLORS.bg, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700 },
// };

// // Nav
// const nav = {
//   bar:   { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 680, display: "flex", justifyContent: "space-around", background: COLORS.bg, borderTop: `1px solid ${COLORS.border}`, padding: "10px 0 16px", zIndex: 100 },
//   item:  { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", color: COLORS.muted, cursor: "pointer", padding: "6px 12px", borderRadius: 10, transition: "all 0.2s" },
//   active:{ color: COLORS.text },
//   label: { fontSize: 11, fontWeight: 600 },
// };

// // Additional styles
// const styles = {
//   label:       { display: "block", fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 8 },
//   fileInput:   { display: "block", width: "100%", padding: "8px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: "#1a1a1a", color: COLORS.text, fontSize: 13, cursor: "pointer" },
//   settingRow:  { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${COLORS.border}` },
//   settingLabel:{ fontSize: 15, fontWeight: 600, color: COLORS.text },
//   settingSelect:{ padding: "8px 12px", background: "#1a1a1a", border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 14, cursor: "pointer" },
//   logoutBtn:   { width: "100%", padding: "12px", borderRadius: 10, background: COLORS.accent.maroon, color: COLORS.text, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
// };


import { useState, useEffect, useRef, useCallback } from "react";
import { 
  ChevronDown, ChevronUp, Plus, Music2, Gamepad2, Tv2, BookOpen, Film, 
  Search, Loader2, Check, Home, Compass, PlusSquare, Bell, User, 
  Settings, Heart, MessageCircle, Share2, Edit3, X, Camera
} from "lucide-react";

// ── Google Fonts ────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:wght@300;400;500;700&display=swap";
document.head.appendChild(fontLink);

// ── Constants & Theme ───────────────────────────────────────────────────────
const SECTION_TYPES = [
  { id: "music",  label: "Music",  icon: Music2  },
  { id: "games",  label: "Games",  icon: Gamepad2 },
  { id: "anime",  label: "Anime",  icon: Tv2      },
  { id: "books",  label: "Books",  icon: BookOpen },
  { id: "movies", label: "Movies", icon: Film     },
];

// ── Mock user ────────────────────────────────────────────────────────────────
// API: GET /api/profile/{username}
const MOCK_USER = {
  id: "u_456",
  username: "alex_dev",
  displayName: "Alex",
  bio: "Exploring worlds through code, soundscapes, and storytelling.",
  avatarUrl: "https://placehold.co/240x240/2d1b4e/ffffff?text=A",
  bannerUrl: "https://placehold.co/1200x400/0a0a0a/4c1d95?text=+", 
};

// ── Mock section data ────────────────────────────────────────────────────────
// API: GET /api/hobbies/user/{username}
const INITIAL_SECTIONS = [
  {
    id: "sec-music", type: "music",
    data: {
      spotifyConnected: false,
      items: [
        { id: "m1", title: "Midnight City", artist: "M83", albumArt: "https://placehold.co/80x80/222/9f1239?text=♪" },
        { id: "m2", title: "Starboy", artist: "The Weeknd", albumArt: "https://placehold.co/80x80/222/6d28d9?text=♪" },
        { id: "m3", title: "G.O.A.T.", artist: "Polyphia", albumArt: "https://placehold.co/80x80/222/4c1d95?text=♪" },
      ],
      topArtists: [
        { name: "The Weeknd", image: "https://placehold.co/100x100/1a1a2e/aaa?text=TW" },
        { name: "Daft Punk", image: "https://placehold.co/100x100/1a1a2e/aaa?text=DP" },
      ],
      favGenres: ["Synthwave", "R&B", "Math Rock"],
    },
  },
  {
    id: "sec-games", type: "games",
    data: {
      items: [
        { id: "g1", title: "Elden Ring", subtitle: "RPG · 150h · 10/10", thoughts: "A majestic, punishing journey.", image: "https://placehold.co/96x96/1a1a1a/6d28d9?text=ER" },
        { id: "g2", title: "Cyberpunk 2077", subtitle: "RPG · 90h · 8/10", thoughts: "Night City is mesmerizing.", image: "https://placehold.co/96x96/1a1a1a/9f1239?text=CP" },
        { id: "g3", title: "Hades", subtitle: "Roguelite · 120h · 9/10", thoughts: "Flawless gameplay loop.", image: "https://placehold.co/96x96/1a1a1a/e11d48?text=H"  },
      ],
      totalHours: 850,
      favGenre: "RPG",
    },
  },
  {
    id: "sec-anime", type: "anime",
    data: {
      items: [
        { id: "a1", title: "Jujutsu Kaisen", subtitle: "Action · 47 ep · Completed", thoughts: "Incredible animation.", image: "https://placehold.co/96x96/1a1a1a/6d28d9?text=JJK" },
        { id: "a2", title: "Frieren", subtitle: "Fantasy · 28 ep · Completed", thoughts: "A beautiful reflection on time.", image: "https://placehold.co/96x96/1a1a1a/8b5cf6?text=F" },
      ],
      favGenre: "Fantasy",
    },
  },
];

// ── Mock post tabs ────────────────────────────────────────────────────────────
const INITIAL_POST_TABS = [
  { id: "all",      label: "All"      },
  { id: "music",    label: "Music"    },
  { id: "coding",   label: "Coding"   },
  { id: "thoughts", label: "Thoughts" },
];

// ── Mock post fetch (infinite scroll) ────────────────────────────────────────
// API: GET /api/posts/user/{username} OR GET /api/posts/user/{username}/hobby/{hobbyId}
function fetchMockPosts(tabId, page) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = Array.from({ length: 5 }, (_, i) => ({
        id: `${tabId}-p${page}-${i}`,
        author: MOCK_USER,
        text: `Sharing some updates in the ${tabId} space. This is post #${(page - 1) * 5 + i + 1}.`,
        images: i % 2 === 0 ? [`https://placehold.co/800x500/121214/6d28d9?text=Post+Image`] : [],
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 80),
        liked: false,
        createdAt: `${i + 2}h ago`,
      }));
      resolve({ posts, hasMore: page < 3 });
    }, 600);
  });
}

const isOwnProfile = true;

// ═══════════════════════════════════════════════════════════════════════════════
// MUSIC SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function MusicSection({ data }) {
  const handleSpotifySync = () => alert("Redirect to Spotify OAuth flow");

  return (
    <div style={sec.wrap}>
      {isOwnProfile && (
        <button style={data.spotifyConnected ? sec.spotifyConnected : sec.spotifyBtn} onClick={handleSpotifySync}>
          <Music2 size={18} />
          {data.spotifyConnected ? "Synced with Spotify" : "Connect Spotify to auto-sync"}
        </button>
      )}

      <p style={sec.blockLabel}>TOP TRACKS</p>
      <div style={sec.trackList}>
        {data.items?.map((track, i) => (
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

      {data.favGenres && (
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
// GENERIC MEDIA SECTION (Games, Anime, Books, Movies)
// ═══════════════════════════════════════════════════════════════════════════════
function MediaSection({ data }) {
  return (
    <div style={sec.wrap}>
      {(data.totalHours || data.favGenre) && (
        <div style={sec.statsRow}>
          {data.totalHours && <div style={sec.statPill}><span style={sec.statVal}>{data.totalHours}h</span><span style={sec.statKey}>played</span></div>}
          {data.favGenre && <div style={sec.statPill}><span style={sec.statVal}>{data.favGenre}</span><span style={sec.statKey}>fav genre</span></div>}
        </div>
      )}

      <div style={sec.cardList}>
        {data.items?.map((item, i) => (
          <div key={item.id || i} style={sec.mediaCard}>
            <div style={sec.mediaRank}>{i + 1}</div>
            <img src={item.image} alt={item.title} style={sec.mediaIcon} />
            <div style={sec.mediaInfo}>
              <span style={sec.mediaTitle}>{item.title}</span>
              <span style={sec.mediaSub}>{item.subtitle}</span>
              {item.thoughts && <span style={sec.mediaThoughts}>{item.thoughts}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION SHELL
// ═══════════════════════════════════════════════════════════════════════════════
function SpecialSectionShell({ section, children }) {
  const [open, setOpen] = useState(false);
  const TypeIcon = SECTION_TYPES.find(t => t.id === section.type)?.icon;

  return (
    <div style={shell.wrap}>
      <button style={shell.header} onClick={() => setOpen(o => !o)}>
        <div style={shell.headerLeft}>
          {TypeIcon && <TypeIcon size={20} color="#a1a1aa" />}
          <span style={shell.label}>{section.type.charAt(0).toUpperCase() + section.type.slice(1)}</span>
        </div>
        {open ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
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
      // API Endpoints integration based on provided list
      // GET /api/search/games?q=...
      // GET /api/search/anime?q=...
      // GET /api/search/music?q=...
      // GET /api/search/books?q=...
      // GET /api/search/movies?q=...
      
      await new Promise(r => setTimeout(r, 600));
      setSearchResults([
        { id: `r1-${Date.now()}`, title: query + " — 1", subtitle: "Action · 2024", image: `https://placehold.co/96x96/1a1a2e/6d28d9?text=1` },
        { id: `r2-${Date.now()}`, title: query + " — 2", subtitle: "RPG · 2023", image: `https://placehold.co/96x96/1a1a2e/6d28d9?text=2` },
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
    // API: POST /api/hobbies/{hobbyId}/entries
    onAdd({ id: `sec-${Date.now()}`, type: selectedType, data: { items: picked } });
    onClose();
  };

  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        {step === "pick" ? (
          <>
            <p style={modal.title}>Add to your showcase</p>
            <p style={modal.sub}>What do you want to feature?</p>
            <div style={modal.typeGrid}>
              {SECTION_TYPES.map(({ id, label, icon: Icon }) => (
                <button key={id} style={modal.typeCard} onClick={() => handleTypeSelect(id)}>
                  <Icon size={28} color="#a1a1aa" />
                  <span style={modal.typeLabel}>{label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button style={modal.back} onClick={() => setStep("pick")}>← Back</button>
            <p style={modal.title}>Search {selectedType}</p>

            <div style={modal.searchRow}>
              <input
                style={modal.searchInput}
                placeholder={`Search ${selectedType}…`}
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
                <button style={modal.saveBtn} onClick={handleSave}>Add to Profile</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// OTHER MODALS (Add Tab, Edit Profile, Settings)
// ═══════════════════════════════════════════════════════════════════════════════
function AddTabModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={modal.title}>Create New Tab</p>
          <button style={modal.iconBtn} onClick={onClose}><X size={20}/></button>
        </div>
        <input 
          style={{ ...modal.searchInput, width: "100%", marginBottom: 16 }} 
          placeholder="e.g., Photography, Devlogs..." 
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
        <button 
          style={{ ...modal.saveBtn, width: "100%" }} 
          onClick={() => { if(name.trim()) { onSave(name); onClose(); } }}>
          Create Tab
        </button>
      </div>
    </div>
  );
}

function EditProfileModal({ onClose }) {
  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <p style={modal.title}>Edit Profile</p>
          <button style={modal.iconBtn} onClick={onClose}><X size={20}/></button>
        </div>
        
        {/* API: POST /api/upload/image (Banner & Avatar) & PUT /api/profile/me */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={modal.label}>Display Name</label>
            <input style={modal.searchInput} defaultValue={MOCK_USER.displayName} style={{width: "100%", ...modal.searchInput}} />
          </div>
          <div>
            <label style={modal.label}>Bio</label>
            <textarea style={{...modal.searchInput, width: "100%", height: 80, resize: "none"}} defaultValue={MOCK_USER.bio} />
          </div>
          <button style={{...modal.saveBtn, width: "100%", marginTop: 8}} onClick={onClose}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ onClose }) {
  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <p style={modal.title}>Settings</p>
          <button style={modal.iconBtn} onClick={onClose}><X size={20}/></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button style={modal.settingsRow}>Account Security</button>
          <button style={modal.settingsRow}>Notifications</button>
          <button style={modal.settingsRow}>Privacy & Visibility</button>
          <button style={{...modal.settingsRow, color: "#e11d48"}}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST CARD & FEED
// ═══════════════════════════════════════════════════════════════════════════════
function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    // API: POST /api/posts/{postId}/like
    setLiked(l => !l);
    setLikes(n => liked ? n - 1 : n + 1);
  };

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
        <button style={{ ...card.btn, color: liked ? "#e11d48" : "#a1a1aa" }} onClick={handleLike}>
          <Heart size={18} fill={liked ? "#e11d48" : "none"} /> {likes}
        </button>
        <button style={card.btn}><MessageCircle size={18} /> {post.comments}</button>
        <button style={card.btn}><Share2 size={18} /> Share</button>
      </div>
    </div>
  );
}

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
      {posts.map(p => <PostCard key={p.id} post={p} />)}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && <p style={{ textAlign: "center", color: "#666", fontSize: 14 }}>Loading…</p>}
      {!hasMore && posts.length > 0 && <p style={{ textAlign: "center", color: "#444", fontSize: 14, padding: "20px 0" }}>You've reached the end.</p>}
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
    { id: "post",          label: "Post",    icon: PlusSquare },
    { id: "notifications", label: "Alerts",  icon: Bell },
    { id: "profile",       label: "Profile", icon: User },
  ];
  return (
    <nav style={nav.bar}>
      {items.map(item => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button key={item.id} style={{ ...nav.item, ...(isActive ? nav.active : {}) }}>
            <Icon size={24} color={isActive ? "#f4f4f5" : "#666"} />
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
  const [sections, setSections]       = useState(INITIAL_SECTIONS);
  const [postTabs, setPostTabs]       = useState(INITIAL_POST_TABS);
  const [activeTab, setActiveTab]     = useState(INITIAL_POST_TABS[0].id);
  
  // Modals state
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddTab, setShowAddTab]         = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings]     = useState(false);

  const handleAddSection = (newSection) => {
    // Prevent duplicate section creation, merge items into existing section instead
    setSections(prev => {
      const existingIndex = prev.findIndex(s => s.type === newSection.type);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const mergedItems = [...(existing.data.items || []), ...(newSection.data.items || [])];
        updated[existingIndex] = { ...existing, data: { ...existing.data, items: mergedItems } };
        return updated;
      }
      return [...prev, newSection];
    });
  };

  const handleAddPostTab = (name) => {
    // API: POST /api/posts/tabs (or relevant endpoint)
    const id = name.toLowerCase().replace(/\s+/g, "-");
    setPostTabs(prev => [...prev, { id, label: name }]);
  };

  return (
    <div style={pg.page}>
      <div style={pg.banner}>
        <img src={MOCK_USER.bannerUrl} alt="" style={pg.bannerImg} />
        {isOwnProfile && (
          <button style={pg.bannerEditBtn}><Camera size={16}/></button>
        )}
      </div>

      <div style={pg.topControls}>
        <div style={pg.avatarWrap}>
          <img src={MOCK_USER.avatarUrl} alt="avatar" style={pg.avatar} />
          {isOwnProfile && <button style={pg.avatarEditBtn}><Camera size={16}/></button>}
        </div>
        {isOwnProfile && (
          <button style={pg.settingsBtn} onClick={() => setShowSettings(true)}>
            <Settings size={22} color="#a1a1aa" />
          </button>
        )}
      </div>

      <div style={pg.userInfo}>
        <h2 style={pg.displayName}>{MOCK_USER.displayName || MOCK_USER.username}</h2>
        <p style={pg.handle}>@{MOCK_USER.username}</p>
        <p style={pg.bio}>{MOCK_USER.bio}</p>
        {isOwnProfile && (
          <button style={pg.editProfileBtn} onClick={() => setShowEditProfile(true)}>
            <Edit3 size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div style={pg.sectionsWrap}>
        {sections.map(sec => (
          <SpecialSectionShell key={sec.id} section={sec}>
            {sec.type === "music" ? <MusicSection data={sec.data} /> : <MediaSection data={sec.data} />}
          </SpecialSectionShell>
        ))}
        {isOwnProfile && (
          <button style={pg.addSectionBtn} onClick={() => setShowAddSection(true)}>
            <Plus size={18} /> Add to Showcase
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
            <button style={pg.addTabBtn} onClick={() => setShowAddTab(true)}><Plus size={18} /></button>
          )}
        </div>
      </div>

      <PostFeed activeTab={activeTab} />
      <BottomNav active="profile" />

      {/* Modals */}
      {showAddSection && <AddSectionModal onClose={() => setShowAddSection(false)} onAdd={handleAddSection} />}
      {showAddTab && <AddTabModal onClose={() => setShowAddTab(false)} onSave={handleAddPostTab} />}
      {showEditProfile && <EditProfileModal onClose={() => setShowEditProfile(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE OBJECTS (Black, Violet, Maroon Palette)
// ═══════════════════════════════════════════════════════════════════════════════

const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
const FONT_BODY    = "'Roboto', 'Segoe UI', sans-serif";

const BG           = "#09090b"; 
const SURFACE      = "#121214"; 
const BORDER       = "#27272a";
const TEXT         = "#f4f4f5";
const MUTED        = "#a1a1aa";
const ACCENT_V     = "#6d28d9"; 
const ACCENT_M     = "#9f1239"; 

const pg = {
  page:          { maxWidth: 680, margin: "0 auto", paddingBottom: 100, fontFamily: FONT_BODY, background: BG, color: TEXT, minHeight: "100vh" },
  banner:        { width: "100%", height: 220, overflow: "hidden", background: "#1a1a2e", position: "relative" },
  bannerImg:     { width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 },
  bannerEditBtn: { position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", padding: 8, borderRadius: "50%", cursor: "pointer" },
  topControls:   { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0 24px", marginTop: -90, position: "relative", zIndex: 2 },
  avatarWrap:    { position: "relative" },
  avatar:        { width: 160, height: 160, borderRadius: "50%", border: `6px solid ${BG}`, objectFit: "cover", background: SURFACE },
  avatarEditBtn: { position: "absolute", bottom: 10, right: 10, background: SURFACE, border: `2px solid ${BORDER}`, color: TEXT, padding: 8, borderRadius: "50%", cursor: "pointer" },
  settingsBtn:   { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "50%", padding: 10, cursor: "pointer", marginTop: 100 },
  userInfo:      { textAlign: "center", padding: "16px 24px 28px" },
  displayName:   { margin: "0 0 6px", fontSize: 32, fontWeight: 700, fontFamily: FONT_DISPLAY, letterSpacing: 0.5 },
  handle:        { margin: "0 0 12px", color: MUTED, fontSize: 16 },
  bio:           { margin: "0 0 20px", fontSize: 16, lineHeight: 1.6, color: "#d4d4d8", maxWidth: 460, marginLeft: "auto", marginRight: "auto" },
  editProfileBtn:{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 24px", borderRadius: 30, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, cursor: "pointer", fontSize: 15, fontWeight: 500 },
  sectionsWrap:  { padding: "0 16px 16px" },
  addSectionBtn: { display: "flex", alignItems: "center", gap: 8, width: "100%", justifyContent: "center", padding: "14px 0", background: "none", border: `1px dashed ${BORDER}`, borderRadius: 12, color: MUTED, cursor: "pointer", fontSize: 15, fontWeight: 500, marginTop: 12, transition: "0.2s" },
  tabBarWrap:    { position: "sticky", top: 0, zIndex: 10, background: `rgba(9, 9, 11, 0.9)`, backdropFilter: "blur(8px)", borderBottom: `1px solid ${BORDER}` },
  tabBar:        { display: "flex", overflowX: "auto", padding: "0 16px", scrollbarWidth: "none", gap: 8 },
  tab:           { flexShrink: 0, padding: "16px 12px", background: "none", border: "none", borderBottom: "3px solid transparent", color: MUTED, cursor: "pointer", fontSize: 16, fontWeight: 500, whiteSpace: "nowrap", fontFamily: FONT_BODY },
  tabActive:     { color: TEXT, borderBottomColor: ACCENT_V },
  addTabBtn:     { flexShrink: 0, padding: "16px 10px", background: "none", border: "none", color: MUTED, cursor: "pointer", display: "flex", alignItems: "center" },
};

const shell = {
  wrap:       { borderBottom: `1px solid ${BORDER}` },
  header:     { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", color: TEXT, padding: "20px 0", cursor: "pointer" },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  label:      { fontSize: 18, fontWeight: 600, fontFamily: FONT_DISPLAY, letterSpacing: 0.5 },
  body:       { paddingBottom: 24 },
};

const sec = {
  wrap:            { display: "flex", flexDirection: "column", gap: 24 },
  blockLabel:      { margin: "0 0 12px", fontSize: 12, letterSpacing: 2, color: MUTED, fontFamily: FONT_BODY, fontWeight: 600, textTransform: "uppercase" },
  spotifyBtn:      { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "12px 16px", borderRadius: 12, border: "1px solid #1db954", background: "transparent", color: "#1db954", cursor: "pointer", fontSize: 15, fontWeight: 600 },
  trackList:       { display: "flex", flexDirection: "column", gap: 12 },
  trackCard:       { display: "flex", alignItems: "center", gap: 16, background: SURFACE, borderRadius: 12, padding: "12px 16px", border: `1px solid ${BORDER}` },
  trackNum:        { width: 24, textAlign: "center", color: MUTED, fontSize: 15, fontFamily: FONT_DISPLAY, fontStyle: "italic" },
  trackArt:        { width: 64, height: 64, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  trackInfo:       { display: "flex", flexDirection: "column", gap: 4 },
  trackTitle:      { fontSize: 17, fontWeight: 600, fontFamily: FONT_DISPLAY, color: TEXT },
  trackArtist:     { fontSize: 14, color: MUTED },
  artistGrid:      { display: "flex", gap: 16, flexWrap: "wrap" },
  artistCard:      { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 96 },
  artistImg:       { width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: `2px solid ${BORDER}` },
  artistName:      { fontSize: 13, color: "#d4d4d8", textAlign: "center", lineHeight: 1.4 },
  chipRow:         { display: "flex", flexWrap: "wrap", gap: 10 },
  chip:            { padding: "6px 16px", borderRadius: 24, border: `1px solid ${BORDER}`, background: SURFACE, fontSize: 14, color: "#d4d4d8", fontFamily: FONT_BODY },
  statsRow:        { display: "flex", gap: 12, flexWrap: "wrap" },
  statPill:        { display: "flex", flexDirection: "column", padding: "12px 20px", borderRadius: 12, background: SURFACE, border: `1px solid ${BORDER}`, minWidth: 100 },
  statVal:         { fontSize: 20, fontWeight: 700, fontFamily: FONT_DISPLAY, color: TEXT },
  statKey:         { fontSize: 12, color: MUTED, marginTop: 4, textTransform: "uppercase" },
  cardList:        { display: "flex", flexDirection: "column", gap: 14 },
  mediaCard:       { display: "flex", alignItems: "flex-start", gap: 16, background: SURFACE, borderRadius: 12, padding: "16px", border: `1px solid ${BORDER}` },
  mediaRank:       { width: 24, paddingTop: 4, color: MUTED, fontSize: 15, fontFamily: FONT_DISPLAY, fontStyle: "italic", flexShrink: 0 },
  mediaIcon:       { width: 96, height: 96, borderRadius: 8, objectFit: "cover", flexShrink: 0, border: `1px solid ${BORDER}` },
  mediaInfo:       { display: "flex", flexDirection: "column", gap: 6, flex: 1 },
  mediaTitle:      { fontSize: 18, fontWeight: 600, fontFamily: FONT_DISPLAY, color: TEXT },
  mediaSub:        { fontSize: 14, color: MUTED },
  mediaThoughts:   { fontSize: 14, color: "#a1a1aa", fontStyle: "italic", marginTop: 4, lineHeight: 1.5 },
};

const card = {
  wrap:    { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, marginBottom: 16, overflow: "hidden" },
  meta:    { display: "flex", alignItems: "center", gap: 12, padding: "16px 16px 12px" },
  avatar:  { width: 36, height: 36, borderRadius: "50%", objectFit: "cover" },
  author:  { fontWeight: 600, fontSize: 15, color: TEXT },
  time:    { fontSize: 13, color: MUTED, marginLeft: "auto" },
  text:    { margin: "0 0 16px", padding: "0 16px", fontSize: 16, lineHeight: 1.6, color: "#d4d4d8" },
  img:     { width: "100%", display: "block", maxHeight: 500, objectFit: "cover" },
  actions: { display: "flex", justifyContent: "center", gap: 40, padding: "14px 16px", borderTop: `1px solid ${BORDER}` },
  btn:     { background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 15, fontWeight: 500, display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s" },
};

const modal = {
  overlay:    { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(4px)" },
  box:        { background: BG, borderRadius: "24px 24px 0 0", padding: "32px 24px 40px", width: "100%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto", border: `1px solid ${BORDER}` },
  title:      { margin: "0 0 8px", fontSize: 24, fontWeight: 700, fontFamily: FONT_DISPLAY, color: TEXT },
  sub:        { margin: "0 0 24px", fontSize: 16, color: MUTED },
  typeGrid:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
  typeCard:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "24px 12px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, cursor: "pointer", color: TEXT },
  typeLabel:  { fontSize: 15, color: "#d4d4d8", fontWeight: 500 },
  back:       { background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 15, marginBottom: 16, padding: 0, fontWeight: 500 },
  searchRow:  { display: "flex", gap: 10, marginBottom: 20 },
  searchInput:{ flex: 1, padding: "14px 16px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT, fontSize: 16, fontFamily: FONT_BODY, outline: "none" },
  searchBtn:  { padding: "0 20px", background: "#27272a", border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT, cursor: "pointer", display: "flex", alignItems: "center" },
  results:    { display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 },
  resultRow:  { display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 12, border: `1px solid ${BORDER}`, cursor: "pointer", textAlign: "left", transition: "0.2s" },
  resultImg:  { width: 64, height: 64, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  resultText: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  resultTitle:{ fontSize: 16, color: TEXT, fontWeight: 500 },
  resultSub:  { fontSize: 14, color: MUTED },
  pickedBar:  { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0 0", borderTop: `1px solid ${BORDER}` },
  pickedCount:{ fontSize: 15, color: MUTED, fontWeight: 500 },
  saveBtn:    { padding: "12px 28px", borderRadius: 30, background: TEXT, color: BG, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600 },
  iconBtn:    { background: "none", border: "none", color: MUTED, cursor: "pointer" },
  label:      { display: "block", marginBottom: 8, color: MUTED, fontSize: 14 },
  settingsRow:{ width: "100%", textAlign: "left", padding: "16px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT, fontSize: 16, cursor: "pointer" }
};

const nav = {
  bar:   { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 680, display: "flex", justifyContent: "space-around", background: `rgba(9, 9, 11, 0.95)`, backdropFilter: "blur(10px)", borderTop: `1px solid ${BORDER}`, padding: "12px 0 20px", zIndex: 100 },
  item:  { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "6px 16px", borderRadius: 12 },
  active:{ color: TEXT },
  label: { fontSize: 12, fontWeight: 500, color: MUTED },
};