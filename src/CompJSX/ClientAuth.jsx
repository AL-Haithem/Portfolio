import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import '../CompCss/ClientAuth.css'
import logo from '../assets/imgs/logo.png'

export default function ClientAuth() {
  const [searchParams] = useSearchParams()
  const initialView = searchParams.get('view') || 'login'
  const [view, setView] = useState(initialView) // 'login' | 'register' | 'forgot'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', isError: false })
  const navigate = useNavigate()

  useEffect(() => {
    const v = searchParams.get('view')
    if (v === 'register' || v === 'login') {
      setView(v)
    }
  }, [searchParams])
  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  
  // Forgot Password specific states
  const [forgotCode, setForgotCode] = useState('')
  const [forgotPassword, setForgotPassword] = useState('')
  const [forgotConfirm, setForgotConfirm] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const showMsg = (text, isError = false) => {
    setMessage({ text, isError })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    showMsg('')
    // Simulate API Call for now
    setTimeout(() => {
      setLoading(false)
      showMsg('Login successful! Redirecting...', false)
      setTimeout(() => navigate('/'), 1000)
    }, 1500)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    showMsg('')
    // Simulate API Call for now
    setTimeout(() => {
      setLoading(false)
      showMsg('Account created successfully! Please login.', false)
      setTimeout(() => {
        setView('login')
        setName('')
        setPassword('')
      }, 1500)
    }, 1500)
  }

  const handleSendOtp = async () => {
    if (!email) return showMsg('Please enter your email first.', true)
    setLoading(true)
    showMsg('')
    // Simulate API Call for now
    setTimeout(() => {
      setLoading(false)
      setOtpSent(true)
      showMsg('OTP sent! Check your email.', false)
    }, 1500)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (forgotPassword !== forgotConfirm) {
      return showMsg('Passwords do not match.', true)
    }
    setLoading(true)
    showMsg('')
    // Simulate API Call for now
    setTimeout(() => {
      setLoading(false)
      showMsg('Password reset successfully! Please login.', false)
      setTimeout(() => {
        setView('login')
        setForgotCode('')
        setForgotPassword('')
        setForgotConfirm('')
        setPassword('')
        setOtpSent(false)
      }, 2000)
    }, 1500)
  }

  return (
    <div className="auth-page">
      <Link to="/" className="return-home">
        <i className="fa-solid fa-arrow-left"></i> Back to Store
      </Link>

      <div className="auth-container">
        <div className="auth-header">
          <img src={logo} alt="HNK Store" />
          <h2>{view === 'forgot' ? 'Reset Password' : 'HNK STORE'}</h2>
          <p>
            {view === 'login' && 'Welcome back, gamer!'}
            {view === 'register' && 'Join the ultimate gaming store.'}
            {view === 'forgot' && 'Securely reset your password.'}
          </p>
        </div>

        {view !== 'forgot' && (
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${view === 'login' ? 'active' : ''}`} 
              onClick={() => { setView('login'); showMsg('') }}
            >
              Sign In
            </button>
            <button 
              className={`auth-tab ${view === 'register' ? 'active' : ''}`} 
              onClick={() => { setView('register'); showMsg('') }}
            >
              Create Account
            </button>
          </div>
        )}

        <div className={`auth-message ${message.isError ? 'error' : 'success'}`}>
          {message.text}
        </div>

        {view === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="auth-field">
              <label htmlFor="login-email">Email Address</label>
              <input 
                type="email" 
                id="login-email" 
                placeholder="you@example.com"
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            
            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <input 
                type="password" 
                id="login-password" 
                placeholder="••••••••"
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
            
            <a className="auth-forgot-link" onClick={() => { setView('forgot'); showMsg('') }}>
              Forgot Password?
            </a>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Login Now'}
            </button>
          </form>
        )}

        {view === 'register' && (
          <form onSubmit={handleRegister}>
            <div className="auth-field">
              <label htmlFor="reg-name">Username</label>
              <input 
                type="text" 
                id="reg-name" 
                placeholder="GamerTag"
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
              />
            </div>

            <div className="auth-field">
              <label htmlFor="reg-email">Email Address</label>
              <input 
                type="email" 
                id="reg-email" 
                placeholder="you@example.com"
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            
            <div className="auth-field">
              <label htmlFor="reg-password">Password</label>
              <input 
                type="password" 
                id="reg-password" 
                placeholder="••••••••"
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Create Account'}
            </button>
          </form>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleResetPassword}>
            <button type="button" className="auth-back-btn" onClick={() => { setView('login'); showMsg('') }}>
              <i className="fa-solid fa-arrow-left"></i> Back to Login
            </button>

            <div className="auth-field">
              <label htmlFor="forgot-email">Email Address</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="email" 
                  id="forgot-email" 
                  required 
                  style={{ flex: 1 }} 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  disabled={otpSent} 
                />
                <button 
                  type="button" 
                  onClick={handleSendOtp} 
                  disabled={loading || otpSent}
                  style={{
                    padding: '0 15px', 
                    whiteSpace: 'nowrap', 
                    fontSize: '13px', 
                    border: '1px solid #4ade80', 
                    color: '#4ade80', 
                    background: 'rgba(74, 222, 128, 0.1)', 
                    borderRadius: '8px', 
                    cursor: (loading || otpSent) ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    opacity: otpSent ? 0.5 : 1
                  }}
                >
                  {loading && !otpSent ? 'Wait...' : 'Send OTP'}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="forgot-code">
                OTP Code 
                {!otpSent && <span style={{ fontSize: '11px', color: '#f87171', opacity: 0.8 }}>(Request OTP to unlock)</span>}
              </label>
              <input 
                type="text" 
                id="forgot-code" 
                required 
                disabled={!otpSent} 
                placeholder="6-digit code" 
                style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px dashed #555', 
                  cursor: otpSent ? 'text' : 'not-allowed', 
                  transition: 'all 0.3s' 
                }} 
                value={forgotCode} 
                onChange={e => setForgotCode(e.target.value)} 
              />
            </div>

            <div className="auth-field">
              <label htmlFor="forgot-password">New Password</label>
              <input 
                type="password" 
                id="forgot-password" 
                required 
                disabled={!otpSent} 
                value={forgotPassword} 
                onChange={e => setForgotPassword(e.target.value)} 
              />
            </div>

            <div className="auth-field">
              <label htmlFor="forgot-confirm">Confirm Password</label>
              <input 
                type="password" 
                id="forgot-confirm" 
                required 
                disabled={!otpSent} 
                value={forgotConfirm} 
                onChange={e => setForgotConfirm(e.target.value)} 
              />
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn" 
              style={{ opacity: otpSent ? 1 : 0.5, cursor: otpSent ? 'pointer' : 'not-allowed' }} 
              disabled={!otpSent || loading}
            >
              {loading && otpSent ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
