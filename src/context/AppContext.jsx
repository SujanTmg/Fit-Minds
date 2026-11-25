import { createContext, useContext, useEffect, useState } from 'react'
import { DEMO_DATA } from '../data/demoData'
import { latestSleep, todayIndex } from '../utils/sleep'

const KEY = 'fitminds-demo'
const THEME_KEY = 'fitminds-theme'
const Ctx = createContext()

const readTheme = () => {
  try { const t = localStorage.getItem(THEME_KEY); return t === 'dark' || t === 'light' ? t : null }
  catch { return null }
}
// Applying during first render avoids a light flash when reopening with dark saved.
const setThemeAttr = (t) => { if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', t) }

// Holds all app data in React state and mirrors it to localStorage.
export function AppProvider({ children }) {
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || DEMO_DATA }
    catch { return DEMO_DATA }
  })
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(data)), [data])

  // Theme: 'light' by default, 'dark' when saved. CSS vars live in global.css (html[data-theme="dark"]).
  const [theme, setThemeState] = useState(() => {
    const t = readTheme() || 'light'
    setThemeAttr(t)
    return t
  })
  useEffect(() => { try { localStorage.setItem(THEME_KEY, theme) } catch {} }, [theme])
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setThemeState(next)
    setThemeAttr(next)
  }

  const update = (patch) => setData((d) => ({ ...d, ...patch }))
  const reset = () => setData({ ...DEMO_DATA, loggedIn: true }) // stay logged in
  return <Ctx.Provider value={{ data, update, reset, theme, toggleTheme }}>{children}</Ctx.Provider>
}
export const useApp = () => useContext(Ctx)

// Today's progress for the two tracked tasks, Workout and Sleep. Each has its own percent
// (from real app data); the ring shows their average.
export function getProgress(d) {
  let workoutPct
  if (d.routine) {
    // generated routine: complete on rest days, or once today's session is marked done
    const today = d.routine.days[todayIndex()]
    workoutPct = today?.kind !== 'workout' || d.routineDoneDate === new Date().toDateString() ? 100 : 0
  } else {
    const n = d.workout.length
    workoutPct = n ? Math.round((d.workout.filter((w) => w.done).length / n) * 100) : 0
  }
  const connected = d.sleepConnection === 'granted'
  const sleepPct = connected && d.sleepGoal ? Math.min(100, Math.round((latestSleep(d.sleep) / d.sleepGoal) * 100)) : 0
  const tasks = {
    Workout: { pct: workoutPct, done: workoutPct === 100 },
    Sleep: { pct: sleepPct, done: connected && latestSleep(d.sleep) >= d.sleepGoal - 1 },
  }
  return { tasks, pct: Math.round((workoutPct + sleepPct) / 2) }
}
