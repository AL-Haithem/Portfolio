import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router'
import '../CompCss/AdminLogin.css'
import { API_BASE } from '../api.js'
import { csrfStore } from '../csrfStore.js'

const LOGIN_URL = `${API_BASE}/api/vv/adm/login`

// ─── Validation helpers (mirrors Joi schema from backend AuthValidator.js) ───
function validateEmail(val) {
  if (!val.trim())                               return 'Email cannot be empty'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address'
  return ''
}

function validatePassword(val) {
  if (!val.trim())       return 'Password cannot be empty'
  if (val.length < 6)   return 'Password must be at least 6 characters'
  if (val.length > 16)  return 'Password cannot exceed 16 characters'
  return ''
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [errors, setErrors]   = useState({ email: '', password: '' })
  const [globalErr, setGlobalErr]   = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading]       = useState(false)
  const [showPw, setShowPw]         = useState(false)

  // ── On mount: check if already logged in ────────────────────────────────
  useEffect(() => {
    fetch(LOGIN_URL, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // empty body to trigger GuestOnly middleware
    })
      .then(res => res.json().then(data => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 401 && data?.message === 'ALREADY_LOGGED_IN') {
          navigate('/admin/dashboard', { replace: true })
        }
      })
      .catch(() => {})
  }, [navigate])

  // ── Field change ──────────────────────────────────────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear per-field error on type
    setErrors(prev => ({ ...prev, [name]: '' }))
    setGlobalErr('')
    setSuccessMsg('')
  }, [])

  // ── Client-side validation ────────────────────────────────────────────────
  const validate = useCallback(() => {
    const emailErr    = validateEmail(form.email)
    const passwordErr = validatePassword(form.password)
    setErrors({ email: emailErr, password: passwordErr })
    return !emailErr && !passwordErr
  }, [form])

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setGlobalErr('')
    setSuccessMsg('')

    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch(LOGIN_URL, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',          // send & receive cookies (JWT)
        body:        JSON.stringify({
          email:    form.email.trim().toLowerCase(),
          password: form.password.trim(),
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        // ── Save CSRF token in memory (never in localStorage) ──
        if (data?.csrfToken) {
          csrfStore.set(data.csrfToken)
        }
        setSuccessMsg('Login successful — redirecting...')
        // Short delay so the user sees the success message
        setTimeout(() => navigate('/admin/dashboard', { replace: true }), 600)
      } else if (res.status === 429) {
        setGlobalErr('Too many attempts. Please wait a moment and try again.')
      } else if (res.status === 401 || res.status === 403) {
        setGlobalErr('Invalid email or password.')
      } else {
        setGlobalErr(data?.message ?? 'An unexpected error occurred. Please try again.')
      }
    } catch {
      setGlobalErr('Unable to reach the server. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }, [form, validate])

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="admin-login-page">

      {/* Animated background */}
      <div className="adm-bg-glow" aria-hidden="true" />
      <div className="adm-grid-overlay" aria-hidden="true" />

      {/* Floating particles */}
      {[1,2,3,4,5].map(n => (
        <span key={n} className="adm-particle" aria-hidden="true" />
      ))}

      {/* ── Login Card ── */}
      <main className="adm-login-card" role="main">

        {/* Header */}
        <header className="adm-card-header">
          <div className="adm-logo-wrap" aria-hidden="true">
            <i className="fas fa-shield-halved" />
          </div>
          <h1>لوحة التحكم</h1>
          <p className="adm-subtitle">
            <span className="adm-subtitle-dot" />
            Admin Panel — Restricted Access
          </p>
        </header>

        <div className="adm-divider" aria-hidden="true" />

        {/* Form */}
        <form
          id="adminLoginForm"
          className="adm-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Admin login form"
        >
          {/* Global feedback */}
          {globalErr && (
            <div className="adm-global-error" role="alert" aria-live="assertive">
              <i className="fas fa-circle-exclamation" aria-hidden="true" />
              {globalErr}
            </div>
          )}
          {successMsg && (
            <div className="adm-success-toast" role="status" aria-live="polite">
              <i className="fas fa-circle-check" aria-hidden="true" />
              {successMsg}
            </div>
          )}

          {/* Email */}
          <div className="adm-field">
            <label htmlFor="adm-email">
              <i className="fas fa-envelope" aria-hidden="true" />
              البريد الإلكتروني
            </label>
            <div className="adm-input-wrap">
              <input
                id="adm-email"
                name="email"
                type="email"
                className={`adm-input${errors.email ? ' has-error' : ''}`}
                placeholder="admin@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
                aria-describedby={errors.email ? 'adm-email-err' : undefined}
                aria-invalid={!!errors.email}
                disabled={loading}
              />
              <span className="adm-input-icon" aria-hidden="true">
                <i className="fas fa-at" />
              </span>
            </div>
            <span
              id="adm-email-err"
              className="adm-field-error"
              role="alert"
              aria-live="polite"
            >
              {errors.email && (
                <><i className="fas fa-triangle-exclamation" aria-hidden="true" />{errors.email}</>
              )}
            </span>
          </div>

          {/* Password */}
          <div className="adm-field">
            <label htmlFor="adm-password">
              <i className="fas fa-lock" aria-hidden="true" />
              كلمة المرور
            </label>
            <div className="adm-input-wrap has-toggle">
              <input
                id="adm-password"
                name="password"
                type={showPw ? 'text' : 'password'}
                className={`adm-input${errors.password ? ' has-error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                aria-describedby={errors.password ? 'adm-pw-err' : undefined}
                aria-invalid={!!errors.password}
                disabled={loading}
              />
              <button
                type="button"
                id="adm-pw-toggle"
                className="adm-pw-toggle"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                tabIndex={0}
                disabled={loading}
              >
                <i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
              </button>
            </div>
            <span
              id="adm-pw-err"
              className="adm-field-error"
              role="alert"
              aria-live="polite"
            >
              {errors.password && (
                <><i className="fas fa-triangle-exclamation" aria-hidden="true" />{errors.password}</>
              )}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="adm-submit-btn"
            className="adm-submit-btn"
            disabled={loading}
            aria-busy={loading}
          >
            {loading
              ? <><span className="adm-spinner" aria-hidden="true" /> جارٍ التحقق...</>
              : <><i className="fas fa-right-to-bracket" aria-hidden="true" /> دخول</>
            }
          </button>

          <p className="adm-rate-notice" aria-label="Rate limit notice">
            <i className="fas fa-shield" aria-hidden="true" />
            Attempts are limited · Fully monitored
          </p>
        </form>

        {/* Footer */}
        <footer className="adm-card-footer">
          <span className="adm-shield-badge">
            <i className="fas fa-lock" aria-hidden="true" />
            Secured Connection
          </span>
        </footer>
      </main>
    </div>
  )
}
