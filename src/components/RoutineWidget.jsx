import { FULL, DAYS, todayIndex } from '../utils/sleep'
import { fmtT } from '../utils/scheduler'

// Fitness dashboard widget for a GENERATED routine. It reads the same data.routine that
// Create Routine saves (no separate copy). Only real workout days are shown as day cards;
// rest days and unavailable days are listed separately and compactly.
export default function RoutineWidget({ r, data, update }) {
  const today = todayIndex()
  const key = new Date().toDateString()
  const doneToday = data.routineDoneDate === key
  const t = r.days[today]
  const work = r.days.filter((d) => d.kind === 'workout')
  const rest = r.days.filter((d) => d.kind === 'rest')   // intentional rest days
  const off = r.days.filter((d) => d.kind === 'off')     // days the user marked unavailable
  return (
    <>
      <div className="card">
        <h3>Your Routine</h3>
        <p className="muted">{r.count} workout{r.count === 1 ? '' : 's'} this week • {r.summary.duration} min each</p>
        <div className="tags">{r.summary.types.map((n) => <span className="tag" key={n}>{n}</span>)}</div>
      </div>
      {r.note && <div className="note">{r.note}</div>}
      {r.typeNote && <div className="note">{r.typeNote}</div>}
      {t?.kind === 'workout'
        ? <button className="btn primary" onClick={() => update({ routineDoneDate: doneToday ? null : key })}>
            {doneToday ? 'Today’s workout done ✓ (tap to undo)' : 'Mark today’s workout complete'}
          </button>
        : <p className="muted">{t?.kind === 'off' ? 'Today is marked unavailable.' : 'Today is a rest day.'}</p>}
      {work.length === 0 && <div className="card"><p className="muted">No workouts could be scheduled this week.</p></div>}
      {work.map((d) => (
        <div className={'card day' + (d.day === today ? ' today' : '')} key={d.day}>
          <div className="day-head"><b>{FULL[d.day]}{d.day === today ? ' (Today)' : ''}</b><span className="time-badge">{fmtT(d.start)}–{fmtT(d.end)}</span></div>
          <p className="muted"><b>{d.session.title}</b></p>
          <details open={d.day === today}><summary>View workout</summary>
            <p className="muted">{d.session.description}</p>
            <ul className="items">{d.session.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </details>
        </div>
      ))}
      <div className="card restbox"><b>Rest Days:</b> {rest.length ? rest.map((d) => DAYS[d.day]).join(', ') : 'None'}</div>
      {off.length > 0 && <small className="muted">Unavailable: {off.map((d) => DAYS[d.day]).join(', ')}</small>}
    </>
  )
}
