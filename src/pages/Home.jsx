import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import { HomeIcon } from '../components/Icons'
import { useApp, getProgress } from '../context/AppContext'

// HomePage: the three mid-fi buttons plus the hi-fi progress card and weekly bars.
export default function Home() {
  const nav = useNavigate()
  const { data, update, reset } = useApp()
  const { tasks, pct } = getProgress(data)
  const connected = data.sleepConnection === 'granted' // sleep stats only after connecting
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <Screen>
      <h1 className="hello">Hello, {data.user.name.split(' ')[0]}!</h1>
      <p className="muted">{pct === 100 ? "You're all done today!" : "You're on track!"}</p>

      <div className="card progress">
        <div className="ring" style={{ '--p': pct }}><span>{pct}%</span></div>
        <ul>
          {Object.entries(tasks).map(([k, v]) => (
            <li key={k}><i className={v.done ? 'dot on' : 'dot'}>{v.done ? '✓' : ''}</i>{k}<b className="tpct">{v.pct}%</b></li>
          ))}
        </ul>
      </div>

      <div className="menu">
        <button className="btn" onClick={() => nav('/sleep')}>Sleep Quality</button>
        <button className="btn" onClick={() => nav('/fitness')}>Fitness Routine</button>
        <button className="btn" onClick={() => nav('/sources')}>Source Information</button>
      </div>

      {connected && <>
      <h3>This Week</h3>
      <div className="bars card">
        {data.sleep.map((h, i) => (
          <div key={i}><b style={{ height: Math.max((h || 0) * 9, 4) }} /><small>{days[i]}</small></div>
        ))}
      </div>
      </>}

      <div className="footer">
        <button className="home-icon" aria-label="Home" onClick={() => nav('/home')}><HomeIcon /></button>
        <button className="link" onClick={reset}>Reset demo</button>
        <button className="btn small" onClick={() => { update({ loggedIn: false }); nav('/') }}>Log Out</button>
      </div>
    </Screen>
  )
}
