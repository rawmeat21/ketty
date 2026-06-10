import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
  })
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
      const response = await api.post('/api/auth/register', form)
      const { token, username, email, displayName } = response.data
      login({ username, email, displayName }, token)
      navigate(`/profile/${username}`)
    } catch (err) {
      const data = err.response?.data
      if (typeof data === 'object' && data !== null) {
        setError(Object.values(data).join(', '))
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'displayName', label: 'Display Name',  type: 'text',     placeholder: 'Your Name'       },
    { name: 'username',    label: 'Username',       type: 'text',     placeholder: 'yourname'        },
    { name: 'email',       label: 'Email',          type: 'email',    placeholder: 'you@example.com' },
    { name: 'password',    label: 'Password',       type: 'password', placeholder: '••••••••'        },
  ]

  return (
    <div style={s.page}>
      <div style={s.blob1} />
      <div style={s.blob2} />
      <div style={s.blob3} />

      <div style={s.container}>
        {/* Brand */}
        <div style={s.brandWrap}>
          <h1 style={s.brand}>ketty</h1>
          <p style={s.brandSub}>your personal canvas</p>
        </div>

        {/* Card */}
        <div style={s.card}>
          <p style={s.cardTitle}>Create your account</p>
          <p style={s.cardSub}>Join and start building your profile.</p>

          {error && <div style={s.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={s.form}>
            {/* Display name + username side by side on wider screens, stacked on mobile */}
            <div style={s.twoCol}>
              {fields.slice(0, 2).map(f => (
                <div key={f.name} style={s.fieldWrap}>
                  <label style={s.label}>{f.label}</label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(f.name)}
                    onBlur={() => setFocusedField(null)}
                    placeholder={f.placeholder}
                    autoComplete={f.name}
                    style={{
                      ...s.input,
                      ...(focusedField === f.name ? s.inputFocused : {}),
                    }}
                  />
                </div>
              ))}
            </div>

            {fields.slice(2).map(f => (
              <div key={f.name} style={s.fieldWrap}>
                <label style={s.label}>{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(f.name)}
                  onBlur={() => setFocusedField(null)}
                  placeholder={f.placeholder}
                  autoComplete={f.name}
                  style={{
                    ...s.input,
                    ...(focusedField === f.name ? s.inputFocused : {}),
                  }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{ ...s.submitBtn, ...(loading ? s.submitBtnDisabled : {}) }}
            >
              {loading ? (
                <span style={s.btnInner}>
                  <span style={s.spinner} /> Creating account…
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div style={s.divider}>
            <span style={s.dividerLine} />
            <span style={s.dividerText}>or</span>
            <span style={s.dividerLine} />
          </div>

          <p style={s.switchText}>
            Already have an account?{' '}
            <Link to="/login" style={s.switchLink}>Sign in</Link>
          </p>
        </div>

        <p style={s.termsText}>
          By creating an account you agree to our{' '}
          <span style={s.termsLink}>Terms of Service</span> and{' '}
          <span style={s.termsLink}>Privacy Policy</span>.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:wght@300;400;500;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: #4a3a5a; }
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
    padding: '32px 16px',
    fontFamily: "'Roboto', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },

  blob1: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(80,0,60,0.32) 0%, transparent 70%)',
    top: -180,
    left: -180,
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(60,0,90,0.28) 0%, transparent 70%)',
    bottom: -100,
    right: -80,
    pointerEvents: 'none',
  },
  blob3: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(100,0,40,0.18) 0%, transparent 70%)',
    bottom: 60,
    left: '30%',
    pointerEvents: 'none',
  },

  container: {
    width: '100%',
    maxWidth: 460,
    animation: 'fadeUp 0.5s ease both',
    position: 'relative',
    zIndex: 1,
  },

  brandWrap: { textAlign: 'center', marginBottom: 28 },
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
    lineHeight: 1,
  },
  brandSub: {
    margin: '8px 0 0',
    color: '#6b5a7a',
    fontSize: 13,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: 300,
  },

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
    margin: '0 0 4px',
  },
  cardSub: {
    fontSize: 13,
    color: '#6b5a7a',
    margin: '0 0 24px',
  },

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

  form: { display: 'flex', flexDirection: 'column', gap: 16 },

  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },

  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    fontSize: 11,
    fontWeight: 500,
    color: '#9a8aaa',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  input: {
    background: '#170f1f',
    border: '1px solid #2e1e40',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#e8e0f0',
    fontSize: 14,
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
    marginTop: 6,
    boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
    letterSpacing: 0.3,
  },
  submitBtnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
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

  divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 16px' },
  dividerLine: { flex: 1, height: 1, background: '#2a1a35' },
  dividerText: { color: '#4a3a5a', fontSize: 12 },

  switchText: { textAlign: 'center', color: '#6b5a7a', fontSize: 14, margin: 0 },
  switchLink: { color: '#a78bfa', textDecoration: 'none', fontWeight: 500 },

  termsText: {
    textAlign: 'center',
    color: '#4a3a5a',
    fontSize: 11,
    marginTop: 16,
    lineHeight: 1.6,
  },
  termsLink: { color: '#6b5a7a', cursor: 'pointer' },
}
