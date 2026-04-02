import React from 'react'
import './Marquee.css'

const items = [
  'AV Academy', 'AI Tools', 'Automation', 'Digital Skills',
  'Video Editing', 'Design Thinking', 'Content Strategy', 'Growth Hacking',
  'AV Academy', 'AI Tools', 'Automation', 'Digital Skills',
  'Video Editing', 'Design Thinking', 'Content Strategy', 'Growth Hacking',
]

export default function Marquee({ reverse = false }) {
  return (
    <div className={`marquee-wrap ${reverse ? 'marquee-wrap--reverse' : ''}`}>
      <div className={`marquee-track ${reverse ? 'marquee-track--reverse' : ''}`}>
        {items.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
            <span className="marquee-dot">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
