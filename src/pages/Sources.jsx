import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import SrcIcon from '../components/SourceIcons'
import { PAGES } from '../data/sourcesContent'

// SourcePage: landing for the Sources section, shown as a 2x2 grid of tiles.
// Back returns to Home (Screen default). The Article page opens from Sources & References.
// Featured preview uses the existing Article text (title + its first sentence), nothing new.
const ARTICLE = PAGES.article.sections[0]
const EXCERPT = ARTICLE.paragraphs[0].split('. ')[0] + '.'

export default function Sources() {
  const nav = useNavigate()
  return (
    <Screen back>
      <button className="featured" onClick={() => nav('/sources/references')}>
        <span className="featured-top">
          <span className="badge">Featured Reading</span>
          <SrcIcon name="book" size={22} />
        </span>
        <h2>{ARTICLE.heading}</h2>
        <p>{EXCERPT}</p>
        <span className="featured-link">Explore this topic <span>→</span></span>
      </button>
      <div className="tiles">
        <button className="tile" data-tone="1" onClick={() => nav('/sources/health')}>
          <span className="tile-icon"><SrcIcon name="health" size={28} /></span>Health Topic
        </button>
        <button className="tile" data-tone="2" onClick={() => nav('/sources/references')}>
          <span className="tile-icon"><SrcIcon name="book" size={28} /></span>Sources &amp; References
        </button>
        <button className="tile" data-tone="3" onClick={() => nav('/sources/evidence')}>
          <span className="tile-icon"><SrcIcon name="shield" size={28} /></span>Evidence &amp; Limitations
        </button>
        <button className="tile" data-tone="4" onClick={() => nav('/sources/reliability')}>
          <span className="tile-icon"><SrcIcon name="chart" size={28} /></span>Reliability Summary
        </button>
      </div>
    </Screen>
  )
}
