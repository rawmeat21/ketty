import { useState, useRef } from "react";
import { Image, Video, X, Loader2, Send } from "lucide-react";
import api from "../api/axios";

const DARK = {
  bg: "#0a0a0a", surface: "#111111", surface2: "#181818",
  border: "#1e1e1e", border2: "#2a2a2a",
  text: "#eeeeee", muted: "#666666", muted2: "#888888",
  violet: "#7c3aed", violetDim: "#4c1d95", violetFaint: "#1e1040",
  violetGlow: "#a78bfa",
  maroon: "#7f1d1d", maroonBright: "#b91c1c", maroonFaint: "#2d0a0a",
  maroonGlow: "#f87171",
};

const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
const FONT_BODY    = "'Inter', 'Segoe UI', sans-serif";
const MAX_CHARS    = 2000;

export default function CreatePostForm({ currentUser, hobbies = [], onPostCreated, onCancel }) {
  const C = DARK;

  const [content, setContent]             = useState("");
  const [hobbyId, setHobbyId]             = useState("");
  const [mediaType, setMediaType]         = useState(null); // "image" | "video" | null
  const [mediaUrl, setMediaUrl]           = useState("");
  const [saving, setSaving]               = useState(false);
  const [error, setError]                 = useState(null);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const textareaRef = useRef(null);

  const charsLeft   = MAX_CHARS - content.length;
  const isOverLimit = charsLeft < 0;
  const isEmpty     = content.trim().length === 0;

  const handleSubmit = async () => {
    if (isEmpty || isOverLimit || saving) return;
    setSaving(true);
    setError(null);
    try {
      const body = {
        content: content.trim(),
        ...(hobbyId  && { hobbyId: Number(hobbyId) }),
        ...(mediaType === "image" && mediaUrl.trim() && { imageUrl: mediaUrl.trim() }),
        ...(mediaType === "video" && mediaUrl.trim() && { videoUrl: mediaUrl.trim() }),
      };
      const res = await api.post("/api/posts", body);
      onPostCreated?.(res.data);
      setContent(""); setHobbyId(""); setMediaType(null); setMediaUrl("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create post.");
    } finally {
      setSaving(false);
    }
  };

	const clearMedia = () => {
		setMediaType(null);
		setMediaUrl("");
		if (imageInputRef.current) imageInputRef.current.value = "";
		if (videoInputRef.current) videoInputRef.current.value = "";
	};

  const handleChange = (e) => {
    setContent(e.target.value);
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }
  };

  const toggleMedia = (type) => {
    if (mediaType === type) { setMediaType(null); setMediaUrl(""); }
    else { setMediaType(type); setMediaUrl(""); }
  };

  const progressColor = isOverLimit ? C.maroonBright : charsLeft < 200 ? C.maroonGlow : C.violet;

	const uploadFile = async (file, type) => {
		setUploading(true);
		setError(null);
		try {
			const formData = new FormData();
			formData.append("file", file);
			const endpoint = type === "video" ? "/api/upload/video" : "/api/upload/image";
			const res = await api.post(endpoint, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setMediaUrl(res.data.url);
		} catch {
			setError(`Failed to upload ${type}. Please try again.`);
		} finally {
			setUploading(false);
		}
	};

  return (
    <div style={{
      background: `linear-gradient(165deg, ${C.surface} 0%, ${C.surface2} 100%)`,
      border: `1px solid ${C.border2}`,
      borderRadius: 18,
      padding: "20px 22px 16px",
      boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 24px ${C.violet}12`,
      fontFamily: FONT_BODY,
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <img
          src={currentUser?.avatarUrl || `https://placehold.co/38x38/1e1040/aaa?text=${(currentUser?.username || "?")[0].toUpperCase()}`}
          alt="avatar"
          style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover",
            border: `2px solid ${C.violetDim}`, flexShrink: 0 }}
        />
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text, fontFamily: FONT_DISPLAY }}>
            {currentUser?.displayName || currentUser?.username}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: C.muted }}>
            {hobbyId
              ? `posting in · ${hobbies.find(h => String(h.id) === hobbyId)?.name ?? "hobby"}`
              : "personal post"}
          </p>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        placeholder="What's on your mind?"
        rows={3}
        style={{
          width: "100%", boxSizing: "border-box",
          background: "transparent", border: "none", outline: "none", resize: "none",
          color: C.text, fontSize: 16, lineHeight: 1.7, fontFamily: FONT_BODY,
          caretColor: C.violetGlow, minHeight: 80, overflow: "hidden",
        }}
      />

      {/* Progress bar */}
      <div style={{ height: 2, borderRadius: 2, marginBottom: 14,
        background: C.border, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0, transformOrigin: "left",
          transform: `scaleX(${Math.min(content.length / MAX_CHARS, 1)})`,
          transition: "transform 0.15s ease, background 0.2s ease",
          background: progressColor, borderRadius: 2,
        }} />
      </div>

      {/* Media URL input */}
      {mediaType && (
        <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: C.muted, flexShrink: 0, textTransform: "uppercase", letterSpacing: 1 }}>
            {mediaType}
          </span>

					{/* Hidden file inputs */}
					<input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }}
						onChange={(e) => e.target.files[0] && uploadFile(e.target.files[0], "image")} />
					<input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }}
						onChange={(e) => e.target.files[0] && uploadFile(e.target.files[0], "video")} />

					{/* Media area */}
					{mediaType && (
						<div style={{ marginBottom: 12, borderRadius: 12, overflow: "hidden",
							border: `1px solid ${C.border2}`, background: C.surface2, position: "relative" }}>

							{uploading && (
								<div style={{ display: "flex", alignItems: "center", justifyContent: "center",
									gap: 10, padding: "24px 0", color: C.muted2, fontSize: 13 }}>
									<Loader2 size={18} color={C.violet} style={{ animation: "spin 1s linear infinite" }} />
									Uploading {mediaType}…
								</div>
							)}

							{!uploading && !mediaUrl && (
								<button
									onClick={() => mediaType === "image" ? imageInputRef.current?.click() : videoInputRef.current?.click()}
									style={{ width: "100%", padding: "28px", background: "none", border: "none",
										color: C.muted, cursor: "pointer", fontSize: 14, fontFamily: FONT_BODY,
										display: "flex", flexDirection: "column", alignItems: "center", gap: 8,}}>
									{mediaType === "image" ? <Image size={25} color={C.violetDim} /> : <Video size={26} color={C.violetDim} />}
									<span>Click to choose a {mediaType}</span>
								</button>
							)}

							{!uploading && mediaType === "image" && mediaUrl && (
								<img src={mediaUrl} alt="preview"
									style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block" }} />
							)}

							{!uploading && mediaType === "video" && mediaUrl && (
								<video src={mediaUrl} controls
									style={{ width: "100%", maxHeight: 260, display: "block" }} />
							)}

							{/* Clear button */}
							{!uploading && (
								<button onClick={clearMedia}
									style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)",
										border: "none", borderRadius: "50%", width: 28, height: 28,
										display: "flex", alignItems: "center", justifyContent: "center",
										cursor: "pointer", color: "#fff" }}>
									<X size={14} />
								</button>
							)}
						</div>
					)}

        </div>
      )}

      {/* Image preview */}
      {mediaType === "image" && mediaUrl && (
        <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 12,
          border: `1px solid ${C.border2}`, maxHeight: 240 }}>
          <img src={mediaUrl} alt="preview"
            style={{ width: "100%", objectFit: "cover", display: "block", maxHeight: 240 }} />
        </div>
      )}

      {/* Hobby selector */}
      <div style={{ marginBottom: 14 }}>
        <select
          value={hobbyId}
          onChange={(e) => setHobbyId(e.target.value)}
          style={{
            padding: "7px 14px", background: C.surface2,
            border: `1px solid ${C.border2}`, borderRadius: 20,
            color: hobbyId ? C.violetGlow : C.muted,
            fontSize: 13, fontFamily: FONT_BODY, cursor: "pointer", outline: "none",
          }}
        >
          <option value="">Personal</option>
          {hobbies.map((h) => (
            <option key={h.id} value={String(h.id)}>{h.name}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <p style={{ margin: "0 0 10px", fontSize: 13, color: C.maroonGlow,
          background: C.maroonFaint, border: `1px solid ${C.maroon}`,
          borderRadius: 8, padding: "8px 12px" }}>
          {error}
        </p>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: 12, borderTop: `1px solid ${C.border}` }}>

        {/* Toolbar */}
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { type: "image", icon: <Image size={17} />, title: "Add image URL" },
            { type: "video", icon: <Video size={17} />, title: "Add video URL" },
          ].map(({ type, icon, title }) => (
            <button key={type} onClick={() => toggleMedia(type)} title={title}
              style={{
                background: mediaType === type ? C.violetFaint : "none",
                border: mediaType === type ? `1px solid ${C.violetDim}` : "1px solid transparent",
                borderRadius: 8, padding: "6px 8px",
                color: mediaType === type ? C.violetGlow : C.muted2,
                cursor: "pointer", display: "flex", alignItems: "center",
                transition: "all 0.15s ease",
              }}>
              {icon}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontSize: 12, color: isOverLimit ? C.maroonGlow : charsLeft < 200 ? "#fbbf24" : C.muted,
            transition: "color 0.2s",
          }}>
            {charsLeft}
          </span>

          {onCancel && (
            <button onClick={onCancel} style={{
              padding: "8px 18px", borderRadius: 20,
              background: "transparent", border: `1px solid ${C.border2}`,
              color: C.muted2, cursor: "pointer", fontSize: 13, fontFamily: FONT_BODY,
            }}>
              Cancel
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={isEmpty || isOverLimit || saving || uploading}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "9px 22px", borderRadius: 20,
              background: isEmpty || isOverLimit ? C.violetFaint : C.violet,
              border: "none",
              color: isEmpty || isOverLimit ? C.muted : "#fff",
              cursor: isEmpty || isOverLimit || saving ? "not-allowed" : "pointer",
              fontSize: 14, fontWeight: 600, fontFamily: FONT_BODY,
              opacity: saving ? 0.7 : 1,
              transition: "background 0.2s ease",
            }}
          >
            {saving ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={15} />}
            {saving ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}