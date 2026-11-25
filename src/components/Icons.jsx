// Simple inline SVG icons so we don't depend on downloaded images.
export const MoonIcon = () => (
  <svg width="72" height="72" viewBox="0 0 100 100"><path d="M60 12a38 38 0 1 0 28 60A30 30 0 0 1 60 12z" style={{ fill: 'var(--secondary)' }} /></svg>
)
export const HeartIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect width="24" height="24" rx="6" style={{ fill: 'var(--surface)', stroke: 'var(--tint)' }} />
    <path d="M12 19s-6.5-4.2-6.5-8.6A3.6 3.6 0 0 1 12 8.5a3.6 3.6 0 0 1 6.5 1.9C18.5 14.8 12 19 12 19z" style={{ fill: 'var(--danger)' }} />
  </svg>
)
export const CheckIcon = () => (
  <svg className="pop" width="120" height="120" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="40" style={{ stroke: 'var(--success)' }} strokeWidth="7" strokeDasharray="14 8" />
    <polyline className="draw" points="30,52 45,66 72,36" style={{ stroke: 'var(--success)' }} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
export const BlockedIcon = () => (
  <svg className="pop" width="120" height="120" viewBox="0 0 100 100" fill="none" strokeWidth="7" strokeLinecap="round" style={{ stroke: 'var(--danger)' }}>
    <circle cx="50" cy="50" r="40" />
    <path d="M30 44q20-14 40 0M38 54q12-8 24 0" strokeWidth="6" />
    <circle cx="50" cy="64" r="2" strokeWidth="6" />
    <path d="M22 22L78 78" />
  </svg>
)
// App-wide Home button icon: simple lavender outline house (roof, walls, door)
export const HomeIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ stroke: 'var(--accent)' }}>
    <path d="M3 11.5L12 4l9 7.5" />
    <path d="M5.5 10v9.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V10" />
    <path d="M10 20.5v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
  </svg>
)
// Header profile button icon (small outline person)
export const ProfileIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ stroke: 'var(--accent)' }}>
    <circle cx="12" cy="8" r="4" /><path d="M4 20.5a8 8 0 0 1 16 0" />
  </svg>
)
// Default avatar used on the Profile page (no photo upload in this prototype)
export const Avatar = ({ size = 96 }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" role="img" aria-label="Default profile avatar">
    <defs><linearGradient id="av" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style={{ stopColor: 'var(--avatar-from)' }} /><stop offset="1" style={{ stopColor: 'var(--avatar-to)' }} /></linearGradient></defs>
    <circle cx="48" cy="48" r="48" fill="url(#av)" />
    <circle cx="48" cy="38" r="16" style={{ fill: 'var(--surface)' }} /><path d="M16 84a32 32 0 0 1 64 0z" style={{ fill: 'var(--surface)' }} />
  </svg>
)
