import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronDown, ChevronUp, Plus, Music2, Gamepad2, Tv2, BookOpen, Film,
  Search, Loader2, Check, Heart, MessageCircle, Share2,
  Home, Compass, PlusSquare, Bell, User, Settings, X,
  Edit3, Lock, Image, ArrowLeft, Trash2, Link, CornerDownRight,
  Sun, Moon, Camera, LogOut
} from "lucide-react";

// ── Google Fonts ────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

// ── Design tokens ────────────────────────────────────────────────────────────
const DARK = {
  bg:          "#0a0a0a", surface: "#111111", surface2: "#181818",
  border:      "#1e1e1e", border2: "#2a2a2a",
  text:        "#eeeeee", muted: "#666666",   muted2: "#888888",
  violet:      "#7c3aed", violetDim: "#4c1d95", violetFaint: "#1e1040",
  violetGlow:  "#a78bfa",
  maroon:      "#7f1d1d", maroonBright: "#b91c1c", maroonFaint: "#2d0a0a",
  maroonGlow:  "#f87171",
};
const LIGHT = {
  bg:          "#f4f4f6", surface: "#ffffff", surface2: "#ebebf0",
  border:      "#dcdce0", border2: "#c8c8d0",
  text:        "#111111", muted: "#888888",   muted2: "#555555",
  violet:      "#7c3aed", violetDim: "#c4b5fd", violetFaint: "#ede9fe",
  violetGlow:  "#6d28d9",
  maroon:      "#9b1c1c", maroonBright: "#b91c1c", maroonFaint: "#fee2e2",
  maroonGlow:  "#dc2626",
};

const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
const FONT_BODY    = "'Inter', 'Segoe UI', sans-serif";

// ── Auth & token helpers ──────────────────────────────────────────────────────
// TODO: replace with real auth context
const isOwnProfile = true;
const getToken = () => localStorage.getItem("ketty_token") || "";
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ── API base ──────────────────────────────────────────────────────────────────
const API = "/api";

// ── Section types ─────────────────────────────────────────────────────────────
const SECTION_TYPES = [
  { id: "music",  label: "Music",  icon: Music2,   accent: (C) => C.violetGlow },
  { id: "games",  label: "Games",  icon: Gamepad2, accent: (C) => C.maroonGlow },
  { id: "anime",  label: "Anime",  icon: Tv2,      accent: (C) => "#60a5fa"    },
  { id: "books",  label: "Books",  icon: BookOpen, accent: (C) => "#34d399"    },
  { id: "movies", label: "Movies", icon: Film,     accent: (C) => "#fbbf24"    },
];

// ── Display name helper ───────────────────────────────────────────────────────
const displayLabel = (user) => user?.displayName || user?.username || "";

// ═══════════════════════════════════════════════════════════════════════════════
// MUSIC SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function MusicSection({ data, C }) {
  return (
    <div style={buildSS(C).wrap}>
      {isOwnProfile && (
        <button
          style={data.spotifyConnected ? buildSS(C).spotifyOn : buildSS(C).spotifyOff}
          onClick={() => { /* TODO: POST /api/integrations/spotify/connect */ }}>
          <Music2 size={15} />
          {data.spotifyConnected ? "Synced with Spotify" : "Connect Spotify to auto-sync"}
        </button>
      )}

      {data.topTracks?.length > 0 && <>
        <p style={buildSS(C).blockLabel}>TOP TRACKS</p>
        <div style={buildSS(C).trackList}>
          {data.topTracks.map((track, i) => (
            <div key={i} style={buildSS(C).trackCard}>
              <span style={buildSS(C).trackNum}>{i + 1}</span>
              <img src={track.albumArt} alt="" style={buildSS(C).trackArt} />
              <div style={buildSS(C).trackInfo}>
                <span style={buildSS(C).trackTitle}>{track.title}</span>
                <span style={buildSS(C).trackArtist}>{track.artist}</span>
              </div>
            </div>
          ))}
        </div>
      </>}

      {data.topArtists?.length > 0 && <>
        <p style={buildSS(C).blockLabel}>TOP ARTISTS</p>
        <div style={buildSS(C).artistGrid}>
          {data.topArtists.map((artist, i) => (
            <div key={i} style={buildSS(C).artistCard}>
              <img src={artist.image} alt={artist.name} style={buildSS(C).artistImg} />
              <span style={buildSS(C).artistName}>{artist.name}</span>
            </div>
          ))}
        </div>
      </>}

      {data.favGenres?.length > 0 && <>
        <p style={buildSS(C).blockLabel}>FAVOURITE GENRES</p>
        <div style={buildSS(C).chipRow}>
          {data.favGenres.map((g) => <span key={g} style={buildSS(C).chip}>{g}</span>)}
        </div>
      </>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAMES SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function GamesSection({ data, C }) {
  const ss = buildSS(C);
  return (
    <div style={ss.wrap}>
      <div style={ss.statsRow}>
        {data.totalHours != null && (
          <div style={ss.statPill}>
            <span style={ss.statVal}>{data.totalHours}h</span>
            <span style={ss.statKey}>total played</span>
          </div>
        )}
        {data.favGenre && (
          <div style={ss.statPill}>
            <span style={ss.statVal}>{data.favGenre}</span>
            <span style={ss.statKey}>fav genre</span>
          </div>
        )}
      </div>
      {data.topGames?.length > 0 && <>
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
      </>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIME SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function AnimeSection({ data, C }) {
  const ss = buildSS(C);
  return (
    <div style={ss.wrap}>
      {data.favGenre && (
        <div style={ss.statsRow}>
          <div style={ss.statPill}>
            <span style={ss.statVal}>{data.favGenre}</span>
            <span style={ss.statKey}>fav genre</span>
          </div>
        </div>
      )}
      {data.topAnime?.length > 0 && <>
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
      </>}
    </div>
  );
}

function GenericSection({ data, C }) {
  const ss = buildSS(C);
  if (!data.items?.length) return (
    <p style={{ color: C.muted, fontSize: 14, padding: "8px 0" }}>No entries yet.</p>
  );
  return (
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
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION SHELL
// ═══════════════════════════════════════════════════════════════════════════════
function SpecialSectionShell({ section, children, C }) {
  const [open, setOpen] = useState(false);
  const typeInfo = SECTION_TYPES.find(t => t.id === section.type);
  const TypeIcon = typeInfo?.icon;
  const accent   = typeInfo ? typeInfo.accent(C) : C.violetGlow;

  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        style={{
          width: "100%", display: "flex", justifyContent: "space-between",
          alignItems: "center", background: "none", border: "none",
          color: C.text, padding: "16px 0", cursor: "pointer",
        }}
        onClick={() => setOpen(o => !o)}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {TypeIcon && <TypeIcon size={17} color={accent} />}
          <span style={{
            fontSize: 16, fontWeight: 600, fontFamily: FONT_DISPLAY,
            letterSpacing: 0.3, color: open ? accent : C.text,
          }}>
            {section.label || section.type.charAt(0).toUpperCase() + section.type.slice(1)}
          </span>
        </div>
        {open ? <ChevronUp size={16} color={C.muted2} /> : <ChevronDown size={16} color={C.muted2} />}
      </button>
      {open && <div style={{ paddingBottom: 22 }}>{children}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMENTS SYSTEM (Reddit-style)
// ═══════════════════════════════════════════════════════════════════════════════
function CommentNode({ comment, depth = 0, postId, C, onReplyAdded }) {
  const [replying, setReplying]   = useState(false);
  const [replyText, setReplyText] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      // POST /api/posts/{postId}/comments  body: { content, parentCommentId: comment.id }
      const res = await fetch(`${API}/posts/${postId}/comments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ content: replyText, parentCommentId: comment.id }),
      });
      if (!res.ok) throw new Error();
      const newReply = await res.json();
      onReplyAdded(comment.id, newReply);
      setReplyText("");
      setReplying(false);
    } catch {
      alert("Failed to post reply.");
    } finally {
      setSubmitting(false);
    }
  };

  const indentColor = ["#7c3aed44","#b91c1c44","#1d4ed844","#15803d44"][depth % 4];

  return (
    <div style={{ marginLeft: depth > 0 ? 16 : 0, borderLeft: depth > 0 ? `2px solid ${indentColor}` : "none", paddingLeft: depth > 0 ? 12 : 0 }}>
      <div style={{ padding: "10px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <img src={comment.author?.avatarUrl || `https://placehold.co/28x28/${C.violetFaint.replace("#","")}/aaa?text=${(comment.author?.username||"?")[0].toUpperCase()}`}
            alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
            {displayLabel(comment.author)}
          </span>
          <span style={{ fontSize: 12, color: C.muted }}>· {comment.createdAt}</span>
          <button style={{ marginLeft: "auto", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 12 }}
            onClick={() => setCollapsed(c => !c)}>
            {collapsed ? "expand" : "collapse"}
          </button>
        </div>
        {!collapsed && <>
          <p style={{ margin: "0 0 6px", fontSize: 14, color: C.text, lineHeight: 1.6, paddingLeft: 32 }}>
            {comment.content}
          </p>
          <div style={{ paddingLeft: 32, display: "flex", gap: 12 }}>
            <button style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
              onClick={() => setReplying(r => !r)}>
              <CornerDownRight size={12} /> Reply
            </button>
          </div>
          {replying && (
            <div style={{ paddingLeft: 32, marginTop: 8, display: "flex", gap: 8 }}>
              <input
                style={{ flex: 1, padding: "8px 12px", background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 8, color: C.text, fontSize: 13, fontFamily: FONT_BODY, outline: "none" }}
                placeholder="Write a reply…"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && submitReply()}
                autoFocus
              />
              <button
                style={{ padding: "8px 14px", background: C.violet, border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: 13, opacity: submitting ? 0.6 : 1 }}
                onClick={submitReply} disabled={submitting}>
                {submitting ? <Loader2 size={13} /> : "Post"}
              </button>
            </div>
          )}
          {comment.replies?.length > 0 && (
            <div style={{ marginTop: 4 }}>
              {comment.replies.map(reply => (
                <CommentNode key={reply.id} comment={reply} depth={depth + 1} postId={postId} C={C} onReplyAdded={onReplyAdded} />
              ))}
            </div>
          )}
        </>}
      </div>
    </div>
  );
}

function CommentsModal({ post, C, onClose }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [text, setText]         = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // GET /api/posts/{postId}/comments  — returns threaded comment tree
    fetch(`${API}/posts/${post.id}/comments`)
      .then(r => r.json())
      .then(data => { setComments(data.comments || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [post.id]);

  const addReplyToTree = (parentId, newReply) => {
    const insert = (nodes) => nodes.map(n =>
      n.id === parentId
        ? { ...n, replies: [...(n.replies || []), newReply] }
        : { ...n, replies: insert(n.replies || []) }
    );
    setComments(prev => insert(prev));
  };

  const submitTop = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      // POST /api/posts/{postId}/comments  body: { content }
      const res = await fetch(`${API}/posts/${post.id}/comments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ content: text }),
      });
      if (!res.ok) throw new Error();
      const newComment = await res.json();
      setComments(prev => [newComment, ...prev]);
      setText("");
    } catch {
      alert("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={buildMD(C).centeredOverlay} onClick={onClose}>
      <div style={{ ...buildMD(C).centeredBox, width: "94%", maxWidth: 640, maxHeight: "80vh", display: "flex", flexDirection: "column" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ ...buildMD(C).topBar, flexShrink: 0 }}>
          <span style={buildMD(C).title}>Comments</span>
          <button style={buildMD(C).iconBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {/* New comment input */}
        <div style={{ flexShrink: 0, display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            style={{ flex: 1, padding: "10px 14px", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontFamily: FONT_BODY, outline: "none" }}
            placeholder="Add a comment…"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && submitTop()}
          />
          <button
            style={{ padding: "0 16px", background: C.violet, border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", opacity: submitting ? 0.6 : 1 }}
            onClick={submitTop} disabled={submitting}>
            {submitting ? <Loader2 size={14} /> : "Post"}
          </button>
        </div>

        {/* Comment tree */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && <div style={{ textAlign: "center", padding: 24 }}><Loader2 size={18} color={C.muted} /></div>}
          {!loading && comments.length === 0 && (
            <p style={{ color: C.muted, fontSize: 14, textAlign: "center", padding: 24 }}>No comments yet. Be the first.</p>
          )}
          {comments.map(c => (
            <CommentNode key={c.id} comment={c} postId={post.id} C={C} onReplyAdded={addReplyToTree} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARE MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function ShareModal({ post, C, onClose }) {
  const [copied, setCopied] = useState(false);
  // Construct link — adjust base URL to your domain
  const link = `${window.location.origin}/post/${post.id}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = link;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={buildMD(C).centeredOverlay} onClick={onClose}>
      <div style={{ ...buildMD(C).centeredBox, width: "90%", maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div style={{ ...buildMD(C).topBar, marginBottom: 16 }}>
          <span style={buildMD(C).title}>Share post</span>
          <button style={buildMD(C).iconBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Copy the link to share this post anywhere.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{
            flex: 1, padding: "10px 14px", background: C.surface2,
            border: `1px solid ${C.border}`, borderRadius: 10,
            color: C.muted2, fontSize: 13, overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{link}</div>
          <button
            style={{ padding: "10px 18px", background: copied ? C.maroon : C.violet, border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}
            onClick={copyLink}>
            {copied ? <Check size={14} /> : <Link size={14} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST CARD
// ═══════════════════════════════════════════════════════════════════════════════
function PostCard({ post, C }) {
  const [liked,    setLiked]    = useState(post.liked);
  const [likes,    setLikes]    = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [showShare,    setShowShare]    = useState(false);

  const authorName = displayLabel(post.author);

  const toggleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikes(n => next ? n + 1 : n - 1);
    try {
      // POST /api/posts/{postId}/like
      await fetch(`${API}/posts/${post.id}/like`, {
        method: "POST",
        headers: authHeaders(),
      });
    } catch {
      // revert on failure
      setLiked(!next);
      setLikes(n => next ? n - 1 : n + 1);
    }
  };

  const pc = buildPC(C);
  return (
    <>
      <div style={pc.wrap}>
        <div style={pc.meta}>
          <img src={post.author.avatarUrl} alt="" style={pc.avatar} />
          <div style={{ flex: 1 }}>
            <span style={pc.author}>{authorName}</span>
            <span style={pc.handle}>@{post.author.username}</span>
          </div>
          <span style={pc.time}>{post.createdAt}</span>
        </div>
        {post.text && <p style={pc.text}>{post.text}</p>}
        {post.images?.length > 0 && <img src={post.images[0]} alt="" style={pc.img} />}
        <div style={pc.actions}>
          <button style={{ ...pc.btn, color: liked ? C.maroonGlow : C.muted2 }} onClick={toggleLike}>
            <Heart size={17} fill={liked ? C.maroonGlow : "none"} />
            <span>{likes}</span>
          </button>
          <button style={pc.btn} onClick={() => setShowComments(true)}>
            <MessageCircle size={17} /><span>{post.commentCount ?? 0}</span>
          </button>
          <button style={pc.btn} onClick={() => setShowShare(true)}>
            <Share2 size={17} /><span>Share</span>
          </button>
        </div>
      </div>
      {showComments && <CommentsModal post={post} C={C} onClose={() => setShowComments(false)} />}
      {showShare    && <ShareModal    post={post} C={C} onClose={() => setShowShare(false)} />}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST FEED (infinite scroll — real API)
// ═══════════════════════════════════════════════════════════════════════════════
function PostFeed({ username, activeTab, hobbies, C }) {
  const [posts,   setPosts]   = useState([]);
  const [page,    setPage]    = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef(null);

  useEffect(() => { setPosts([]); setPage(1); setHasMore(true); }, [activeTab]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      let url;
      if (activeTab === "personal") {
        // GET /api/posts/user/{username}/personal
        url = `${API}/posts/user/${username}/personal?page=${page}&limit=8`;
      } else {
        // Find hobbyId for the tab
        const hobby = hobbies.find(h => h.id === activeTab);
        if (hobby) {
          // GET /api/posts/user/{username}/hobby/{hobbyId}
          url = `${API}/posts/user/${username}/hobby/${hobby.id}?page=${page}&limit=8`;
        } else {
          // GET /api/posts/user/{username}  (all posts)
          url = `${API}/posts/user/${username}?page=${page}&limit=8`;
        }
      }
      const res  = await fetch(url);
      const data = await res.json();
      const newPosts = data.posts || [];
      setPosts(prev => [...prev, ...newPosts]);
      setHasMore(data.hasMore ?? false);
      setPage(n => n + 1);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, loading, hasMore, username, hobbies]);

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
      {posts.map(p => <PostCard key={p.id} post={p} C={C} />)}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Loader2 size={18} color={C.muted} style={{ animation: "spin 1s linear infinite" }} />
        </div>
      )}
      {!hasMore && posts.length === 0 && !loading && (
        <p style={{ textAlign: "center", color: C.muted, fontSize: 14, padding: "32px 0" }}>
          No posts here yet.
        </p>
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
// ADD SECTION MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function AddSectionModal({ onClose, onAdd, existingSectionTypes, C }) {
  const [step, setStep]             = useState("pick");
  const [selectedType, setSelectedType] = useState(null);
  const [query, setQuery]           = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching]   = useState(false);
  const [picked, setPicked]         = useState([]);
  const [saving, setSaving]         = useState(false);

  const available = SECTION_TYPES.filter(t => !existingSectionTypes.includes(t.id));

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearchResults([]);
    try {
      // Routes: /api/search/games  /api/search/music  /api/search/anime  /api/search/books  /api/search/movies
      const endpoint = selectedType === "music" ? "music" : selectedType;
      const res  = await fetch(`${API}/search/${endpoint}?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      // Expect: [{ id, title, subtitle, image }]
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSave = async () => {
    if (!selectedType || picked.length === 0) return;
    setSaving(true);
    try {
      // POST /api/hobbies  body: { name: selectedType, category: selectedType }
      const hobbyRes  = await fetch(`${API}/hobbies`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name: selectedType, category: selectedType }),
      });
      const hobby = await hobbyRes.json();

      // POST /api/hobbies/{hobbyId}/entries  for each picked item
      for (const item of picked) {
        await fetch(`${API}/hobbies/${hobby.id}/entries`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ title: item.title, subtitle: item.subtitle, image: item.image, externalId: item.id }),
        });
      }

      onAdd({
        id:    hobby.id,
        type:  selectedType,
        label: selectedType.charAt(0).toUpperCase() + selectedType.slice(1),
        data:  { items: picked },
      });
      onClose();
    } catch {
      alert("Failed to save section.");
    } finally {
      setSaving(false);
    }
  };

  const md = buildMD(C);

  return (
    <div style={md.centeredOverlay} onClick={onClose}>
      <div style={{ ...md.centeredBox, width: "92%", maxWidth: 500 }} onClick={e => e.stopPropagation()}>
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
              {available.length === 0
                ? "You've added all available section types."
                : "Choose what you want to showcase."}
            </p>
            <div style={md.typeGrid}>
              {available.map(({ id, label, icon: Icon, accent }) => (
                <button key={id} style={md.typeCard}
                  onClick={() => { setSelectedType(id); setStep("form"); setPicked([]); setQuery(""); setSearchResults([]); }}>
                  <div style={{ ...md.typeIconWrap, background: accent(C) + "22", border: `1px solid ${accent(C)}44` }}>
                    <Icon size={22} color={accent(C)} />
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
                  const sel = !!picked.find(p => p.id === item.id);
                  return (
                    <button key={item.id}
                      style={{ ...md.resultRow, background: sel ? C.violetFaint : C.surface2, borderColor: sel ? C.violet : C.border }}
                      onClick={() => setPicked(prev => sel ? prev.filter(p => p.id !== item.id) : [...prev, item])}>
                      <img src={item.image} alt="" style={md.resultImg} />
                      <div style={md.resultText}>
                        <span style={md.resultTitle}>{item.title}</span>
                        <span style={md.resultSub}>{item.subtitle}</span>
                      </div>
                      {sel && <Check size={16} color={C.violetGlow} />}
                    </button>
                  );
                })}
              </div>
            )}
            {picked.length > 0 && (
              <div style={md.pickedBar}>
                <span style={md.pickedCount}>{picked.length} selected</span>
                <button style={{ ...md.saveBtn, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 size={14} /> : "Save section"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD TAB MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function AddTabModal({ onClose, onAdd, C }) {
  const [name, setName]       = useState("");
  const [saving, setSaving]   = useState(false);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      // POST /api/hobbies  body: { name: trimmed }
      const res  = await fetch(`${API}/hobbies`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      onAdd({ id: data.id, label: trimmed });
      onClose();
    } catch {
      alert("Failed to create section.");
    } finally {
      setSaving(false);
    }
  };

  const md = buildMD(C);
  return (
    <div style={md.centeredOverlay} onClick={onClose}>
      <div style={{ ...md.centeredBox, width: "88%", maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div style={md.topBar}>
          <div style={{ width: 32 }} />
          <span style={md.title}>New post section</span>
          <button style={md.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <p style={md.sub}>Give it a name — e.g. Origami, Journaling, Photography.</p>
        <input
          style={{ ...md.searchInput, width: "100%", boxSizing: "border-box", marginBottom: 16 }}
          placeholder="Section name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSave()}
          autoFocus
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button style={{ ...md.saveBtn, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={14} /> : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EDIT PROFILE MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function EditProfileModal({ user, onClose, onSave, C }) {
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [bio, setBio]                 = useState(user.bio || "");
  const [saving, setSaving]           = useState(false);
  const [uploadingAvatar,  setUploadingAvatar]  = useState(false);
  const [uploadingBanner,  setUploadingBanner]  = useState(false);
  const [avatarUrl, setAvatarUrl]     = useState(user.avatarUrl);
  const [bannerUrl, setBannerUrl]     = useState(user.bannerUrl);
  const avatarInputRef = useRef();
  const bannerInputRef = useRef();

  const BIO_LIMIT = 200;

  const uploadFile = async (file, type, setUploading, setUrl) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      // POST /api/upload/image  (requires JWT)
      const res  = await fetch(`${API}/upload/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      setUrl(data.url);
    } catch {
      alert(`Failed to upload ${type}.`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // PUT /api/profile/me  body: { displayName, bio, avatarUrl, bannerUrl }
      const res = await fetch(`${API}/profile/me`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          displayName: displayName || null,
          bio,
          avatarUrl,
          bannerUrl,
        }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      onSave(updated);
      onClose();
    } catch {
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const md = buildMD(C);
  const ep = buildEP(C);

  return (
    <div style={md.centeredOverlay} onClick={onClose}>
      <div style={{ ...md.centeredBox, width: "92%", maxWidth: 520, maxHeight: "85vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        <div style={md.topBar}>
          <div style={{ width: 32 }} />
          <span style={md.title}>Edit profile</span>
          <button style={md.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {/* Banner — click banner area to change */}
        <div style={ep.section}>
          <p style={ep.label}>BANNER</p>
          <div style={{ position: "relative", width: "100%", height: 100, borderRadius: 10, overflow: "hidden", cursor: "pointer", border: `1px solid ${C.border2}` }}
            onClick={() => bannerInputRef.current.click()}>
            {bannerUrl
              ? <img src={bannerUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ width: "100%", height: "100%", background: C.violetFaint, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Camera size={24} color={C.muted} />
                </div>
            }
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {uploadingBanner
                ? <Loader2 size={18} color="#fff" />
                : <><Camera size={16} color="#fff" /><span style={{ color: "#fff", fontSize: 13 }}>Change banner</span></>
              }
            </div>
          </div>
          <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => e.target.files[0] && uploadFile(e.target.files[0], "banner", setUploadingBanner, setBannerUrl)} />
        </div>

        {/* Avatar */}
        <div style={ep.section}>
          <p style={ep.label}>PROFILE PICTURE</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => avatarInputRef.current.click()}>
              <img src={avatarUrl} alt="" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.violetDim}` }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {uploadingAvatar ? <Loader2 size={16} color="#fff" /> : <Camera size={16} color="#fff" />}
              </div>
            </div>
            <div>
              <button style={ep.uploadBtn} onClick={() => avatarInputRef.current.click()}>
                <Image size={14} /> Upload new photo
              </button>
              <p style={{ margin: "6px 0 0", fontSize: 12, color: C.muted }}>JPG, PNG or GIF · max 5MB</p>
            </div>
          </div>
          <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => e.target.files[0] && uploadFile(e.target.files[0], "avatar", setUploadingAvatar, setAvatarUrl)} />
        </div>

        {/* Display name */}
        <div style={ep.section}>
          <p style={ep.label}>DISPLAY NAME</p>
          <input
            style={ep.input}
            placeholder={`Defaults to @${user.username}`}
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
        </div>

        {/* Bio — 200 char limit */}
        <div style={ep.section}>
          <p style={ep.label}>BIO</p>
          <textarea
            style={{ ...ep.input, height: 90, resize: "none" }}
            placeholder="Tell people about yourself"
            value={bio}
            maxLength={BIO_LIMIT}
            onChange={e => setBio(e.target.value)}
          />
          <p style={{ margin: "4px 0 0", fontSize: 12, color: bio.length > BIO_LIMIT * 0.85 ? C.maroonGlow : C.muted, textAlign: "right" }}>
            {bio.length} / {BIO_LIMIT}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
          <button style={ep.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{ ...buildMD(C).saveBtn, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={14} /> : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function SettingsModal({ onClose, darkMode, setDarkMode, C }) {
  const [activeGroup, setActiveGroup] = useState("account");
  const [saving, setSaving] = useState(false);
  const [privacyPublic,     setPrivacyPublic]     = useState(true);
  const [showActivity,      setShowActivity]      = useState(true);
  const [allowShares,       setAllowShares]       = useState(true);
  const [notifLikes,        setNotifLikes]        = useState(true);
  const [notifComments,     setNotifComments]     = useState(true);
  const [notifFollowers,    setNotifFollowers]    = useState(true);
  const [notifEmail,        setNotifEmail]        = useState(false);
  const [compactView,       setCompactView]       = useState(false);
  const [reduceMotion,      setReduceMotion]      = useState(false);

  // New password flow
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew,     setPwNew]     = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwMsg,     setPwMsg]     = useState("");

  const savePrivacy = async () => {
    setSaving(true);
    try {
      // TODO: PUT /api/profile/me/privacy  body: { publicProfile: privacyPublic, showActivity, allowShares }
      await fetch(`${API}/profile/me/privacy`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ publicProfile: privacyPublic, showActivity, allowShares }),
      });
    } catch { alert("Failed to save privacy settings."); }
    finally { setSaving(false); }
  };

  const saveNotifications = async () => {
    setSaving(true);
    try {
      // TODO: PUT /api/profile/me/notifications  body: { likes, comments, followers, email }
      await fetch(`${API}/profile/me/notifications`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ likes: notifLikes, comments: notifComments, followers: notifFollowers, email: notifEmail }),
      });
    } catch { alert("Failed to save notification settings."); }
    finally { setSaving(false); }
  };

  const changePassword = async () => {
    if (pwNew !== pwConfirm) { setPwMsg("Passwords don't match."); return; }
    if (pwNew.length < 8)    { setPwMsg("Password must be at least 8 characters."); return; }
    setSaving(true);
    try {
      // TODO: POST /api/auth/change-password  body: { currentPassword, newPassword }
      const res = await fetch(`${API}/auth/change-password`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }),
      });
      if (!res.ok) { const d = await res.json(); setPwMsg(d.message || "Failed."); return; }
      setPwMsg("Password changed successfully.");
      setPwCurrent(""); setPwNew(""); setPwConfirm("");
    } catch { setPwMsg("Failed to change password."); }
    finally { setSaving(false); }
  };

  const deleteAccount = async () => {
    if (!window.confirm("This is permanent. Are you sure you want to delete your account?")) return;
    try {
      // TODO: DELETE /api/profile/me
      await fetch(`${API}/profile/me`, { method: "DELETE", headers: authHeaders() });
      alert("Account deleted. You will be logged out.");
      // TODO: clear auth token and redirect to /login
    } catch { alert("Failed to delete account."); }
  };

  const groups = [
    { id: "account",       label: "Account"       },
    { id: "privacy",       label: "Privacy"       },
    { id: "notifications", label: "Notifications" },
    { id: "appearance",    label: "Appearance"    },
    { id: "about",         label: "About"         },
  ];

  const stg = buildSTG(C);
  const ep  = buildEP(C);
  const md  = buildMD(C);

  const renderGroup = () => {
    switch (activeGroup) {
      case "account": return (
        <div style={stg.group}>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Change your password below.</p>
          <div style={ep.section}>
            <p style={ep.label}>CURRENT PASSWORD</p>
            <input type="password" style={ep.input} value={pwCurrent} onChange={e => setPwCurrent(e.target.value)} placeholder="Current password" />
          </div>
          <div style={ep.section}>
            <p style={ep.label}>NEW PASSWORD</p>
            <input type="password" style={ep.input} value={pwNew} onChange={e => setPwNew(e.target.value)} placeholder="At least 8 characters" />
          </div>
          <div style={ep.section}>
            <p style={ep.label}>CONFIRM NEW PASSWORD</p>
            <input type="password" style={ep.input} value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} placeholder="Repeat new password" />
          </div>
          {pwMsg && <p style={{ fontSize: 13, color: pwMsg.includes("success") ? "#34d399" : C.maroonGlow, marginBottom: 10 }}>{pwMsg}</p>}
          <button style={{ ...md.saveBtn, marginBottom: 24, opacity: saving ? 0.6 : 1 }} onClick={changePassword} disabled={saving}>
            {saving ? <Loader2 size={14} /> : "Update password"}
          </button>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", background: "none", border: "none", color: C.maroonGlow, cursor: "pointer", fontSize: 14 }}
              onClick={() => { /* TODO: clear token + redirect */ }}>
              <LogOut size={16} /> Log out
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", background: "none", border: "none", color: C.maroonGlow, cursor: "pointer", fontSize: 14 }}
              onClick={deleteAccount}>
              <Trash2 size={16} /> Delete account
            </button>
          </div>
        </div>
      );

      case "privacy": return (
        <div style={stg.group}>
          <SettingsToggle C={C} label="Public profile"       sub="Anyone can view your profile" val={privacyPublic}  setVal={setPrivacyPublic} />
          <SettingsToggle C={C} label="Show activity status" sub="Others can see when you're active" val={showActivity} setVal={setShowActivity} />
          <SettingsToggle C={C} label="Allow post shares"    sub="People can share your posts" val={allowShares}   setVal={setAllowShares} />
          <button style={{ ...md.saveBtn, marginTop: 16, opacity: saving ? 0.6 : 1 }} onClick={savePrivacy} disabled={saving}>
            {saving ? <Loader2 size={14} /> : "Save privacy settings"}
          </button>
        </div>
      );

      case "notifications": return (
        <div style={stg.group}>
          <SettingsToggle C={C} label="Likes on posts"    val={notifLikes}     setVal={setNotifLikes} />
          <SettingsToggle C={C} label="Comments on posts" val={notifComments}  setVal={setNotifComments} />
          <SettingsToggle C={C} label="New followers"     val={notifFollowers} setVal={setNotifFollowers} />
          <SettingsToggle C={C} label="Email notifications" sub="Receive a daily digest" val={notifEmail} setVal={setNotifEmail} />
          <button style={{ ...md.saveBtn, marginTop: 16, opacity: saving ? 0.6 : 1 }} onClick={saveNotifications} disabled={saving}>
            {saving ? <Loader2 size={14} /> : "Save notification settings"}
          </button>
        </div>
      );

      case "appearance": return (
        <div style={stg.group}>
          <div style={{ ...stg.row, cursor: "default" }}>
            <div style={{ flex: 1 }}>
              <span style={stg.rowLabel}>Theme</span>
              <span style={{ display: "block", fontSize: 12, color: C.muted, marginTop: 2 }}>
                {darkMode ? "Dark mode" : "Light mode"}
              </span>
            </div>
            <button
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 20, border: `1px solid ${C.border2}`, background: C.surface2, color: C.text, cursor: "pointer", fontSize: 13 }}
              onClick={() => setDarkMode(d => !d)}>
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
              {darkMode ? "Switch to light" : "Switch to dark"}
            </button>
          </div>
          <SettingsToggle C={C} label="Compact post view" val={compactView}   setVal={setCompactView} />
          <SettingsToggle C={C} label="Reduce motion"     val={reduceMotion}  setVal={setReduceMotion} />
        </div>
      );

      case "about": return (
        <div style={stg.group}>
          {[
            { label: "Privacy policy",    href: "/privacy"  },
            { label: "Terms of service",  href: "/terms"    },
          ].map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={{ ...stg.row, textDecoration: "none" }}>
              <span style={stg.rowLabel}>{label}</span>
              <ChevronDown size={14} color={C.muted} style={{ transform: "rotate(-90deg)" }} />
            </a>
          ))}
          <div style={{ ...stg.row, cursor: "default" }}>
            <span style={{ ...stg.rowLabel, color: C.muted }}>ketty v0.1.0</span>
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div style={md.centeredOverlay} onClick={onClose}>
      <div style={{ ...md.centeredBox, width: "94%", maxWidth: 600, maxHeight: "88vh", display: "flex", flexDirection: "column" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ ...md.topBar, flexShrink: 0 }}>
          <div style={{ width: 32 }} />
          <span style={md.title}>Settings</span>
          <button style={md.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={{ ...stg.tabs, flexShrink: 0 }}>
          {groups.map(g => (
            <button key={g.id}
              style={{ ...stg.tab, ...(activeGroup === g.id ? stg.tabActive : {}) }}
              onClick={() => setActiveGroup(g.id)}>
              {g.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>{renderGroup()}</div>
      </div>
    </div>
  );
}

function SettingsToggle({ label, sub, val, setVal, C }) {
  const stg = buildSTG(C);
  return (
    <div style={stg.row}>
      <div style={{ flex: 1 }}>
        <span style={stg.rowLabel}>{label}</span>
        {sub && <span style={{ display: "block", fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</span>}
      </div>
      <button style={{ ...stg.toggle, background: val ? C.violet : C.border2 }} onClick={() => setVal(v => !v)}>
        <div style={{ ...stg.toggleKnob, transform: val ? "translateX(18px)" : "translateX(2px)" }} />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOTTOM NAV
// ═══════════════════════════════════════════════════════════════════════════════
function BottomNav({ active, C }) {
  const items = [
    { id: "feed",          label: "Feed",    Icon: Home       },
    { id: "explore",       label: "Explore", Icon: Compass    },
    { id: "post",          label: "Post",    Icon: PlusSquare },
    { id: "notifications", label: "Alerts",  Icon: Bell       },
    { id: "profile",       label: "Profile", Icon: User       },
  ];
  const nb = buildNB(C);
  return (
    <nav style={nb.bar}>
      {items.map(({ id, label, Icon }) => {
        const isActive = active === id;
        const isPost   = id === "post";
        return (
          <button key={id}
            style={{ ...nb.item, ...(isActive && !isPost ? nb.active : {}), ...(isPost ? nb.postBtn : {}) }}
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
  const [darkMode, setDarkMode]         = useState(true);
  const C = darkMode ? DARK : LIGHT;

  // ── Profile data — loaded from API ──────────────────────────────────────────
  const [user, setUser]                 = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Hobby sections (special: music, games, anime, etc.)
  const [sections, setSections]         = useState([]);

  // Post tab hobbies (user-created sections like Origami, Painting…)
  const [hobbies, setHobbies]           = useState([]);
  const [activeTab, setActiveTab]       = useState("personal");

  // Modals
  const [showAddSection,   setShowAddSection]   = useState(false);
  const [showAddTab,       setShowAddTab]       = useState(false);
  const [showEditProfile,  setShowEditProfile]  = useState(false);
  const [showSettings,     setShowSettings]     = useState(false);

  // Derive the username to load — in real app from route params
  const USERNAME = "me"; // TODO: replace with useParams() username, use "me" for own profile

  useEffect(() => {
    // GET /api/profile/me  (own profile)  or  GET /api/profile/{username}
    fetch(`${API}/profile/${USERNAME}`)
      .then(r => r.json())
      .then(data => { setUser(data); setLoadingProfile(false); })
      .catch(() => setLoadingProfile(false));

    // GET /api/hobbies/user/{username}
    fetch(`${API}/hobbies/user/${USERNAME}`)
      .then(r => r.json())
      .then(data => {
        const all = data.hobbies || [];
        // Split: known special types go into sections, rest into post tabs
        const specialTypes = SECTION_TYPES.map(t => t.id);
        const specials = all.filter(h => specialTypes.includes(h.category));
        const tabs     = all.filter(h => !specialTypes.includes(h.category));
        setSections(specials.map(h => ({
          id:   h.id,
          type: h.category,
          label: h.name,
          data: { items: h.entries || [] },
        })));
        setHobbies(tabs);
      })
      .catch(() => {});
  }, []);

  const existingSectionTypes = sections.map(s => s.type);

  const postTabs = [
    { id: "personal", label: "Personal" },
    ...hobbies.map(h => ({ id: h.id, label: h.name })),
  ];

  const renderSection = (s) => {
    switch (s.type) {
      case "music":  return <MusicSection  data={s.data} C={C} />;
      case "games":  return <GamesSection  data={s.data} C={C} />;
      case "anime":  return <AnimeSection  data={s.data} C={C} />;
      default:       return <GenericSection data={s.data} type={s.type} C={C} />;
    }
  };

  const pg = buildPG(C);

  if (loadingProfile) {
    return (
      <div style={{ ...pg.page, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <Loader2 size={28} color={C.violet} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  // Fallback skeleton while user loads
  const safeUser = user || { username: USERNAME, displayName: null, bio: "", avatarUrl: "", bannerUrl: "" };

  return (
    <div style={pg.page}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>

      {/* Banner */}
      <div style={pg.banner}>
        {safeUser.bannerUrl
          ? <img src={safeUser.bannerUrl} alt="" style={pg.bannerImg} />
          : <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${C.violetFaint}, ${C.maroonFaint})` }} />
        }
        <div style={pg.bannerOverlay} />
      </div>

      {/* Avatar + settings cog */}
      <div style={pg.avatarRow}>
        <div style={pg.avatarWrap}>
          <img
            src={safeUser.avatarUrl || `https://placehold.co/140x140/${C.violetFaint.replace("#","")}/aaa?text=${(safeUser.username||"?")[0].toUpperCase()}`}
            alt="avatar"
            style={pg.avatar}
          />
        </div>
        {isOwnProfile && (
          <button style={pg.cogBtn} onClick={() => setShowSettings(true)} title="Settings">
            <Settings size={18} color={C.muted2} />
          </button>
        )}
      </div>

      {/* User info */}
      <div style={pg.userInfo}>
        <h2 style={pg.displayName}>{displayLabel(safeUser)}</h2>
        <p style={pg.handle}>@{safeUser.username}</p>
        {safeUser.bio && <p style={pg.bio}>{safeUser.bio}</p>}
        {isOwnProfile && (
          <button style={pg.editBtn} onClick={() => setShowEditProfile(true)}>
            <Edit3 size={13} /> Edit profile
          </button>
        )}
      </div>

      {/* Special sections */}
      <div style={pg.sectionsWrap}>
        {sections.map(s => (
          <SpecialSectionShell key={s.id} section={s} C={C}>
            {renderSection(s)}
          </SpecialSectionShell>
        ))}
        {isOwnProfile && (
          <button style={pg.addSectionBtn} onClick={() => setShowAddSection(true)}>
            <Plus size={14} /> Add section
          </button>
        )}
      </div>

      {/* Post tabs — fix: derive active highlight from state, not CSS */}
      <div style={pg.tabBarWrap}>
        <div style={pg.tabBar}>
          {postTabs.map(tab => (
            <button key={tab.id}
              style={{
                ...pg.tab,
                color:            activeTab === tab.id ? C.violetGlow : C.muted,
                borderBottomColor: activeTab === tab.id ? C.violet    : "transparent",
              }}
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
      <PostFeed username={safeUser.username} activeTab={activeTab} hobbies={hobbies} C={C} />

      {/* Bottom nav */}
      <BottomNav active="profile" C={C} />

      {/* Modals */}
      {showAddSection && (
        <AddSectionModal
          onClose={() => setShowAddSection(false)}
          onAdd={s => setSections(prev => [...prev, s])}
          existingSectionTypes={existingSectionTypes}
          C={C}
        />
      )}
      {showAddTab && (
        <AddTabModal
          onClose={() => setShowAddTab(false)}
          onAdd={hobby => setHobbies(prev => [...prev, hobby])}
          C={C}
        />
      )}
      {showEditProfile && (
        <EditProfileModal
          user={safeUser}
          onClose={() => setShowEditProfile(false)}
          onSave={updated => setUser(updated)}
          C={C}
        />
      )}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          C={C}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE BUILDERS (all theme-aware, take C as argument)
// ═══════════════════════════════════════════════════════════════════════════════

const buildPG = (C) => ({
  page:         { maxWidth: 680, margin: "0 auto", paddingBottom: 90, fontFamily: FONT_BODY, background: C.bg, color: C.text, minHeight: "100vh" },
  banner:       { width: "100%", height: 210, overflow: "hidden", background: C.surface, position: "relative" },
  bannerImg:    { width: "100%", height: "100%", objectFit: "cover" },
  bannerOverlay:{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 50%, ${C.bg})` },
  avatarRow:    { display: "flex", justifyContent: "center", position: "relative", marginTop: -70 },
  avatarWrap:   { display: "flex", justifyContent: "center" },
  avatar:       { width: 140, height: 140, borderRadius: "50%", border: `4px solid ${C.bg}`, objectFit: "cover", background: C.violetFaint, boxShadow: `0 0 0 2px ${C.violet}55` },
  cogBtn:       { position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  userInfo:     { textAlign: "center", padding: "14px 24px 22px" },
  displayName:  { margin: "0 0 5px", fontSize: 28, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.text },
  handle:       { margin: "0 0 10px", color: C.muted, fontSize: 15 },
  bio:          { margin: "0 0 16px", fontSize: 15, lineHeight: 1.7, color: C.muted2, maxWidth: 420, marginLeft: "auto", marginRight: "auto" },
  editBtn:      { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 20px", borderRadius: 20, border: `1px solid ${C.violetDim}`, background: "transparent", color: C.violetGlow, cursor: "pointer", fontSize: 13, fontWeight: 500 },
  sectionsWrap: { padding: "0 16px 10px" },
  addSectionBtn:{ display: "flex", alignItems: "center", gap: 6, width: "100%", justifyContent: "center", padding: "12px 0", background: "none", border: `1px dashed ${C.violetDim}`, borderRadius: 10, color: C.muted, cursor: "pointer", fontSize: 13, marginTop: 10 },
  tabBarWrap:   { position: "sticky", top: 0, zIndex: 10, background: C.bg, borderBottom: `1px solid ${C.border}` },
  tabBar:       { display: "flex", overflowX: "auto", padding: "0 16px", scrollbarWidth: "none", gap: 2 },
  tab:          { flexShrink: 0, padding: "13px 18px", background: "none", border: "none", borderBottom: "2px solid transparent", cursor: "pointer", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", fontFamily: FONT_BODY, transition: "color 0.15s, border-bottom-color 0.15s" },
  addTabBtn:    { flexShrink: 0, padding: "13px 10px", background: "none", border: "none", color: C.muted, cursor: "pointer", display: "flex", alignItems: "center" },
});

const buildSS = (C) => ({
  wrap:          { display: "flex", flexDirection: "column", gap: 22 },
  blockLabel:    { margin: "0 0 10px", fontSize: 11, letterSpacing: 2, color: C.muted, fontFamily: FONT_BODY, fontWeight: 600 },
  spotifyOff:    { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 8, border: "1px solid #1db954", background: "transparent", color: "#1db954", cursor: "pointer", fontSize: 14, fontWeight: 500 },
  spotifyOn:     { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 8, border: "1px solid #1a3a1a", background: "#0d1a0d", color: "#4ade80", cursor: "pointer", fontSize: 14 },
  trackList:     { display: "flex", flexDirection: "column", gap: 10 },
  trackCard:     { display: "flex", alignItems: "center", gap: 14, background: C.surface, borderRadius: 10, padding: "12px 16px", border: `1px solid ${C.border}` },
  trackNum:      { width: 20, textAlign: "center", color: C.muted, fontSize: 14, fontFamily: FONT_DISPLAY, fontStyle: "italic" },
  trackArt:      { width: 52, height: 52, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  trackInfo:     { display: "flex", flexDirection: "column", gap: 3 },
  trackTitle:    { fontSize: 16, fontWeight: 600, fontFamily: FONT_DISPLAY, color: C.text },
  trackArtist:   { fontSize: 13, color: C.muted2 },
  artistGrid:    { display: "flex", gap: 16, flexWrap: "wrap" },
  artistCard:    { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 88 },
  artistImg:     { width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.violetDim}` },
  artistName:    { fontSize: 12, color: C.muted2, textAlign: "center", lineHeight: 1.3 },
  chipRow:       { display: "flex", flexWrap: "wrap", gap: 8 },
  chip:          { padding: "6px 16px", borderRadius: 20, border: `1px solid ${C.violetDim}`, background: C.violetFaint, fontSize: 13, color: C.violetGlow, fontFamily: FONT_BODY },
  statsRow:      { display: "flex", gap: 12, flexWrap: "wrap" },
  statPill:      { display: "flex", flexDirection: "column", padding: "10px 18px", borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, minWidth: 90 },
  statVal:       { fontSize: 18, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.text },
  statKey:       { fontSize: 12, color: C.muted, marginTop: 3 },
  cardList:      { display: "flex", flexDirection: "column", gap: 12 },
  mediaCard:     { display: "flex", alignItems: "flex-start", gap: 14, background: C.surface, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.border}` },
  mediaRank:     { width: 22, paddingTop: 3, color: C.muted, fontSize: 14, fontFamily: FONT_DISPLAY, fontStyle: "italic", flexShrink: 0 },
  mediaIcon:     { width: 80, height: 80, borderRadius: 10, objectFit: "cover", flexShrink: 0, border: `1px solid ${C.border2}` },
  mediaInfo:     { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  mediaTitle:    { fontSize: 17, fontWeight: 600, fontFamily: FONT_DISPLAY, color: C.text },
  mediaSub:      { fontSize: 13, color: C.muted2 },
  mediaThoughts: { fontSize: 14, color: C.muted2, fontStyle: "italic", marginTop: 2 },
});

const buildPC = (C) => ({
  wrap:    { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 14, overflow: "hidden" },
  meta:    { display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 10px" },
  avatar:  { width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: `1px solid ${C.violetDim}` },
  author:  { fontWeight: 600, fontSize: 15, display: "block", color: C.text },
  handle:  { fontSize: 12, color: C.muted, display: "block" },
  time:    { fontSize: 12, color: C.muted, marginLeft: "auto" },
  text:    { margin: "0 0 12px", padding: "0 16px", fontSize: 15, lineHeight: 1.65, color: C.muted2 },
  img:     { width: "100%", display: "block", maxHeight: 420, objectFit: "cover" },
  actions: { display: "flex", justifyContent: "center", gap: 36, padding: "12px 16px", borderTop: `1px solid ${C.border}` },
  btn:     { background: "none", border: "none", color: C.muted2, cursor: "pointer", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 },
});

// Centered modal (not bottom-sheet)
const buildMD = (C) => ({
  centeredOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
  centeredBox:     { background: C.surface, borderRadius: 16, padding: "24px 22px 28px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)", border: `1px solid ${C.border2}` },
  topBar:          { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title:           { fontSize: 20, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.text },
  sub:             { margin: "0 0 20px", fontSize: 14, color: C.muted },
  iconBtn:         { background: "none", border: "none", color: C.muted2, cursor: "pointer", padding: 4, display: "flex", alignItems: "center" },
  typeGrid:        { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
  typeCard:        { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 10px", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, cursor: "pointer" },
  typeIconWrap:    { width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" },
  typeLabel:       { fontSize: 13, color: C.muted2 },
  spotifyPill:     { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", marginBottom: 14, borderRadius: 8, border: "1px solid #1db954", background: "transparent", color: "#1db954", cursor: "pointer", fontSize: 13 },
  searchRow:       { display: "flex", gap: 8, marginBottom: 14 },
  searchInput:     { flex: 1, padding: "11px 14px", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontFamily: FONT_BODY, outline: "none" },
  searchBtn:       { padding: "0 16px", background: C.violetDim, border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" },
  results:         { display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 },
  resultRow:       { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`, cursor: "pointer", textAlign: "left", background: C.surface2 },
  resultImg:       { width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  resultText:      { display: "flex", flexDirection: "column", gap: 3, flex: 1 },
  resultTitle:     { fontSize: 15, color: C.text },
  resultSub:       { fontSize: 13, color: C.muted },
  pickedBar:       { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 0", borderTop: `1px solid ${C.border}` },
  pickedCount:     { fontSize: 13, color: C.muted },
  saveBtn:         { display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 22px", borderRadius: 20, background: C.violet, color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 },
});

const buildEP = (C) => ({
  section:    { marginBottom: 20 },
  label:      { margin: "0 0 8px", fontSize: 11, letterSpacing: 1.5, color: C.muted, fontWeight: 600 },
  uploadBtn:  { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: `1px solid ${C.border2}`, background: "transparent", color: C.muted2, cursor: "pointer", fontSize: 13 },
  input:      { width: "100%", padding: "11px 14px", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontFamily: FONT_BODY, outline: "none", boxSizing: "border-box" },
  cancelBtn:  { padding: "9px 22px", borderRadius: 20, background: "transparent", border: `1px solid ${C.border2}`, color: C.muted2, cursor: "pointer", fontSize: 14 },
});

const buildSTG = (C) => ({
  tabs:       { display: "flex", overflowX: "auto", gap: 4, marginBottom: 20, scrollbarWidth: "none" },
  tab:        { flexShrink: 0, padding: "7px 14px", borderRadius: 20, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: FONT_BODY, whiteSpace: "nowrap" },
  tabActive:  { background: C.violetFaint, borderColor: C.violetDim, color: C.violetGlow },
  group:      { display: "flex", flexDirection: "column" },
  row:        { display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: `1px solid ${C.border}` },
  rowLabel:   { flex: 1, fontSize: 15, color: C.text },
  toggle:     { width: 42, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0, padding: 0 },
  toggleKnob: { position: "absolute", top: 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "transform 0.2s" },
});

const buildNB = (C) => ({
  bar:     { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 680, display: "flex", justifyContent: "space-around", alignItems: "center", background: C.bg, borderTop: `1px solid ${C.border}`, padding: "8px 0 14px", zIndex: 100 },
  item:    { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", color: C.muted, cursor: "pointer", padding: "4px 12px", borderRadius: 8 },
  active:  { color: C.violetGlow },
  postBtn: { background: C.violet, borderRadius: "50%", width: 46, height: 46, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px ${C.violet}88`, marginBottom: 6 },
  label:   { fontSize: 10, fontWeight: 500 },
});