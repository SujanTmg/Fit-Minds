// The ONE preset demo user and all starting (mock) data.
// "Reset demo" copies this object back into the app.
export const DEMO_LOGIN = { userId: 'taylor', password: 'fitminds123' }

export const DEMO_DATA = {
  loggedIn: false,
  sleepConnection: 'none', // 'none' | 'granted' | 'denied' (simulated health-app permission)
  user: { name: 'Taylor Smith', level: 'Beginner', streak: 12, email: '' },
  goals: ['Workout 4x per week', 'Sleep 7–9 hours', 'Eat 2,000 cal/day'],
  schedule: 'Classes Mon–Thu 9–3, part-time job Fri evenings',
  workout: [
    { id: 1, name: 'Squats', detail: '3 sets • 15 reps', done: false },
    { id: 2, name: 'Push-ups', detail: '3 sets • 12 reps', done: false },
    { id: 3, name: 'Plank', detail: '3 sets • 30 sec', done: false },
  ],
  // Weekly availability for the routine generator (busy periods per day, 0 = Monday)
  availability: {
    wake: '07:00', sleep: '23:00', off: [false, false, false, false, false, false, false],
    busy: {
      0: [{ id: 1, label: 'Class', start: '09:00', end: '11:00' }, { id: 2, label: 'Work', start: '14:00', end: '18:00' }],
      1: [{ id: 3, label: 'Class', start: '10:00', end: '13:00' }],
      2: [{ id: 4, label: 'Class', start: '09:00', end: '11:00' }, { id: 5, label: 'Work', start: '14:00', end: '18:00' }],
      3: [{ id: 6, label: 'Class', start: '10:00', end: '13:00' }],
      4: [{ id: 7, label: 'Work', start: '17:00', end: '21:00' }], 5: [], 6: [],
    },
  },
  prefs: { time: 'none', duration: 45, days: 3, types: ['cardio'] },
  routineDoneDate: null, // date string when today's generated workout was marked complete
  routine: null, // generated weekly routine (saved so View Routine works after refresh)
  nutritionDone: true,
  // Hours slept Mon..Sun. null = nothing logged for that day (Sat starts empty on purpose).
  sleep: [7.5, 6.5, 8, 7, 6, null, 8.25],
  bedtimes: [null, null, null, null, null, null, null], // optional "HH:MM" per day
  sleepGoal: 8,
}
