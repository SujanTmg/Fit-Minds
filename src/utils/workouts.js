// Workout content. Sessions differ by TYPE (exercises, sets/reps, structure), not just by label.
export const TYPE_INFO = {
  cardio: { name: 'Cardio', desc: 'Running, cycling, walking, endurance training. Builds cardiovascular health and endurance.' },
  strength: { name: 'Strength', desc: 'Compound movements, resistance training, functional strength. Builds strength and performance.' },
  bodybuilding: { name: 'Bodybuilding', desc: 'Muscle-group workouts with sets and reps. Builds muscle size (hypertrophy).' },
}
const ORDER = ['cardio', 'strength', 'bodybuilding']
const COUNT = { 30: 3, 45: 4, 60: 5 } // how many exercises fit the duration

const CARDIO = [
  { focus: 'Steady-state endurance', desc: 'Easy-to-moderate pace you can talk through. Builds your aerobic base.',
    items: (d) => ['5 min easy warm-up', `${d - 10} min steady run, bike, or brisk walk (conversational pace)`, '5 min cool-down walk'] },
  { focus: 'Interval training', desc: 'Alternating hard and easy efforts to raise cardiovascular fitness.',
    items: (d) => ['5 min easy warm-up', `${Math.floor((d - 10) / 4)} rounds: 2 min hard effort + 2 min easy recovery`, '5 min cool-down walk'] },
  { focus: 'Tempo pace', desc: 'A sustained, comfortably hard effort to build endurance and speed.',
    items: (d) => ['5 min easy warm-up', `${d - 15} min at a comfortably hard "tempo" pace`, '5 min cool-down', '5 min stretching'] },
]
// Strength: heavy compound lifts, low reps, long rests (2–3 min)
const STRENGTH = [
  { focus: 'Lower-body strength', desc: 'Heavy compound lifts, 4–6 reps, 2–3 min rest.',
    items: ['Back squat: 4 × 5', 'Romanian deadlift: 3 × 6', 'Walking lunges: 3 × 8 per leg', 'Standing calf raise: 3 × 12', 'Plank: 3 × 40 sec'] },
  { focus: 'Upper-body strength', desc: 'Heavy compound lifts, 4–6 reps, 2–3 min rest.',
    items: ['Bench press: 4 × 5', 'Barbell row: 4 × 5', 'Overhead press: 3 × 6', 'Pull-ups: 3 × as many as possible', 'Farmer carry: 3 × 30 m'] },
  { focus: 'Full-body functional strength', desc: 'Functional movements for total-body strength and performance.',
    items: ['Deadlift: 4 × 4', 'Goblet squat: 3 × 8', 'Push-ups: 3 × 12', 'Kettlebell swing: 3 × 15', 'Dumbbell row: 3 × 8 per arm', 'Plank: 3 × 45 sec'] },
]
// Bodybuilding: muscle-group focus, isolation work, 8–15 reps, 60–90 sec rest (different exercises than Strength)
const BODY = [
  { focus: 'Push day (chest, shoulders, triceps)', desc: 'Hypertrophy focus: 8–15 reps, 60–90 sec rest, controlled tempo.',
    items: ['Incline dumbbell press: 3 × 10', 'Cable fly: 3 × 12', 'Lateral raise: 3 × 15', 'Triceps pushdown: 3 × 12', 'Overhead triceps extension: 3 × 12'] },
  { focus: 'Pull day (back, biceps)', desc: 'Hypertrophy focus: 8–15 reps, 60–90 sec rest, controlled tempo.',
    items: ['Lat pulldown: 3 × 10', 'Seated cable row: 3 × 10', 'Face pull: 3 × 15', 'Dumbbell biceps curl: 3 × 12', 'Hammer curl: 3 × 12'] },
  { focus: 'Leg day (quads, hamstrings, glutes)', desc: 'Hypertrophy focus: 8–15 reps, 60–90 sec rest, controlled tempo.',
    items: ['Leg press: 3 × 10', 'Leg curl: 3 × 12', 'Leg extension: 3 × 12', 'Hip thrust: 3 × 10', 'Seated calf raise: 4 × 15'] },
]

// count sessions, rotating through the selected types; each type rotates its own focus (no repeats back to back)
export function buildSessions(count, types, dur) {
  const list = ORDER.filter((t) => types.includes(t))
  const used = { cardio: 0, strength: 0, bodybuilding: 0 }
  return Array.from({ length: count }, (_, i) => {
    const t = list[i % list.length], n = used[t]++
    if (t === 'cardio') { const c = CARDIO[n % 3]; return { type: t, title: `Cardio: ${c.focus}`, description: c.desc, items: c.items(dur) } }
    const p = (t === 'strength' ? STRENGTH : BODY)[n % 3]
    return { type: t, title: `${TYPE_INFO[t].name}: ${p.focus}`, description: p.desc, items: p.items.slice(0, COUNT[dur] || 4) }
  })
}
