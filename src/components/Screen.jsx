import { useNavigate } from 'react-router-dom'
import { HomeIcon, ProfileIcon } from './Icons'

// Shared layout (the Figma "Template"): phone frame, pill title, and a footer with
// Home icon + Back button. backTo lets a page choose where Back goes (default Home).
export default function Screen({ children, back = false, backTo = '/home', title, pill = 'Fit Minds', noProfile = false }) {
  const nav = useNavigate()
  return (
    <div className="stage">
      <div className="phone">
        <div className="head">
          <div className="brand-pill">{pill}</div>
          {!noProfile && <button className="profile-btn" aria-label="Profile" onClick={() => nav('/profile')}><ProfileIcon /></button>}
        </div>
        {title && <h2 className="screen-title">{title}</h2>}
        <div className="content">{children}</div>
        {back && (
          <div className="footer">
            <button className="home-icon" aria-label="Home" onClick={() => nav('/home')}><HomeIcon /></button>
            <button className="btn small" onClick={() => nav(backTo)}>Back</button>
          </div>
        )}
      </div>
    </div>
  )
}
