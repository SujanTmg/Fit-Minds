import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import { useApp } from '../context/AppContext'
import { HeartIcon, CheckIcon, BlockedIcon } from '../components/Icons'

const OTHERS = ['Google Fit', 'Fitbit', 'Samsung Health'] // visual demo only

// ConnectApp -> permission popup -> verifying -> success OR denied.
// step: 'choose' | 'verifying' | 'success' | 'denied'
export default function ConnectApp() {
  const nav = useNavigate()
  const { update } = useApp()
  const [step, setStep] = useState('choose')
  const [popup, setPopup] = useState(false)

  // Fake "verifying" delay, then save the granted state
  useEffect(() => {
    if (step !== 'verifying') return
    const t = setTimeout(() => { update({ sleepConnection: 'granted' }); setStep('success') }, 1800)
    return () => clearTimeout(t)
  }, [step])

  const allow = () => { setPopup(false); setStep('verifying') }
  const deny = () => { setPopup(false); update({ sleepConnection: 'denied' }); setStep('denied') }

  return (
    <Screen back backTo="/sleep" pill="Connection" title={step === 'choose' ? 'Connect App' : ''}>
      {step === 'choose' && (
        <>
          <button className="card app-main" onClick={() => setPopup(true)}>
            <HeartIcon /><span><b>Apple Health</b><small>Recommended • Sleep data</small></span>
          </button>
          <h3>Others</h3>
          {OTHERS.map((n) => <div className="card app-other" key={n}>{n}<small>Demo only</small></div>)}
        </>
      )}
      {step === 'verifying' && <div className="center"><div className="spinner" /><p>Verifying connection…</p></div>}
      {step === 'success' && (
        <div className="center">
          <CheckIcon /><h2>Connected to Apple Health</h2>
          <p className="muted">Fit Minds can now read your sleep data.</p>
          <button className="btn primary" onClick={() => nav('/sleep')}>View Sleep Quality</button>
        </div>
      )}
      {step === 'denied' && (
        <div className="center">
          <BlockedIcon /><h2>Permission Denied</h2>
          <p className="muted">You chose not to share sleep data, so your sleep information is unavailable.</p>
          <button className="btn primary" onClick={() => setStep('choose')}>Try Again</button>
        </div>
      )}

      {popup && (
        <div className="overlay">
          <div className="dialog" role="dialog">
            <HeartIcon size={56} />
            <h3>Allow Fit Minds to access Health?</h3>
            <p>Fit Minds is requesting permission to read your <b>sleep data</b> from Apple Health: sleep duration, sleep stages, and bedtime.</p>
            <small>This is a simulated prompt. No real health data is accessed.</small>
            <button className="btn primary" onClick={allow}>Allow connections to Fit Minds</button>
            <button className="btn" onClick={deny}>Don't Connect</button>
          </div>
        </div>
      )}
    </Screen>
  )
}
