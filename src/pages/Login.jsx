import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import { useApp } from '../context/AppContext'
import { DEMO_LOGIN } from '../data/demoData'

// FirstPage. The UserIDKey / PassKey frames are the phone keyboard appearing
// when a field is tapped, so they need no separate screens.
export default function Login() {
  const nav = useNavigate()
  const { update } = useApp()
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState('')

  const login = (e) => {
    e.preventDefault()
    if (id.trim().toLowerCase() === DEMO_LOGIN.userId && pw === DEMO_LOGIN.password) {
      update({ loggedIn: true })
      nav('/home')
    } else setMsg('Try the demo login: taylor / fitminds123')
  }
  const demoOnly = () => setMsg('Demo only, no accounts needed. Use taylor / fitminds123')

  return (
    <Screen noProfile>
      <form onSubmit={login} className="login">
        <label htmlFor="userId">User ID</label>
        {/* Plain text keyboard; no auto-capitalize/auto-correct so the ID isn't altered */}
        <input id="userId" name="username" type="text" inputMode="text" value={id} onChange={(e) => setId(e.target.value)}
          autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="next" />
        <label htmlFor="password">Password</label>
        {/* type="password" hides the text; "Go" on the keyboard submits the form */}
        <input id="password" name="password" type="password" value={pw} onChange={(e) => setPw(e.target.value)}
          autoComplete="current-password" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="go" />
        <button className="btn small" type="submit">Login In</button>
        {msg && <p className="msg">{msg}</p>}
      </form>
      <div className="login-links">
        <button className="link" onClick={demoOnly}>Sign Up</button>
        <button className="link" onClick={demoOnly}>Forgot Login</button>
      </div>
    </Screen>
  )
}
