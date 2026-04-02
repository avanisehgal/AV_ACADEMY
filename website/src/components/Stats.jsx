import React, { useRef, useEffect, useState } from 'react'
import useReveal from '../hooks/useReveal'
import './Stats.css'

const stats = [
  { num: 50000, suffix: '+', label: 'Students Enrolled' },
  { num: 200, suffix: '+', label: 'Hours of Content' },
  { num: 98, suffix: '%', label: 'Satisfaction Rate' },
  { num: 40, suffix: '+', label: 'Expert Courses' },
]

function CountUp({ target, suffix, started }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let start = 0
    const duration = 2000
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer); return }
      setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [started, target])

  return <>{count.toLocaleString()}{suffix}</>
}

export default function Stats() {
  const { ref } = useReveal()
  const [started, setStarted] = useState(false)
  const triggerRef = useRef(null)

  useEffect(() => {
    const el = triggerRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); observer.disconnect() }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="stats" className="stats section" ref={triggerRef}>
      <div className="stats__inner" ref={ref}>
        <div className="stats__header reveal">
          <p className="section-label">04 — Stats</p>
          <h2 className="stats__headline">
            Numbers that<br /><em>speak.</em>
          </h2>
        </div>
        <div className="stats__grid">
          {stats.map(({ num, suffix, label }, i) => (
            <div key={label} className="stats__item reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="stats__num">
                <CountUp target={num} suffix={suffix} started={started} />
              </div>
              <div className="stats__label">{label}</div>
              <div className="stats__bar">
                <div className="stats__bar-fill" style={{ width: started ? '100%' : '0%', transitionDelay: `${i * 0.15}s` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
