import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import SrcIcon from '../components/SourceIcons'

// HealthP: choose Cardio or Fitness (large cards with icon + short description).
export default function HealthTopic() {
  const nav = useNavigate()
  return (
    <Screen back backTo="/sources" pill="Health Topic">
      <div className="topics">
        <button className="topic" data-tone="1" onClick={() => nav('/sources/cardio')}>
          <span className="tile-icon big"><SrcIcon name="cardio" size={34} /></span>
          <span className="topic-text"><b>Cardio</b><small>How aerobic exercise strengthens the heart and improves oxygen use.</small></span>
          <span className="chev">›</span>
        </button>
        <button className="topic" data-tone="3" onClick={() => nav('/sources/fitness')}>
          <span className="tile-icon big"><SrcIcon name="fitness" size={34} /></span>
          <span className="topic-text"><b>Fitness</b><small>How regular physical activity builds strength, endurance, and overall health.</small></span>
          <span className="chev">›</span>
        </button>
      </div>
    </Screen>
  )
}
