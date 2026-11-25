import { useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import Screen from '../components/Screen'
import { useApp } from '../context/AppContext'
import { DAYS, FULL, STAGES, COLORS, fmt, todayIndex, latestIndex, clock, simulateStages } from '../utils/sleep'

// View Sleep Data: reads the same data.sleep entries as the Log Sleep page.
export default function SleepData() {
  const { data } = useApp()
  const nav = useNavigate()
  const loc = useLocation()
  const li = latestIndex(data.sleep)
  const [view, setView] = useState(loc.state?.view || 'day')          // 'day' | 'week'
  const [day, setDay] = useState(loc.state?.day ?? (li < 0 ? todayIndex() : li))
  if (data.sleepConnection !== 'granted') return <Navigate to="/sleep" replace />

  const goLog = (d) => nav('/sleep', { state: { day: d } })
  const chips = (
    <div className="chips">
      {DAYS.map((d, i) => <button key={d} className={'chip' + (i === day ? ' sel' : '') + (data.sleep[i] != null ? ' has' : '')} onClick={() => setDay(i)}>{d}</button>)}
    </div>
  )

  // ---------- Individual Day ----------
  function DayView() {
    const hrs = data.sleep[day]
    if (hrs == null) {
      return (
        <div className="card empty">
          <h3>No sleep logged for {FULL[day]}</h3>
          <p>There is no sleep data to show for this day yet.</p>
          <button className="btn primary" onClick={() => goLog(day)}>Log Sleep</button>
        </div>
      )
    }
    const segs = simulateStages(hrs)
    const total = segs.reduce((s, [, m]) => s + m, 0)
    const totals = STAGES.map((_, i) => segs.filter(([s]) => s === i).reduce((a, [, m]) => a + m, 0))
    const bt = (data.bedtimes || [])[day]
    const t = bt ? clock(bt, hrs) : null
    let x = 44
    return (
      <>
        <div className="card">
          <h1 className="big">{fmt(hrs)}</h1>
          <p className="muted">{FULL[day]}{t ? ` • ${t.bed} → ${t.wake}` : ' • no bedtime entered'}</p>
          <button className="link" onClick={() => goLog(day)}>Edit this entry</button>
        </div>
        <div className="card">
          <h3>Sleep Cycles <span className="sim">Simulated</span></h3>
          <svg viewBox="0 0 340 140" width="100%" role="img" aria-label="Simulated sleep stages chart">
            {STAGES.map((s, i) => <text key={s} x="0" y={i * 34 + 24} fontSize="10" fill="#6B7280">{s}</text>)}
            {segs.map(([s, m], i) => {
              const w = (m / total) * 290
              const r = <rect key={i} x={x} y={s * 34 + 8} width={Math.max(w - 1, 1)} height="22" rx="5" fill={COLORS[s]} />
              x += w
              return r
            })}
          </svg>
          {STAGES.map((s, i) => <div className="stage-row" key={s}><i className="dot" style={{ background: COLORS[i], borderColor: COLORS[i] }} />{s}<b>{fmt(totals[i] / 60)}</b></div>)}
          <small className="muted">Sleep stages are simulated for this prototype. They are not measurements from Apple Health.</small>
        </div>
      </>
    )
  }

  // ---------- Whole Week ----------
  function WeekView() {
    const logged = data.sleep.map((h, i) => (h == null ? null : i)).filter((i) => i !== null)
    const avg = logged.length ? logged.reduce((s, i) => s + data.sleep[i], 0) / logged.length : 0
    const pts = logged.map((i) => [20 + i * 50, 100 - (data.sleep[i] / 10) * 90])
    const diff = logged.length > 1 ? data.sleep[logged[logged.length - 1]] - data.sleep[logged[0]] : 0
    const trend = logged.length < 2 ? 'Log at least 2 days to see a trend.'
      : diff > 0.5 ? 'Trending up: you are sleeping more.' : diff < -0.5 ? 'Trending down: you are sleeping less.' : 'Steady: your sleep is consistent.'
    return (
      <>
        <div className="card">
          <h3>Weekly Overview</h3>
          <p className="muted">{logged.length ? `Average ${fmt(avg)} • ${logged.length} of 7 days logged` : 'No sleep logged this week.'}</p>
          <div className="bars">
            {data.sleep.map((h, i) => (
              <button key={i} className="barbtn" onClick={() => { setDay(i); setView('day') }}>
                <small>{h == null ? '—' : h + 'h'}</small>
                <b style={{ height: Math.max((h || 0) * 9, 4), opacity: h == null ? 0.3 : 1 }} /><small>{DAYS[i]}</small>
              </button>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Weekly Trend</h3>
          <svg viewBox="0 0 340 120" width="100%" role="img" aria-label="Weekly sleep trend">
            {pts.length > 1 && <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#6366F1" strokeWidth="3" strokeLinejoin="round" />}
            {pts.map(([px, py], i) => <circle key={i} cx={px} cy={py} r="5" fill="#8B5CF6" />)}
            {DAYS.map((d, i) => <text key={d} x={20 + i * 50} y="116" fontSize="10" textAnchor="middle" fill="#6B7280">{d}</text>)}
          </svg>
          <p className="muted">{trend}</p>
        </div>
        <div className="card">
          {data.sleep.map((h, i) => (
            <div className="stage-row" key={i}>{FULL[i]}<b>{h == null ? 'No data' : fmt(h)}</b></div>
          ))}
        </div>
      </>
    )
  }

  return (
    <Screen back backTo="/sleep" pill="Sleep Data">
      <div className="seg">
        <button className={view === 'day' ? 'sel' : ''} onClick={() => setView('day')}>Individual Day</button>
        <button className={view === 'week' ? 'sel' : ''} onClick={() => setView('week')}>Whole Week</button>
      </div>
      {view === 'day' && chips}
      {view === 'day' ? DayView() : WeekView()}
    </Screen>
  )
}
