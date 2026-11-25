import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import { useApp } from '../context/AppContext'
import { FULL } from '../utils/sleep'
import { fmtT } from '../utils/scheduler'

// View Routine: shows the saved, generated weekly routine (or an empty state).
export default function ViewRoutine() {
  const { data } = useApp()
  const nav = useNavigate()
  const r = data.routine
  if (!r) {
    return (
      <Screen back backTo="/fitness" pill="View Routine">
        <div className="card empty">
          <h3>No routine yet</h3>
          <p>Enter your weekly availability and preferences, then generate a routine that fits your schedule.</p>
          <button className="btn primary" onClick={() => nav('/fitness/create')}>Create Routine</button>
        </div>
      </Screen>
    )
  }
  return (
    <Screen back backTo="/fitness" pill="View Routine">
      <div className="card">
        <b>{r.count} workout{r.count === 1 ? '' : 's'} this week • {r.summary.duration} min</b>
        <p className="muted">{r.summary.types.join(' + ')}</p>
      </div>
      {r.note && <div className="note">{r.note}</div>}
      {r.typeNote && <div className="note">{r.typeNote}</div>}
      {r.days.map((d) => d.kind === 'workout' ? (
        <div className="card day" key={d.day}>
          <div className="day-head"><b>{FULL[d.day]}</b><span className="time-badge">{fmtT(d.start)}–{fmtT(d.end)}</span></div>
          <p className="muted"><b>{d.session.title}</b></p>
          <p className="why">{d.reason}</p>
          <details><summary>View workout</summary>
            <p className="muted">{d.session.description}</p>
            <ul className="items">{d.session.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </details>
        </div>
      ) : (
        <div className="card day rest" key={d.day}>
          <div className="day-head"><b>{FULL[d.day]}</b><span className="muted">{d.kind === 'off' ? 'Unavailable' : 'Rest day'}</span></div>
          <p className="why">{d.reason}</p>
        </div>
      ))}
      <button className="btn" onClick={() => nav('/fitness/create')}>Edit Availability &amp; Regenerate</button>
      <small className="muted">Sample routines for education only. Not medical advice.</small>
    </Screen>
  )
}
