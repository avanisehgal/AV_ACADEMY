import React from 'react'
import useReveal from '../hooks/useReveal'
import './Expertise.css'

const skills = [
  { cat: 'AI & Tools', items: ['ChatGPT', 'Midjourney', 'Claude', 'Perplexity', 'Runway ML', 'ElevenLabs'] },
  { cat: 'Automation', items: ['n8n', 'Zapier', 'Make.com', 'Airtable', 'Notion API', 'Webhooks'] },
  { cat: 'Design', items: ['Figma', 'Adobe Express', 'Canva Pro', 'Spline 3D', 'Framer', 'CapCut'] },
  { cat: 'Growth', items: ['YouTube SEO', 'Email Lists', 'Community Building', 'Monetization', 'Analytics', 'Funnels'] },
]

export default function Expertise() {
  const { ref } = useReveal()

  return (
    <section id="expertise" className="expertise section">
      <div className="expertise__inner" ref={ref}>
        <div className="expertise__header reveal">
          <p className="section-label">03 — Expertise</p>
          <h2 className="expertise__headline">
            What we <em>teach</em>
          </h2>
        </div>

        <div className="expertise__grid">
          {skills.map(({ cat, items }, i) => (
            <div key={cat} className="expertise__cat reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="expertise__cat-header">
                <span className="expertise__cat-num">0{i + 1}</span>
                <h3 className="expertise__cat-name">{cat}</h3>
              </div>
              <div className="expertise__tags">
                {items.map((item) => (
                  <span key={item} className="expertise__tag" data-hover>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Full-width CTA band */}
        <div className="expertise__band reveal">
          <p className="expertise__band-text">
            Have a learning goal in mind?{' '}
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Let's talk ↗
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
