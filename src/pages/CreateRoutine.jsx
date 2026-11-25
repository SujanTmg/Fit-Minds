import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import { useApp } from '../context/AppContext'
import { DEMO_DATA } from '../data/demoData'
import { DAYS, FULL } from '../utils/sleep'
import { fmtT, toMin, buildRoutine, availableDays } from '../utils/scheduler'
import { TYPE_INFO } from '../utils/workouts'

const BLANK = { type: 'Class', description: '', start: '09:00', end: '10:00' }
// Activity type = what you're busy with. (Not the same thing as the Cardio/Strength/Bodybuilding workout types.)
const ACT_TYPES = ['Class', 'Work', 'Other']
// Older saved entries only have a label: use it as the type if it is one, otherwise treat it as an "Other" description
const typeOf = (b) => b.type || (ACT_TYPES.includes(b.label) ? b.label : 'Other')
const descOf = (b) => (b.description !== undefined ? b.description : ACT_TYPES.includes(b.label) ? '' : b.label || '')
const TIMES = [['morning', 'Morning'], ['afternoon', 'Afternoon'], ['evening', 'Evening'], ['none', 'No Preference']]

// Create Routine: availability -> preferences -> workout types -> Generate.
// Everything is saved to shared state/localStorage as you edit, so it is kept when you leave and return.
export default function CreateRoutine() {
  const { data, update } = useApp()
  const nav = useNavigate()
  const av = data.availability || DEMO_DATA.availability
  const prefs = data.prefs || DEMO_DATA.prefs
  const off = av.off || Array(7).fill(false)
  const [day, setDay] = useState(0)
  const [form, setForm] = useState(BLANK)
  const [editKey, setEditKey] = useState(null)      // schedule being edited (its label|start|end)
  const [repeat, setRepeat] = useState(DAYS.map((_, d) => d === 0)) // days the form applies to
  const [ok, setOk] = useState('')
  const [msg, setMsg] = useState('')

  const setAv = (patch) => update({ availability: { ...av, ...patch } })
  const setPrefs = (p) => update({ prefs: { ...prefs, ...p } })

  // Storage is unchanged: availability.busy[day] = [{ id, label, start, end }].
  // A "recurring schedule" is simply the same label+start+end on several days, so older saved data works as-is
  // and the routine generator keeps reading busy[day] exactly like before.
  const busy = av.busy || {}
  const keyOf = (b) => `${typeOf(b)}|${descOf(b)}|${b.start}|${b.end}`
  const daysOf = (k) => DAYS.map((_, d) => d).filter((d) => (busy[d] || []).some((b) => keyOf(b) === k))
  const dayList = [...(busy[day] || [])].sort((a, b) => toMin(a.start) - toMin(b.start))
  const n = repeat.filter(Boolean).length

  const pickDay = (i) => { setDay(i); if (!editKey) setRepeat(DAYS.map((_, d) => d === i)); setMsg(''); setOk('') }
  const toggleRepeat = (i) => setRepeat(repeat.map((v, d) => (d === i ? !v : v)))
  const resetForm = () => { setEditKey(null); setForm(BLANK); setRepeat(DAYS.map((_, d) => d === day)); setMsg('') }

  // Add (or save edits to) a schedule on every selected day at once; exact duplicates are skipped.
  const saveBusy = () => {
    const description = form.description.trim()
    // label is kept (type, or "Type: description") so Profile and older code still show a readable name
    const entry = { type: form.type, description, label: description ? `${form.type}: ${description}` : form.type, start: form.start, end: form.end }
    if (toMin(entry.end) <= toMin(entry.start)) return setMsg('End time must be after start time.')
    if (n === 0) return setMsg('Select at least one day.')
    const newKey = keyOf(entry)
    const next = {}
    let added = 0, skipped = 0
    DAYS.forEach((_, d) => {
      let arr = [...(busy[d] || [])]
      if (editKey) arr = arr.filter((b) => keyOf(b) !== editKey)   // editing updates every day it was on
      if (repeat[d]) {
        if (arr.some((b) => keyOf(b) === newKey)) skipped++
        else { arr.push({ id: Date.now() + d, ...entry }); added++ }
      }
      next[d] = arr
    })
    if (!editKey && added === 0) return setMsg('That schedule already exists on the selected days.')
    setAv({ busy: next })
    setOk(editKey ? 'Schedule updated on all selected days.' : `Added to ${added} day${added === 1 ? '' : 's'}${skipped ? ` (${skipped} already had it)` : ''}.`)
    resetForm()
  }
  const editBusy = (b) => { const k = keyOf(b); setEditKey(k); setForm({ type: typeOf(b), description: descOf(b), start: b.start, end: b.end }); setRepeat(DAYS.map((_, d) => daysOf(k).includes(d))); setMsg(''); setOk('') }
  const delBusy = (b) => {   // removes the schedule from every day it repeats on
    const k = keyOf(b), ds = daysOf(k)
    if (ds.length > 1 && !window.confirm(`Delete "${b.label}" from ${ds.map((d) => DAYS[d]).join(', ')}?`)) return
    const next = { ...busy }
    ds.forEach((d) => { next[d] = busy[d].filter((x) => keyOf(x) !== k) })
    setAv({ busy: next }); setOk('')
    if (editKey === k) resetForm()
  }
  const toggleType = (t) => setPrefs({ types: prefs.types.includes(t) ? prefs.types.filter((x) => x !== t) : [...prefs.types, t] })
  // Validation (recomputed on every render, so it follows any change to availability, duration or frequency)
  const avail = availableDays(av, prefs)
  const notEnough = avail.length < prefs.days
  const alt30 = prefs.duration > 30 ? availableDays(av, { ...prefs, duration: 30 }).length : 0
  const have = avail.length === 0 ? 'you have no available days' : `you only have ${avail.length} available day${avail.length === 1 ? '' : 's'}`
  const generate = () => { if (notEnough) return; update({ routine: buildRoutine(av, prefs) }); nav('/fitness/routine') } // recalculates every time

  const chip = (active, onClick, label) => <button key={label} className={'chip' + (active ? ' sel' : '')} onClick={onClick}>{label}</button>

  return (
    <Screen back backTo="/fitness" pill="Create Routine">
      <h3>1. Weekly Availability</h3>
      <div className="chips">
        {DAYS.map((d, i) => <button key={d} className={'chip' + (i === day ? ' sel' : '') + ((av.busy?.[i]?.length || off[i]) ? ' has' : '')} onClick={() => pickDay(i)}>{d}</button>)}
      </div>
      <div className="card">
        <b>{FULL[day]}</b>
        <label className="check"><input type="checkbox" checked={!!off[day]} onChange={() => setAv({ off: off.map((v, i) => (i === day ? !v : v)) })} /> Mark the whole day unavailable</label>
        {dayList.length === 0 && <p className="muted">No busy periods added.</p>}
        {dayList.map((b) => {
          const ds = daysOf(keyOf(b))
          return (
            <div className="busy" key={b.id}>
              <span><b>{typeOf(b)}</b>{descOf(b) && ` · ${descOf(b)}`} {fmtT(toMin(b.start))}–{fmtT(toMin(b.end))}{ds.length > 1 && <small className="also"> • {ds.map((d) => DAYS[d]).join(', ')}</small>}</span>
              <span><button className="link" onClick={() => editBusy(b)}>Edit</button><button className="link" onClick={() => delBusy(b)}>Delete</button></span>
            </div>
          )
        })}
        <p className="formhead">{editKey ? 'Edit schedule' : 'Add a busy period'}</p>
        <p className="muted">Activity type</p>
        <div className="chips">
          {ACT_TYPES.map((t) => <button key={t} className={'chip' + (form.type === t ? ' sel' : '')} aria-pressed={form.type === t} onClick={() => setForm({ ...form, type: t })}>{t}</button>)}
        </div>
        <div className="busy-form">
          <input type="text" maxLength={40} placeholder="Description (optional), e.g. Biology Lecture" autoComplete="off" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <label className="timefield"><span>Start Time</span>
            <input type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></label>
          <label className="timefield"><span>End Time</span>
            <input type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></label>
        </div>
        <p className="muted">Repeat on (tap to select days)</p>
        <div className="chips">
          {DAYS.map((d, i) => <button key={d} className={'chip' + (repeat[i] ? ' sel' : '')} aria-pressed={repeat[i]} onClick={() => toggleRepeat(i)}>{d}</button>)}
        </div>
        <div className="quick">
          <button className="link" onClick={() => setRepeat(DAYS.map((_, i) => i < 5))}>Mon–Fri</button>
          <button className="link" onClick={() => setRepeat(DAYS.map(() => true))}>All days</button>
          <button className="link" onClick={() => setRepeat(DAYS.map(() => false))}>Clear</button>
        </div>
        {msg && <p className="msg">{msg}</p>}
        {ok && <p className="toast">{ok}</p>}
        <button className="btn small" disabled={n === 0} onClick={saveBusy}>{editKey ? 'Save changes' : n ? `Add to ${n} day${n === 1 ? '' : 's'}` : 'Select days'}</button>
        {editKey && <button className="link" onClick={resetForm}>Cancel</button>}
        <p className="muted hint">Edit changes every day a schedule repeats on; Delete removes it from all of them. Select just one day for a one-off entry.</p>
      </div>

      <h3>2. Preferences</h3>
      <div className="card prefs">
        <label>Wake time <input type="time" value={av.wake} onChange={(e) => setAv({ wake: e.target.value })} /></label>
        <label>Sleep time <input type="time" value={av.sleep} onChange={(e) => setAv({ sleep: e.target.value })} /></label>
        <p className="muted">Workout time</p>
        <div className="chips wrap">{TIMES.map(([v, l]) => chip(prefs.time === v, () => setPrefs({ time: v }), l))}</div>
        <p className="muted">Duration</p>
        <div className="chips">{[30, 45, 60].map((m) => chip(prefs.duration === m, () => setPrefs({ duration: m }), `${m} min`))}</div>
        <p className="muted">Workout days per week</p>
        <div className="chips">{[2, 3, 4, 5].map((n) => chip(prefs.days === n, () => setPrefs({ days: n }), `${n} days`))}</div>
      </div>

      <h3>3. Workout Types</h3>
      {Object.entries(TYPE_INFO).map(([t, info]) => (
        <button key={t} className={'typecard' + (prefs.types.includes(t) ? ' on' : '')} aria-pressed={prefs.types.includes(t)} onClick={() => toggleType(t)}>
          <i className={prefs.types.includes(t) ? 'dot on' : 'dot'}>{prefs.types.includes(t) ? '✓' : ''}</i>
          <span><b>{info.name}</b><small>{info.desc}</small></span>
        </button>
      ))}
      {prefs.types.length === 0 && <p className="msg">Select at least one workout type.</p>}
      {notEnough && (
        <div className="error-box" role="alert">
          <b>Not Enough Available Days</b>
          <p>You selected {prefs.days} workout days per week, but {have}. Please change your availability or select fewer workout days.</p>
          {alt30 > avail.length && <p>Tip: 30-minute workouts would fit on {alt30} day{alt30 === 1 ? '' : 's'}.</p>}
          <div className="two-btns">
            <button className="btn outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Adjust availability</button>
            {avail.length >= 2 && <button className="btn primary" onClick={() => setPrefs({ days: avail.length })}>Use {avail.length} days</button>}
          </div>
        </div>
      )}
      <button className="btn primary" disabled={prefs.types.length === 0 || notEnough} onClick={generate}>Generate Routine</button>
    </Screen>
  )
}
