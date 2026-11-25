// Shared helpers for the Sleep screens (Log Sleep + View Sleep Data).
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const STAGES = ['Awake', 'REM', 'Light', 'Deep']
export const COLORS = ['#F59E0B', '#8B5CF6', '#A78BFA', '#6366F1']

// 7.5 -> "7h 30m"
export const fmt = (h) => { const m = Math.round(h * 60); return `${Math.floor(m / 60)}h ${m % 60}m` }
// Monday = 0 ... Sunday = 6
export const todayIndex = () => (new Date().getDay() + 6) % 7
// Index of the most recent day that has a logged entry (-1 if none)
export const latestIndex = (arr) => { for (let i = 6; i >= 0; i--) if (arr[i] != null) return i; return -1 }
export const latestSleep = (arr) => { const i = latestIndex(arr); return i < 0 ? 0 : arr[i] }

const to12 = (t) => { const h = Math.floor(t / 60), m = t % 60; return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` }
// bedtime "22:45" + duration -> { bed: "10:45 PM", wake: "7:00 AM" } so times match the logged hours
export function clock(bed, hours) {
  const [h, m] = bed.split(':').map(Number)
  return { bed: to12(h * 60 + m), wake: to12((h * 60 + m + Math.round(hours * 60)) % 1440) }
}

// SIMULATED sleep stages: a fixed typical-night pattern [stage, minutes] (495 min),
// scaled to the logged duration so the graph changes when the entry changes.
const BASE = [[2,20],[3,45],[2,30],[1,15],[2,35],[3,40],[2,30],[1,20],[2,40],[3,20],[2,30],[1,30],[2,40],[0,5],[2,30],[1,35],[2,30]]
export function simulateStages(hours) {
  const total = Math.round(hours * 60), k = total / 495
  let used = 0
  return BASE.map(([s, m], i) => {
    const mm = i === BASE.length - 1 ? Math.max(1, total - used) : Math.max(1, Math.round(m * k))
    used += mm
    return [s, mm]
  })
}
