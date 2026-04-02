import React, { useEffect, useState } from 'react'
import './Preloader.css'

/**
 * Logo preloader:
 * Phase 1 — logo appears centered, large (1.4s)
 * Phase 2 — logo shrinks + moves to top-left (0.7s CSS transition)
 * Phase 3 — overlay fades out, onComplete fires
 */
export default function Preloader({ onComplete }) {
  const [phase, setPhase] = useState('enter') // 'enter' | 'shrink' | 'fade'

  useEffect(() => {
    // Small delay so browser paints first
    const t0 = setTimeout(() => setPhase('show'), 50)
    // Start shrink and simultaneously reveal the website
    const t1 = setTimeout(() => {
      setPhase('shrink')
      onComplete()
    }, 1200)
    // Fade overlay completely
    const t2 = setTimeout(() => {
      setPhase('fade')
    }, 1800)

    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete])

  return (
    <div className={`preloader preloader--${phase}`}>
      <div className="preloader__logo">
        <img src="/logo.png" alt="AV Academy" />
      </div>
    </div>
  )
}
