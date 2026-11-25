import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import { REFERENCE } from '../data/sourcesContent'

// SourceReference: the source and APA reference are clickable and open the Article page.
export default function References() {
  const nav = useNavigate()
  const open = () => nav('/sources/article')
  return (
    <Screen back backTo="/sources" pill="Sources & References">
      <p className="muted">Tap the source or reference to read the article.</p>
      <button className="card info clickable" onClick={open}>
        <h2>Source</h2>
        <p>{REFERENCE.source}</p>
        <span className="open">Read article →</span>
      </button>
      <button className="card info clickable" onClick={open}>
        <h2>Reference (APA format)</h2>
        <p>{REFERENCE.apa}</p>
        <span className="open">Read article →</span>
      </button>
      <div className="note"><b>Important note:</b> {REFERENCE.note}</div>
    </Screen>
  )
}
