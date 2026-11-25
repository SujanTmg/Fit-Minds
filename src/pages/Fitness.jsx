import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import { useApp } from '../context/AppContext'
import RoutineWidget from '../components/RoutineWidget'
import { DEMO_DATA } from '../data/demoData'

// Fitness Routine: tap an exercise to mark it done; Home progress updates.
export default function Fitness() {
  const { data, update } = useApp()
  const nav = useNavigate()
  const r = data.routine // generated routine saved by Create Routine (null = show the generic default)
  const [toast, setToast] = useState('')
  const [confirm, setConfirm] = useState(false)

  const toggle = (id) => {
    const workout = data.workout.map((w) => (w.id === id ? { ...w, done: !w.done } : w))
    update({ workout })
    setToast(workout.every((w) => w.done) ? 'Workout complete! Great job 🎉' : '')
  }
  const finish = () => {
    update({ workout: data.workout.map((w) => ({ ...w, done: true })) })
    setToast('Workout complete! Great job 🎉')
  }

  // Reset Routine: clears ONLY the generated routine, its setup (availability/preferences) and the
  // fitness checklist. Profile, sleep, login and everything else stay untouched.
  const resetRoutine = () => {
    update({ routine: null, routineDoneDate: null, availability: DEMO_DATA.availability, prefs: DEMO_DATA.prefs, workout: DEMO_DATA.workout })
    setConfirm(false); setToast('')
  }

  return (
    <Screen back title="Fitness Routine">
      {r ? <RoutineWidget r={r} data={data} update={update} /> : (<>
      <div className="card"><h3>Today's Workout</h3><p className="muted">30 min • Full Body</p></div>
      {data.workout.map((w) => (
        <button key={w.id} className={'card row' + (w.done ? ' done' : '')} onClick={() => toggle(w.id)}>
          <span><b>{w.name}</b><small>{w.detail}</small></span>
          <i className={w.done ? 'dot on' : 'dot'}>{w.done ? '✓' : ''}</i>
        </button>
      ))}
      <button className="btn primary" onClick={finish}>Complete Workout</button>
      </>)}
      {toast && <p className="toast">{toast}</p>}
      <div className="two-btns">
        <button className="btn" onClick={() => nav('/fitness/routine')}>View Routine</button>
        <button className="btn" onClick={() => nav('/fitness/create')}>Create Routine</button>
      </div>
      <button className="btn outline" onClick={() => setConfirm(true)}>Reset Routine</button>
      {confirm && (
        <div className="overlay">
          <div className="dialog" role="dialog" aria-modal="true">
            <h3>Are you sure you want to reset your fitness routine?</h3>
            <p>Your generated routine will be deleted and the generic default routine will be displayed again. Your profile, sleep logs, and other app data will not be affected.</p>
            <button className="btn primary" onClick={resetRoutine}>Confirm</button>
            <button className="btn" onClick={() => setConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </Screen>
  )
}
