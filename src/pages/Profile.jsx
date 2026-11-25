import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import { Avatar } from '../components/Icons'
import { useApp } from '../context/AppContext'
import { DEMO_LOGIN, DEMO_DATA } from '../data/demoData'
import { DAYS } from '../utils/sleep'
import { fmtT, toMin } from '../utils/scheduler'

// Profile: shows the demo account info already in the app. Username is the demo login ID (read-only);
// name and email can be edited and are saved to localStorage with the rest of the app data.
export default function Profile() {
  const { data, update } = useApp()
  const nav = useNavigate()
  const u = data.user
  // Schedule = the availability saved by Create Routine (no separate hardcoded copy)
  const av = data.availability || DEMO_DATA.availability
  const sched = DAYS.map((d, i) => ({ d, off: av.off?.[i], items: [...(av.busy?.[i] || [])].sort((a, b) => toMin(a.start) - toMin(b.start)) }))
    .filter((x) => x.off || x.items.length)
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState(u.name)
  const [email, setEmail] = useState(u.email || '')
  const [msg, setMsg] = useState('')
  const [saved, setSaved] = useState(false)

  const start = () => { setName(u.name); setEmail(u.email || ''); setMsg(''); setSaved(false); setEdit(true) }
  const save = (e) => {
    e.preventDefault()
    if (!name.trim()) return setMsg('Please enter a name.')
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) return setMsg('Please enter a valid email address.')
    update({ user: { ...u, name: name.trim(), email: email.trim() } })
    setEdit(false); setSaved(true)
  }
  const logout = () => { update({ loggedIn: false }); nav('/') }

  return (
    <Screen back pill="Profile" noProfile>
      <div className="profile-top">
        <Avatar />
        <h2>{u.name}</h2>
        <p className="muted">@{DEMO_LOGIN.userId} • {u.level}</p>
      </div>
      <div className="stats card">
        <div><b>{data.goals.length}</b><small>Goals</small></div>
        <div><b>{u.streak} days</b><small>Streak</small></div>
        <div><b>{u.level}</b><small>Level</small></div>
      </div>

      {edit ? (
        <form className="card pform" onSubmit={save}>
          <label htmlFor="pname">Name</label>
          <input id="pname" name="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          <label htmlFor="pemail">Email</label>
          <input id="pemail" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false}
            placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          {msg && <p className="msg">{msg}</p>}
          <div className="two-btns">
            <button type="button" className="btn outline" onClick={() => setEdit(false)}>Cancel</button>
            <button type="submit" className="btn primary">Save</button>
          </div>
        </form>
      ) : (
        <div className="card">
          <div className="prow"><span>Username</span><b>{DEMO_LOGIN.userId}</b></div>
          <div className="prow"><span>Name</span><b>{u.name}</b></div>
          <div className="prow"><span>Email</span><b>{u.email || 'Not added yet'}</b></div>
          {saved && <p className="toast">Profile updated!</p>}
          <button className="btn small" onClick={start}>Edit Profile</button>
        </div>
      )}

      <div className="card">
        <h3>My Goals</h3>
        <ul className="items">{data.goals.map((g) => <li key={g}>{g}</li>)}</ul>
      </div>
      <div className="card">
        <h3>My Schedule</h3>
        {sched.length === 0 && <p className="muted">No schedule entered yet. Add your classes and work in Create Routine.</p>}
        {sched.map((x) => (
          <div className="srow" key={x.d}>
            <b>{x.d}</b>
            <span>{x.off ? 'Unavailable all day' : x.items.map((b) => <span key={b.id}>{b.label} {fmtT(toMin(b.start))}–{fmtT(toMin(b.end))}</span>)}</span>
          </div>
        ))}
        <button className="link" onClick={() => nav('/fitness/create')}>Edit in Create Routine</button>
      </div>
      <button className="btn outline" onClick={logout}>Log Out</button>
    </Screen>
  )
}
