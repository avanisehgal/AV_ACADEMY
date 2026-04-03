import React, { useState, useEffect, useRef } from 'react'
import './Hero.css'

export default function Hero({ isLoaded = true }) {
  const [showText, setShowText] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => setShowText(true), 100)
    }
  }, [isLoaded])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" className={`hero ${showText ? 'hero--visible' : ''}`} ref={heroRef}>

      {/* Background Video — cream camouflage overlay */}
      <div className="hero__video-wrap">
        <video
          className="hero__video"
          src="/landing_page_bg_video.mp4"
          autoPlay muted loop playsInline
        />
        <div className="hero__overlay" />
      </div>

      {/* ── HERO CONTENT — centered layout ── */}
      <div className="hero__content">

        {/* Giant centered full-width title */}
        <div className="hero__title-wrap">
          <div className="clip-mask">
            <h1 className="hero__title clip-reveal">AV ACADEMY</h1>
          </div>
        </div>

        {/* Highlighted tagline — uppercase */}
        <div className="clip-mask">
          <p className="hero__subtitle clip-reveal">
            CRACKING MATHS, ONE CONCEPT AT A TIME
          </p>
        </div>

        {/* Hashtags — centered, distinct color */}
        <div className="clip-mask">
          <div className="hero__tags clip-reveal">
            <span className="hero__tag">#Target100</span>
            <span className="hero__tag-dot">·</span>
            <span className="hero__tag">#WeCanDoIt!</span>
          </div>
        </div>

        {/* Description & CTA Buttons wrapper — left/right layout */}
        <div className="hero__bottom-row">
          {/* Description — left */}
          <div className="clip-mask">
            <div className="hero__desc clip-reveal">
              <div className="hero__desc-body">
                <p className="hero__desc-main">
                  Bridging The Gap Between Confusing Concepts <br />
                  And Crystal-Clear Understanding.
                </p>
                <p className="hero__desc-sub">
                  High-performance maths coaching for the next <br />
                  generation of toppers at AV Academy.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons — right */}
          <div className="clip-mask">
            <div className="hero__actions clip-reveal">
              <a
                href="#works"
                className="hero__btn hero__btn--primary"
                onClick={(e) => { e.preventDefault(); scrollTo('works') }}
              >
                START LEARNING <span className="hero__btn-arrow">→</span>
              </a>
              <a
                href="#youtube"
                className="hero__btn hero__btn--ghost"
                onClick={(e) => { e.preventDefault(); scrollTo('youtube') }}
              >
                WATCH LECTURES
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
