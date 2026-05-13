import { useEffect, useState } from 'react'

export default function SplashScreen({ onFinish }) {
  const [hide, setHide] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHide(true)
      setTimeout(onFinish, 600)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, transition: 'opacity 0.6s ease',
      opacity: hide ? 0 : 1, pointerEvents: hide ? 'none' : 'all'
    }}>
      <div style={{ textAlign: 'center', animation: 'scaleIn 0.6s ease' }}>
        <img src="/logo.png" alt="URBANMERCH"
          style={{ width: '200px', objectFit: 'contain', marginBottom: '24px' }} />
        <div style={{
          width: '40px', height: '2px', background: '#fff',
          margin: '0 auto', animation: 'loadBar 2s ease forwards'
        }} />
      </div>
      <style>{`
        @keyframes loadBar {
          from { width: 0px; opacity: 0 }
          to { width: 200px; opacity: 1 }
        }
      `}</style>
    </div>
  )
}