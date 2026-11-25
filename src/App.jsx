import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Login from './pages/Login'
import Home from './pages/Home'
import Fitness from './pages/Fitness'
import Sleep from './pages/Sleep'
import Sources from './pages/Sources'
import ConnectApp from './pages/ConnectApp'
import HealthTopic from './pages/HealthTopic'
import SourceInfo from './pages/SourceInfo'
import References from './pages/References'
import CreateRoutine from './pages/CreateRoutine'
import ViewRoutine from './pages/ViewRoutine'
import Profile from './pages/Profile'
import SleepData from './pages/SleepData'

// Every page except Login needs the demo "logged in" flag.
function Private({ children }) {
  const { data } = useApp()
  return data.loggedIn ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Private><Home /></Private>} />
      <Route path="/fitness" element={<Private><Fitness /></Private>} />
      <Route path="/fitness/create" element={<Private><CreateRoutine /></Private>} />
      <Route path="/fitness/routine" element={<Private><ViewRoutine /></Private>} />
      <Route path="/profile" element={<Private><Profile /></Private>} />
      <Route path="/sleep" element={<Private><Sleep /></Private>} />
      <Route path="/connect" element={<Private><ConnectApp /></Private>} />
      <Route path="/sleep/data" element={<Private><SleepData /></Private>} />
      <Route path="/sources" element={<Private><Sources /></Private>} />
      <Route path="/sources/health" element={<Private><HealthTopic /></Private>} />
      <Route path="/sources/cardio" element={<Private><SourceInfo page="cardio" /></Private>} />
      <Route path="/sources/fitness" element={<Private><SourceInfo page="fitness" /></Private>} />
      <Route path="/sources/references" element={<Private><References /></Private>} />
      <Route path="/sources/article" element={<Private><SourceInfo page="article" /></Private>} />
      <Route path="/sources/evidence" element={<Private><SourceInfo page="evidence" /></Private>} />
      <Route path="/sources/reliability" element={<Private><SourceInfo page="reliability" /></Private>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
