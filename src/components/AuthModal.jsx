import { useState, useRef, useEffect } from 'react'

export default function AuthModal({ open, onClose }) {
  const [tab, setTab] = useState('login') // login, register, forgot
  const [message, setMessage] = useState('')
  const [msgError, setMsgError] = useState(false)
  const [logs, setLogs] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  
  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotCode, setForgotCode] = useState('')
  const [forgotPassword, setForgotPassword] = useState('')
  const [forgotConfirm, setForgotConfirm] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [savedCsrf, setSavedCsrf] = useState(null)
  const logsEndRef = useRef(null)

  useEffect(() => {
    if (open && !currentUser) {
      fetch('https://api.alhaithem.site/api/auth/check', { credentials: 'include' })
        .then(res => {
          if (res.ok) setCurrentUser({ email: 'User', name: 'User' })
        })
        .catch(() => {})
    }
  }, [open])

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  if (!open) return null

  const showMsg = (msg, isErr = false) => {
    setMessage(msg)
    setMsgError(isErr)
  }

  const clearSim = () => setLogs([])
  const addEntry = (badge, bType, text, tClass, delay = 0) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setLogs(prev => [...prev, { id: Date.now() + Math.random(), badge, bType, text, tClass }])
        resolve()
      }, delay)
    })
  }
  const addDivider = (delay = 0) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setLogs(prev => [...prev, { id: Date.now() + Math.random(), isDivider: true }])
        resolve()
      }, delay)
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    clearSim()
    await addEntry('REQ','mw','→ POST /api/auth/register','text', 0)
    setLoading(true)
    
    try {
      const res = await fetch('https://api.alhaithem.site/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password }),
        credentials: 'include'
      })
      const data = await res.json().catch(() => ({}))
      
      // Simulate Pipeline
      await addEntry('RL','rl','RateLimit — Register (IP)','text', 50)
      if (res.status === 429) {
        await addEntry('RL','err','✗ Max requests reached — 429 Too Many Requests','fail', 100)
        setLoading(false)
        return showMsg('Too many requests', true)
      }
      await addEntry('RL','rl','✓ Allowed','ok', 100)
      await addDivider(50)
      await addEntry('JOI','joi','RegisterSchema (username, email, password)','text', 50)
      
      if (res.status === 400 && data.message?.includes('username')) {
        await addEntry('JOI','joi','username — ✗ ' + data.message, 'fail', 100)
        setLoading(false)
        return showMsg(data.message, true)
      }
      if (res.status === 400 && data.message?.includes('email')) {
        await addEntry('JOI','joi','email — ✗ invalid', 'fail', 100)
        setLoading(false)
        return showMsg('Invalid email', true)
      }
      
      if (res.ok) {
        await addEntry('JOI','joi','✓ Validated','ok', 100)
        await addDivider(50)
        await addEntry('CON','db','RegisterController — Duplicate check','text', 100)
        await addEntry('CON','db','bcrypt.hash(password)','text', 100)
        await addEntry('CON','db','✓ Saved to MongoDB','ok', 100)
        await addDivider(50)
        await addEntry('JWT','jwt','jwt.sign(...)','text', 100)
        await addEntry('CK','mw','set-cookie("access_token")','text', 50)
        await addEntry('OK','ok','200 OK — Registered successfully!','ok', 50)
        
        if (data.csrfToken) setSavedCsrf(data.csrfToken)

        showMsg('Registration successful! Please login.')
        setTimeout(() => {
          setTab('login')
          setName(''); setEmail(''); setPassword('')
        }, 1500)
      } else if (data.message === 'ALREADY_LOGGED_IN') {
        await addEntry('OK','ok','Already logged in!','ok', 100)
        setCurrentUser({ email: email || 'User', name: (email || 'User').split('@')[0] })
        showMsg('You are already logged in!')
      } else {
        await addEntry('CON','db',`o- ${data.message || 'Error'}`, 'fail', 100)
        showMsg(data.message || 'Registration failed', true)
      }
    } catch(err) {
      console.error(err)
      await addEntry('ERR','err','Network error','fail', 0)
      showMsg('Network error', true)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    clearSim()
    await addEntry('REQ','mw','→ POST /api/auth/login','text', 0)
    setLoading(true)

    try {
      const res = await fetch('https://api.alhaithem.site/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })
      const data = await res.json().catch(() => ({}))

      await addEntry('RL','rl','RateLimit — Login (IP)','text', 50)
      if (res.status === 429) {
        await addEntry('RL','err','✗ Max requests reached','fail', 100)
        setLoading(false)
        return showMsg('Too many requests', true)
      }
      await addEntry('RL','rl','✓ Allowed','ok', 100)
      await addDivider(50)

      if (res.ok) {
        await addEntry('JOI','joi','LoginSchema — ✓ Validated','ok', 100)
        await addDivider(50)
        await addEntry('CON','db','LoginController — findOne({ email })','text', 100)
        await addEntry('CON','db','bcrypt.compare()','text', 100)
        await addEntry('CON','db','✓ Passwords match','ok', 100)
        await addDivider(50)
        await addEntry('JWT','jwt','jwt.sign(...)','text', 100)
        await addEntry('CK','mw','set-cookie("access_token")','text', 50)
        await addEntry('OK','ok','200 OK — Logged in!','ok', 50)
        
        if (data.csrfToken) setSavedCsrf(data.csrfToken)

        setCurrentUser({ email, name: email.split('@')[0] })
        showMsg('Login successful!')
        setEmail(''); setPassword('')
      } else if (data.message === 'ALREADY_LOGGED_IN') {
        await addEntry('OK','ok','Already logged in!','ok', 100)
        setCurrentUser({ email: email || 'User', name: (email || 'User').split('@')[0] })
        showMsg('You are already logged in!')
      } else {
        await addEntry('CON','err',`o- ${data.message || 'Login failed'}`, 'fail', 100)
        showMsg(data.message || 'Login failed', true)
      }
    } catch(err) {
      console.error(err)
      await addEntry('ERR','err','Network error','fail', 0)
      showMsg('Network error', true)
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!forgotEmail) return showMsg('Please enter email', true)
    clearSim()
    await addEntry('REQ','mw','→ POST /api/auth/forgot-password','text', 0)
    setLoading(true)

    try {
      const res = await fetch('https://api.alhaithem.site/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
        credentials: 'include'
      })
      const data = await res.json().catch(() => ({}))
      
      if (res.ok) {
        await addEntry('JOI','joi','✓ Valid email','ok', 100)
        await addEntry('CON','db','generate OTP & save hash','text', 100)
        await addEntry('MAIL','mw','sendEmail()','text', 100)
        await addEntry('CK','mw','set-cookie("reset_request_id")','text', 50)
        await addEntry('OK','ok','200 OK — OTP sent','ok', 50)
        setOtpSent(true)
        showMsg('OTP sent! Check your email.', false)
      } else {
        await addEntry('ERR','err', data.message || 'Error', 'fail', 100)
        showMsg(data.message || 'Failed to send OTP', true)
      }
    } catch (err) {
      console.error(err)
      await addEntry('ERR','err','Network error','fail', 0)
      showMsg('Network error', true)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPass = async (e) => {
    e.preventDefault()
    clearSim()
    await addEntry('REQ','mw','→ POST /api/auth/confirm-forgot-password','text', 0)
    setLoading(true)

    try {
      const res = await fetch('https://api.alhaithem.site/api/auth/confirm-forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, code: forgotCode, newPassword: forgotPassword, confirmNewPassword: forgotConfirm }),
        credentials: 'include'
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        await addEntry('CK','mw','✓ reset_request_id cookie valid','ok', 100)
        await addEntry('CON','db','✓ User found & OTP valid','ok', 100)
        await addEntry('CON','db','bcrypt.hash(newPassword)','text', 100)
        await addEntry('CON','db','TokenVersion++ (invalidates old JWTs)','text', 100)
        await addEntry('OK','ok','200 OK — Password changed','ok', 50)
        
        showMsg('Password reset successfully! Please login.', false)
        setTimeout(() => {
          setTab('login')
          setForgotEmail(''); setForgotCode(''); setForgotPassword(''); setForgotConfirm(''); setOtpSent(false)
        }, 2000)
      } else {
        await addEntry('ERR','err', data.message || 'Reset failed', 'fail', 100)
        showMsg(data.message || 'Reset failed', true)
      }
    } catch (err) {
      console.error(err)
      await addEntry('ERR','err','Network error','fail', 0)
      showMsg('Network error', true)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    clearSim()
    
    try {
      let csrfToken = savedCsrf
      let csrfMessage = null
      let csrfStatus = 200

      if (!csrfToken) {
        await addEntry('REQ','req','GET /api/auth/csrf','text', 100)
        const csrfRes = await fetch('https://api.alhaithem.site/api/auth/csrf', {
          method: 'GET',
          credentials: 'include'
        })
        
        let csrfData = {}
        try { csrfData = await csrfRes.json() } catch(e){}
        csrfMessage = csrfData.message
        csrfStatus = csrfRes.status
        
        if (csrfRes.ok && csrfData.csrfToken) {
          csrfToken = csrfData.csrfToken
          setSavedCsrf(csrfToken)
          await addEntry('RES','res','200 OK (CSRF Received)','text', 50)
        }
      } else {
        await addEntry('CK','mw','Using cached CSRF token','text', 50)
      }
      
      if (csrfToken) {
        await addEntry('REQ','req','POST /api/auth/logout','text', 100)
        
        const logoutRes = await fetch('https://api.alhaithem.site/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
          }
        })
        
        let logoutData = {}
        try { logoutData = await logoutRes.json() } catch(e){}
        
        if (logoutRes.ok) {
          await addEntry('RES','res', `200 OK (${logoutData.message || 'Logged out'})`,'ok', 50)
          setCurrentUser(null)
          setSavedCsrf(null)
          showMsg('Logged out successfully.')
        } else if (logoutData.message === 'ALREADY_LOGGED_OUT') {
          await addEntry('RES','res', '200 OK (Already logged out)','ok', 50)
          setCurrentUser(null)
          setSavedCsrf(null)
          showMsg('You are already logged out.')
        } else {
          await addEntry('ERR','err',`Logout failed: ${logoutData.message || logoutRes.status}`,'fail', 50)
          showMsg(logoutData.message || 'Logout failed', true)
        }
      } else if (csrfMessage === 'ALREADY_LOGGED_OUT') {
        await addEntry('RES','res', '200 OK (Already logged out)','ok', 50)
        setCurrentUser(null)
        setSavedCsrf(null)
        showMsg('You are already logged out.')
      } else {
        await addEntry('ERR','err',`CSRF failed: ${csrfMessage || csrfStatus}`,'fail', 50)
        showMsg(csrfMessage || 'Not authorized (No valid session to logout)', true)
      }
    } catch (err) {
      console.error(err)
      await addEntry('ERR','err','Network error','fail', 0)
      showMsg('Network error', true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="auth-modal" className="auth-modal">
      <div className="auth-modal-content">
        <button id="auth-modal-close" className="auth-modal-close" onClick={onClose}>&times;</button>
        <div className="auth-layout">
          <div className="auth-left">
            <div className="auth-tabs">
              <button id="tab-login" className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => {setTab('login'); showMsg(''); clearSim()}}>Login</button>
              <button id="tab-register" className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => {setTab('register'); showMsg(''); clearSim()}}>Register</button>
              <button id="tab-forgot" className={`auth-tab ${tab === 'forgot' ? 'active' : ''}`} onClick={() => {setTab('forgot'); showMsg(''); clearSim()}}>Reset Password</button>
            </div>
            <div id="auth-message" style={{ color: msgError ? '#f87171' : '#4ade80', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{message}</div>
            
            {!currentUser && tab === 'login' && (
              <form id="login-form" onSubmit={handleLogin}>
                <div className="auth-field">
                  <label htmlFor="login-email">Email</label>
                  <input type="email" id="login-email" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="auth-field">
                  <label htmlFor="login-password">Password</label>
                  <input type="password" id="login-password" required value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>Login</button>
              </form>
            )}

            {!currentUser && tab === 'register' && (
              <form id="register-form" onSubmit={handleRegister}>
                <div className="auth-field">
                  <label htmlFor="reg-name">Name</label>
                  <input type="text" id="reg-name" required value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="auth-field">
                  <label htmlFor="reg-email">Email</label>
                  <input type="email" id="reg-email" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="auth-field">
                  <label htmlFor="reg-password">Password</label>
                  <input type="password" id="reg-password" required value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>Register</button>
              </form>
            )}

            {!currentUser && tab === 'forgot' && (
              <form id="forgot-form" onSubmit={handleResetPass}>
                <div className="auth-field">
                  <label htmlFor="forgot-email">Email</label>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <input type="email" id="forgot-email" required style={{flex: 1}} value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} disabled={otpSent} />
                    <button type="button" id="send-otp-btn" className="btn btn-outline" style={{padding: '10px 15px', whiteSpace: 'nowrap', fontSize: '13px', border: '1px solid #4ade80', color: '#4ade80', background: 'transparent', borderRadius: '6px', cursor: 'pointer'}} onClick={handleSendOtp} disabled={loading || otpSent}>
                      Send OTP
                    </button>
                  </div>
                </div>
                <div className="auth-field">
                  <label htmlFor="forgot-password">New Password</label>
                  <input type="password" id="forgot-password" required disabled={!otpSent} value={forgotPassword} onChange={e => setForgotPassword(e.target.value)} />
                </div>
                <div className="auth-field">
                  <label htmlFor="forgot-confirm">Confirm Password</label>
                  <input type="password" id="forgot-confirm" required disabled={!otpSent} value={forgotConfirm} onChange={e => setForgotConfirm(e.target.value)} />
                </div>
                <div className="auth-field">
                  <label htmlFor="forgot-code" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    OTP Code <span style={{fontSize: '11px', color: '#f87171', opacity: 0.8}}>(Request OTP to unlock)</span>
                  </label>
                  <input type="text" id="forgot-code" required disabled={!otpSent} placeholder="6-digit code" style={{background: 'rgba(255,255,255,0.02)', border: '1px dashed #555', cursor: otpSent ? 'text' : 'not-allowed', transition: 'all 0.3s'}} value={forgotCode} onChange={e => setForgotCode(e.target.value)} />
                </div>
                <button type="submit" id="reset-pwd-btn" className="btn btn-primary" style={{width: '100%', opacity: otpSent ? 1 : 0.5, cursor: otpSent ? 'pointer' : 'not-allowed'}} disabled={!otpSent || loading}>Reset Password</button>
              </form>
            )}

            {currentUser && (
              <div id="dashboard-view" style={{textAlign: 'center', marginTop: '20px'}}>
                <p style={{fontSize: '2.5rem', marginBottom: '10px'}}>&#10003;</p>
                <h4 style={{color: 'var(--green, #4ade80)', marginBottom: '8px'}}>Welcome, <span id="user-name-display">{currentUser.name}</span>!</h4>
                <p style={{fontSize: '13px', marginBottom: '20px', opacity: 0.6}}>Authenticated</p>
              </div>
            )}

            <div className="permanent-logout-container" style={{marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
              <button id="server-logout-btn" className="btn-logout-special" onClick={handleLogout} disabled={loading}>
                <span className="logout-icon">⏻</span> Force Server Logout
              </button>
            </div>
          </div>
          
          <div className="auth-right">
            <div className="sim-header">
              <span className="sim-dot red"></span>
              <span className="sim-dot yellow"></span>
              <span className="sim-dot green"></span>
              <span className="sim-title">server &mdash; request pipeline</span>
            </div>
            <div id="sim-log" className="sim-log">
              {logs.length === 0 ? (
                <p className="sim-idle">Submit a request to watch the backend pipeline...</p>
              ) : (
                logs.map(log => log.isDivider ? (
                  <hr key={log.id} className="sim-divider" />
                ) : (
                  <div key={log.id} className="sim-entry">
                    <span className={`sim-badge ${log.bType}`}>{log.badge}</span>
                    <span className={`sim-${log.tClass}`}>{log.text}</span>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
