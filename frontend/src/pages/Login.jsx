
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

// ── Google Fonts ─────────────────────────────────────────────────────────────
if (typeof document !== 'undefined') {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:wght@300;400;500;700&display=swap'
  document.head.appendChild(link)
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/api/auth/login', form)
      const { token, username, email, displayName } = response.data
      login({ username, email, displayName }, token)
      navigate(`/profile/${username}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      {/* Background texture blobs */}
      <div style={s.blob1} />
      <div style={s.blob2} />

      <div style={s.container}>
        {/* App name */}
        <div style={s.brandWrap}>
          <h1 style={s.brand}>ketty</h1>
          <p style={s.brandSub}>your personal canvas</p>
        </div>

        {/* Card */}
        <div style={s.card}>
          <p style={s.cardTitle}>Welcome back</p>

          {error && (
            <div style={s.errorBox}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.fieldWrap}>
              <label style={s.label}>Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                placeholder="your name"
                autoComplete="username"
                style={{
                  ...s.input,
                  ...(focusedField === 'username' ? s.inputFocused : {}),
                }}
              />
            </div>

            <div style={s.fieldWrap}>
              <label style={s.label}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  ...s.input,
                  ...(focusedField === 'password' ? s.inputFocused : {}),
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...s.submitBtn, ...(loading ? s.submitBtnDisabled : {}) }}
            >
              {loading ? (
                <span style={s.btnInner}>
                  <span style={s.spinner} /> Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div style={s.divider}>
            <span style={s.dividerLine} />
            <span style={s.dividerText}>or</span>
            <span style={s.dividerLine} />
          </div>

          <p style={s.switchText}>
            Don't have an account?{' '}
            <Link to="/register" style={s.switchLink}>Create one</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: '100vh',
    background: '#080608',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    fontFamily: "'Roboto', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },

  // Ambient background blobs
  blob1: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(80,0,60,0.35) 0%, transparent 70%)',
    top: -160,
    left: -160,
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(60,0,80,0.3) 0%, transparent 70%)',
    bottom: -120,
    right: -100,
    pointerEvents: 'none',
  },

  container: {
    width: '100%',
    maxWidth: 420,
    animation: 'fadeUp 0.5s ease both',
    position: 'relative',
    zIndex: 1,
  },

  // Brand
  brandWrap: { textAlign: 'center', marginBottom: 32 },
  brand: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 52,
    fontWeight: 800,
    fontStyle: 'italic',
    margin: 0,
    background: 'linear-gradient(135deg, #e8d5f5 0%, #c084fc 40%, #a855f7 70%, #7c3aed 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-1px',
    lineHeight: 1.5,
  },
  brandSub: {
    margin: '8px 0 0',
    color: '#6b5a7a',
    fontSize: 13,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: 300,
  },

  // Card
  card: {
    background: 'linear-gradient(160deg, #110d15 0%, #0e0a12 100%)',
    border: '1px solid #2a1a35',
    borderRadius: 20,
    padding: '36px 32px 32px',
    boxShadow: '0 0 60px rgba(120,0,120,0.12), 0 20px 60px rgba(0,0,0,0.6)',
  },
  cardTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 22,
    fontWeight: 600,
    color: '#e8e0f0',
    margin: '0 0 24px',
  },

  // Error
  errorBox: {
    background: 'rgba(180,0,60,0.1)',
    border: '1px solid rgba(180,0,60,0.3)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f08090',
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 1.5,
  },

  // Form
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: '#9a8aaa',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    background: '#170f1f',
    border: '1px solid #2e1e40',
    borderRadius: 10,
    padding: '12px 16px',
    color: '#e8e0f0',
    fontSize: 15,
    fontFamily: "'Roboto', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputFocused: {
    borderColor: '#7c3aed',
    boxShadow: '0 0 0 3px rgba(124,58,237,0.15)',
  },

  // Button
  submitBtn: {
    width: '100%',
    padding: '13px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #6d28d9, #7c3aed, #9333ea)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
    transition: 'opacity 0.2s, transform 0.15s',
    boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
    letterSpacing: 0.3,
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  btnInner: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  spinner: {
    display: 'inline-block',
    width: 14,
    height: 14,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },

  // Divider
  divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 16px' },
  dividerLine: { flex: 1, height: 1, background: '#2a1a35' },
  dividerText: { color: '#4a3a5a', fontSize: 12 },

  // Switch
  switchText: { textAlign: 'center', color: '#6b5a7a', fontSize: 14, margin: 0 },
  switchLink: { color: '#a78bfa', textDecoration: 'none', fontWeight: 500 },
}
