import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Screen from '../components/Screen'
import { MoonIcon } from '../components/Icons'
import { useApp } from '../context/AppContext'
import { DAYS, FULL, fmt, todayIndex, latestIndex } from '../utils/sleep'

// Sleep Quality + Log Sleep. Entries live in data.sleep (one per weekday, null = not logged).
export default function Sleep() {
  const { data, update } = useApp()
  const nav = useNavigate()
  const loc = useLocation()
  const status = data.sleepConnection || 'none'
  const bedtimes = data.bedtimes || Array(7).fill(null)

  const [day, setDay] = useState(loc.state?.day ?? todayIndex()) // selected day to log
  const [hours, setHours] = useState(data.sleep[day] ?? 8)       // starting value for the stepper
  const [bed, setBed] = useState(bedtimes[day] || '')
  const [toast, setToast] = useState('')

  const saved = data.sleep[day]            // existing entry for the selected day (or null)
  const li = latestIndex(data.sleep)       // most recent logged day

  const pick = (i) => { setDay(i); setHours(data.sleep[i] ?? 8); setBed(bedtimes[i] || ''); setToast('') }
  const save = () => {
    const sleep = [...data.sleep]; sleep[day] = hours          // only this day changes
    const bt = [...bedtimes]; bt[day] = bed || null
    update({ sleep, bedtimes: bt })
    setToast(`${saved != null ? 'Updated' : 'Saved'} ${FULL[day]}: ${fmt(hours)}`)
  }

  // Empty state: no sleep info until the user connects a health app
  if (status !== 'granted') {
    return (
      <Screen back title="Sleep Quality">
        <div className="card empty">
          <MoonIcon />
          <h2>Connect Your Health App</h2>
          <p>To view your sleep information, Fit Minds needs permission to access your sleep data from a health app such as Apple Health.</p>
          {status === 'denied' && <p className="msg">Permission was denied, so your sleep information is unavailable.</p>}
          <button className="btn primary" onClick={() => nav('/connect')}>Connect Health App</button>
        </div>
      </Screen>
    )
  }
  return (
    <Screen back title="Sleep Quality">
      <div className="card night">
        {li < 0 ? <h3>No sleep logged yet</h3> : <><h1>{fmt(data.sleep[li])}</h1><p>Most recent • {FULL[li]}</p></>}
        <div className="bars light">
          {data.sleep.map((h, i) => <div key={i}><b style={{ height: Math.max((h || 0) * 9, 4), opacity: h == null ? 0.3 : 1 }} /><small>{DAYS[i]}</small></div>)}
        </div>
      </div>

      <h3>Log Sleep</h3>
      <div className="chips">
        {DAYS.map((d, i) => (
          <button key={d} className={'chip' + (i === day ? ' sel' : '') + (data.sleep[i] != null ? ' has' : '')} onClick={() => pick(i)}>{d}</button>
        ))}
      </div>
      <div className="card">
        <b>{FULL[day]} • {fmt(hours)}</b>
        <p className="muted">{saved != null ? `Editing saved entry (${fmt(saved)})` : 'Not logged yet. New entry'}</p>
      </div>
      <div className="stepper">
        <button onClick={() => setHours(Math.max(1, hours - 0.25))}>−</button>
        <span>{hours}h</span>
        <button onClick={() => setHours(Math.min(14, hours + 0.25))}>+</button>
      </div>
      <label className="muted">Bedtime (optional) <input type="time" value={bed} onChange={(e) => setBed(e.target.value)} /></label>
      <button className="btn primary" onClick={save}>{saved != null ? `Update ${FULL[day]}` : `Save ${FULL[day]}`}</button>
      {toast && <p className="toast">{toast}</p>}
      <button className="btn" onClick={() => nav('/sleep/data', { state: { day } })}>View Sleep Data</button>
      <button className="link" onClick={() => update({ sleepConnection: 'none' })}>Disconnect (for testing)</button>
    </Screen>
  )
}
