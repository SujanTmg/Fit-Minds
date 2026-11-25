// Small line icons for the Sources section (inline SVG, no extra dependencies).
// They inherit the text color, so CSS controls the lavender/purple tint.
const PATHS = {
  health: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM8 7h7M8 11h5',
  shield: 'M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3zM9 12l2 2 4-4',
  chart: 'M5 20V11M12 20V4M19 20v-6',
  cardio: 'M3 12h4l2-5 3 10 2-5h7',
  fitness: 'M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12',
}
export default function SrcIcon({ name, size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}
