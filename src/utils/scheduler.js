// Scheduling logic: free time = waking hours minus busy periods (with buffers), then pick realistic workout slots.
import { buildSessions, TYPE_INFO } from './workouts.js'

export const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m }
export const fmtT = (m) => `${Math.floor(m / 60) % 12 || 12}:${String(m % 60).padStart(2, '0')} ${Math.floor(m / 60) % 24 < 12 ? 'AM' : 'PM'}`

const BUFFER = 15                                   // prep/transition minutes around commitments
const RANGE = { morning: [0, 720], afternoon: [720, 1020], evening: [1020, 1440] } // by start time
const IDEAL = { morning: 480, afternoon: 960, evening: 1110, none: 1050 }          // preferred start (minutes)
const NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Free windows for one day. Earliest start = wake + 30 min (never before 5:00 AM); latest end = sleep - 60 min wind-down.
function freeWindows(day, av) {
  if (av.off?.[day]) return []
  let wake = toMin(av.wake), sleep = toMin(av.sleep)
  if (!(sleep > wake + 240)) { wake = 420; sleep = 1380 } // invalid hours -> defaults 7:00 AM / 11:00 PM
  const lo = Math.max(300, wake + 30), hi = sleep - 60
  const busy = (av.busy?.[day] || []).filter((b) => toMin(b.end) > toMin(b.start))
    .map((b) => [toMin(b.start) - BUFFER, toMin(b.end) + BUFFER, b]).sort((a, b) => a[0] - b[0])
  const wins = []
  let cur = lo, prev = null
  for (const [s, e, b] of busy) {
    if (Math.min(s, hi) > cur) wins.push({ start: cur, end: Math.min(s, hi), prev, next: b })
    if (e > cur) { cur = e; prev = b }
  }
  if (hi > cur) wins.push({ start: cur, end: hi, prev, next: null })
  return wins
}

// Best slot of the requested length on a day (lower score = better)
function bestSlot(day, av, prefs, dur) {
  const [a, b] = RANGE[prefs.time] || [0, 1440]
  let best = null
  for (const w of freeWindows(day, av)) {
    for (let s = Math.ceil(w.start / 15) * 15; s + dur <= w.end; s += 15) {
      const inPref = prefs.time === 'none' || (s >= a && s < b)
      const score = Math.abs(s - (IDEAL[prefs.time] || IDEAL.none)) + (inPref ? 0 : 400)
      if (!best || score < best.score) best = { start: s, end: s + dur, score, inPref, win: w }
    }
  }
  return best
}

export function buildRoutine(av, prefs) {
  const dur = prefs.duration
  const slots = [0, 1, 2, 3, 4, 5, 6].map((d) => bestSlot(d, av, prefs, dur))
  const avail = slots.map((s, i) => (s ? i : -1)).filter((i) => i >= 0)
  const k = Math.min(prefs.days, 5, avail.length) // never more than 5 workouts: always keep rest days

  // choose the best set of k days: good time slots, and avoid back-to-back days (recovery)
  let chosen = [], best = Infinity
  if (k > 0) {
    for (let mask = 0; mask < 128; mask++) {
      const set = [0, 1, 2, 3, 4, 5, 6].filter((d) => (mask >> d) & 1)
      if (set.length !== k || set.some((d) => !slots[d])) continue
      let score = set.reduce((s, d) => s + slots[d].score, 0)
      for (const d of set) if (set.includes((d + 1) % 7)) score += 600
      if (score < best) { best = score; chosen = set }
    }
  }
  const sessions = buildSessions(chosen.length, prefs.types, dur)

  const days = [0, 1, 2, 3, 4, 5, 6].map((d) => {
    if (av.off?.[d]) return { day: d, kind: 'off', reason: 'You marked this day as unavailable.' }
    const i = chosen.indexOf(d)
    if (i < 0) return { day: d, kind: 'rest', reason: slots[d]
      ? 'Rest day: keeps recovery time between sessions.'
      : `Rest day: no free ${dur}-minute window after your commitments, buffers, and sleep hours.` }
    const s = slots[d], n = (av.busy?.[d] || []).length
    const parts = [`Free window ${fmtT(s.win.start)}–${fmtT(s.win.end)}`,
      n ? `kept clear of your ${n} commitment${n > 1 ? 's' : ''} with ${BUFFER}-minute buffers` : 'no commitments this day',
      s.inPref ? (prefs.time === 'none' ? 'a comfortable time of day' : `matches your ${prefs.time} preference`)
        : `no ${prefs.time} window was long enough, so this is the closest option`]
    if (!chosen.includes((d + 6) % 7) && !chosen.includes((d + 1) % 7)) parts.push('rest days on both sides')
    return { day: d, kind: 'workout', start: s.start, end: s.end, session: sessions[i], reason: parts.join('; ') + '.' }
  })

  let note = null
  if (k < prefs.days) {
    const alt = dur > 30 ? [0, 1, 2, 3, 4, 5, 6].filter((d) => bestSlot(d, av, prefs, 30)).length : 0
    note = k === 0
      ? `No free ${dur}-minute window fits around your commitments, buffers, and sleep hours, so no workouts were scheduled.`
      : `You asked for ${prefs.days} workouts per week, but only ${k} ${k === 1 ? 'day has' : 'days have'} a free ${dur}-minute window that avoids your commitments and sleep hours. A realistic plan is ${k} workout${k === 1 ? '' : 's'} per week.`
    if (alt > k) note += ` Choosing 30-minute workouts would open up ${Math.min(alt, prefs.days)} days.`
  }
  const typeNote = chosen.length > 0 && chosen.length < prefs.types.length
    ? `With ${chosen.length} session${chosen.length > 1 ? 's' : ''} this week, not every selected workout type fits. Add more workout days to include them all.` : null
  return { days, count: chosen.length, note, typeNote,
    summary: { duration: dur, time: prefs.time, types: prefs.types.map((t) => TYPE_INFO[t].name), days: prefs.days } }
}
export const DAY_NAMES = NAMES

// Days that have an uninterrupted free window long enough for the chosen duration
// (unavailable days, busy time, buffers and sleep hours are already excluded by bestSlot).
export function availableDays(av, prefs) {
  return [0, 1, 2, 3, 4, 5, 6].filter((d) => bestSlot(d, av, prefs, prefs.duration))
}
