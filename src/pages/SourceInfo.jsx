import Screen from '../components/Screen'
import { PAGES } from '../data/sourcesContent'

// One reusable text page for Cardio, Fitness, Article, Evidence & Limitations, Reliability Summary.
// `page` picks the content from src/data/sourcesContent.js.
export default function SourceInfo({ page }) {
  const p = PAGES[page]
  return (
    <Screen back backTo={p.back} pill={p.pill}>
      <article className="card info">
        {p.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.paragraphs.map((t, i) => <p key={i}>{t}</p>)}
          </section>
        ))}
      </article>
    </Screen>
  )
}
