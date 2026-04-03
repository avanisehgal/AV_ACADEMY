import React, { useState, useEffect, useRef } from 'react'
import ChapterModal from './ChapterModal'
import useReveal from '../hooks/useReveal'
import './Works.css'

const courses = [
  {
    id: '01',
    title: 'Class 12 Mathematics',
    desc: 'Complete syllabus breakdown with advanced problem-solving techniques for board exams.',
    features: ['Concept Clarity', 'Important Questions', 'Revision Strategy'],
  },
  {
    id: '03',
    title: 'CUET & Entrance Prep',
    desc: 'Speed-based calculation hacks and rigorous mock test analyses for top university admission.',
    features: ['Shortcut Methods', 'Time Management', 'Mock Analyses'],
  },
  {
    id: '02',
    title: 'BTech Mathematics',
    desc: 'Advanced concepts. Building something powerful for you.',
    features: ['Engineering Calculus', 'Linear Algebra', 'Complex Analysis'],
    comingSoon: true
  }
]

export default function Works() {
  const sectionRef = useRef(null)
  const { ref: revealRef } = useReveal()  
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  const handleStartLearning = (course) => {
    setSelectedCourse(course)
    setIsModalOpen(true)
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  let p = 0;
  if (sectionRef.current) {
    const rect = sectionRef.current.getBoundingClientRect()
    const sectionTop = rect.top + window.scrollY
    const scrollableDistance = rect.height - window.innerHeight
    const topDiff = scrollY - sectionTop
    p = scrollableDistance > 0 ? Math.max(0, Math.min(1, topDiff / scrollableDistance)) : 0
  }

  const pathScale = 0.8;

  // Background Video Fades Out
  let bgVideoStyle = { opacity: 1 }
  if (p <= 0.35) {
    bgVideoStyle = { opacity: 1 }
  } else if (p > 0.35 && p <= 0.50) {
    const rp = (p - 0.35) / 0.15
    bgVideoStyle = { opacity: 1 - rp }
  } else {
    bgVideoStyle = { opacity: 0 }
  }


  // 1. Hook Phase
  let hookStyle = {}
  let morphContainerStyle = {}
  let word1Style = {}
  let word2Style = {}
  let subtextStyle = {}
  let gridStyle = {}
  let cardStyles = [{}, {}, {}]
  let pathStyle = {}

  if (isMobile) {
    // MOBILE: 3-Phase Pinned Sequence
    // Phase 1 (p 0→0.28): Hook fades out, everything else hidden
    // Phase 2 (p 0.28→0.80): Morph + Subtext settle in top zone, cards OFF-SCREEN
    // Phase 3 (p 0.80→1.0): Cards sweep up through BOTTOM zone only, text never moves

    if (p <= 0.28) {
      const rp = p / 0.28
      hookStyle = {
        opacity: Math.max(0, 1 - rp * 1.9),
        transform: `translate(-50%, calc(-50% - ${rp * 14}vh))`
      }
      morphContainerStyle = { opacity: 0, transform: `translate(-50%, calc(-50% + 18vh))` }
      word1Style = {}
      word2Style = {}
      subtextStyle = { opacity: 0, transform: `translate(-50%, calc(-50% + 30vh))` }
      gridStyle    = { opacity: 0, transform: `translateY(calc(-50% + 110vh))` }
      pathStyle    = { opacity: 0, transform: `translateY(200px)` }
    }
    else if (p <= 0.80) {
      const rp = (p - 0.28) / 0.52
      hookStyle = { opacity: 0, transform: `translate(-50%, calc(-50% - 20vh))` }
      const morphY = 18 - rp * 46
      morphContainerStyle = {
        opacity: Math.min(1, rp * 1.8),
        transform: `translate(-50%, calc(-50% + ${morphY}vh))`
      }
      word1Style = {}
      word2Style = {}
      const subRp = Math.max(0, (rp - 0.55) / 0.45)
      const subY = 30 - subRp * 38
      subtextStyle = {
        opacity: Math.min(1, subRp * 2.2),
        transform: `translate(-50%, calc(-50% + ${subY}vh))`
      }
      gridStyle = { opacity: 0, transform: `translateY(calc(-50% + 110vh))` }
      pathStyle = { opacity: 0, transform: `translateY(200px)` }
    }
    else {
      const rp = (p - 0.80) / 0.20
      hookStyle = { opacity: 0, transform: `translate(-50%, calc(-50% - 20vh))` }

      // Text: pinned at exact Phase 2 final positions — never moves
      morphContainerStyle = { opacity: 1, transform: `translate(-50%, calc(-50% - 28vh))` }
      word1Style = {}
      word2Style = {}
      subtextStyle = { opacity: 1, transform: `translate(-50%, calc(-50% - 8vh))` }

      // Cards sweep freely from off-screen bottom (+55vh) up through and past the text
      // Text has frosted glass backdrop so it remains readable as cards scroll under it
      const cardY = 55 - rp * 115   // 55vh → -60vh (full sweep through screen)
      gridStyle = {
        opacity: Math.min(1, rp * 5),
        transform: `translateY(calc(-50% + ${cardY}vh))`
      }

      pathStyle = { opacity: Math.min(1, rp * 5) }
    }

    cardStyles = [{}, {}, {}]

  } else {
    // ── DESKTOP: Complex Multi-Phase Sticky Timeline ──
    if (p <= 0.05) {
      hookStyle = { opacity: 1, transform: 'translate(-50%, -50%)' }
    } else if (p > 0.05 && p <= 0.15) {
      const rp = (p - 0.05) / 0.10
      hookStyle = { opacity: 1 - rp, transform: `translate(-50%, calc(-50% - ${rp * 30}vh))` }
    } else {
      hookStyle = { opacity: 0, transform: 'translate(-50%, calc(-50% - 30vh))' }
    }

    if (p <= 0.15) {
      morphContainerStyle = { opacity: 0, transform: 'translate(-50%, calc(-50% + 15vh)) scale(1)' }
    } else if (p > 0.15 && p <= 0.25) { 
      const rp = (p - 0.15) / 0.10
      morphContainerStyle = { opacity: rp, transform: `translate(-50%, calc(-50% + ${15 - rp*15}vh)) scale(1)` }
    } else if (p > 0.25 && p <= 0.45) { 
      morphContainerStyle = { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
    } else if (p > 0.45 && p <= 0.75) { 
      const rp = (p - 0.45) / 0.30
      morphContainerStyle = { opacity: 1, transform: `translate(-50%, calc(-50% - ${rp * 32}vh)) scale(${1 - rp*0.2})` }
    } else {
      morphContainerStyle = { opacity: 1, transform: 'translate(-50%, calc(-50% - 32vh)) scale(0.8)' }
    }

    if (p <= 0.45) {
      word1Style = { transform: 'translate(-50%, -100%)' }
      word2Style = { transform: 'translate(-50%, 0%)' }
    } else if (p > 0.45 && p <= 0.75) {
      const rp = (p - 0.45) / 0.30
      word1Style = { transform: `translate(calc(-${50 + rp*50}% - ${rp*0.12}em), -${100 - rp*50}%)` }
      word2Style = { transform: `translate(calc(-${50 - rp*50}% + ${rp*0.12}em), -${rp*50}%)` }
    } else {
      word1Style = { transform: 'translate(calc(-100% - 0.12em), -50%)' }
      word2Style = { transform: 'translate(calc(0% + 0.12em), -50%)' }
    }

    if (p <= 0.60) {
      subtextStyle = { opacity: 0, transform: 'translate(-50%, calc(-50% - 10vh))' }
    } else if (p > 0.60 && p <= 0.80) {
      const rp = (p - 0.60) / 0.20
      subtextStyle = { opacity: rp, transform: `translate(-50%, calc(-50% - ${10 + rp*11}vh))` }
    } else {
      subtextStyle = { opacity: 1, transform: 'translate(-50%, calc(-50% - 21vh))' }
    }

    const slideX = '50vw'
    const slideY = '50vh'

    if (p <= 0.45) {
      gridStyle = { opacity: 0 }
      cardStyles = [
        { '--slidex': `-${slideX}`, '--slidey': '0px' },
        { '--slidex': '0px', '--slidey': slideY },
        { '--slidex': slideX, '--slidey': '0px' }
      ]
      pathStyle = { opacity: 0, transform: `translateY(40px) scale(${pathScale})` }
    } 
    else if (p > 0.45 && p <= 0.75) {
      const rp = (p - 0.45) / 0.30
      const slideXNum = 50
      gridStyle = { opacity: Math.min(1, rp * 1.5) }
      cardStyles = [
        { '--slidex': `-${slideXNum - rp*slideXNum}vw`, '--slidey': '0px' },
        { '--slidex': '0px', '--slidey': `calc(50vh - ${rp*50}vh)` },
        { '--slidex': `${slideXNum - rp*slideXNum}vw`, '--slidey': '0px' }
      ]
      pathStyle = { opacity: Math.min(1, rp * 1.5), transform: `translateY(${40 - rp*40}px) scale(${pathScale})` }
    } 
    else {
      gridStyle = { opacity: 1 }
      cardStyles = [
        { '--slidex': '0vw', '--slidey': '0vh' },
        { '--slidex': '0vw', '--slidey': '0vh' },
        { '--slidex': '0vw', '--slidey': '0vh' }
      ]
      pathStyle = { opacity: 1 }
    }
  }

  const cardJSX = courses.map((course, i) => (
    <div
      key={course.id}
      className={`course-card course-card-${i + 1} ${course.comingSoon ? 'coming-soon' : ''}`}
      style={cardStyles[i]}
    >
      <div className="course-card-header-flex">
        <h3 className="course-card-title">{course.title}</h3>
        {course.comingSoon && <span className="coming-soon-badge">Coming Soon</span>}
      </div>
      <p className="course-card-desc">{course.desc}</p>
      <ul className="course-card-features">
        {course.features.map(f => (
          <li key={f}>
            <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12l5 5L20 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      {course.comingSoon ? (
        <button className="course-card-btn disabled">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '6px'}}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Coming Soon
        </button>
      ) : (
        <button className="course-card-btn" onClick={() => handleStartLearning(course)}>
          Start Learning
        </button>
      )}
    </div>
  ))

  const timelineJSX = (
    <div className="courses-path" style={isMobile ? {} : pathStyle}>
      <div className="path-title">How to start</div>
      <div className="path-steps">
        <div className="path-step">
          <span className="step-num">01</span>
          <div className="step-content-box">
            <h4 className="step-name">Diagnose</h4>
            <p className="step-desc">Identify weak concepts</p>
          </div>
        </div>
        <div className="path-line"></div>
        <div className="path-step">
          <span className="step-num">02</span>
          <div className="step-content-box">
            <h4 className="step-name">Practice</h4>
            <p className="step-desc">Targeted problem solving</p>
          </div>
        </div>
        <div className="path-line"></div>
        <div className="path-step">
          <span className="step-num">03</span>
          <div className="step-content-box">
            <h4 className="step-name">Master</h4>
            <p className="step-desc">Ace the final exam</p>
          </div>
        </div>
      </div>
    </div>
  )

  // ── MOBILE: Two-panel layout — sticky hook + normal flow content ──
  if (isMobile) {
    return (
      <section id="works" className="courses-section mobile-two-panel" ref={sectionRef}>

        {/* ── Panel 1: Sticky hook ── */}
        <div className="mobile-hook-panel">
          <video
            className="courses-bg-video"
            src="/landing_page_bg_video.mp4"
            autoPlay loop muted playsInline
            onCanPlay={() => setVideoLoaded(true)}
            style={{ opacity: videoLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
          />
          <div className="courses-bg-overlay" />
          <h2 className="mobile-hook-heading">
            <span>LESS STRESS.</span>
            <span>MORE MARKS.</span>
            <span>BETTER MATHS.</span>
          </h2>
        </div>

        {/* ── Panel 2: Normal-flow content ── */}
        <div className="mobile-content-panel">

          <div className="mobile-morph-block">
            <p className="mobile-morph-line">STOP MEMORIZING.</p>
            <p className="mobile-morph-line">START VISUALIZING.</p>
          </div>

          <p className="mobile-subtext-para">
            Our approach breaks down complex theorems into visual, logical steps. We strip away the intimidating terminology and teach you how to see the underlying architecture of every problem.
          </p>

          <div className="mobile-cards-stack">
            {cardJSX}
          </div>

          <div className="mobile-timeline-wrap">
            {timelineJSX}
          </div>

        </div>

        <ChapterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          course={selectedCourse}
        />
      </section>
    )
  }

  return (
    <section id="works" className="courses-section" ref={sectionRef}>
      <div className="courses-sticky-container">

        {/* Dynamic Context Video Background */}
        <div className="courses-bg-video-wrap" style={bgVideoStyle}>
          <video
            className="courses-bg-video"
            src="/landing_page_bg_video.mp4"
            autoPlay loop muted playsInline
            onCanPlay={() => setVideoLoaded(true)}
            style={{ opacity: videoLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
          />
          <div className="courses-bg-overlay"></div>
        </div>

        <div className="cinematic-hook" style={hookStyle}>
          <h2>LESS STRESS.<br/>MORE MARKS.<br/>BETTER MATHS.</h2>
        </div>

        <div className="cinematic-morph-header" style={morphContainerStyle}>
          <div className="morph-line" style={word1Style}>STOP MEMORIZING.</div>
          <div className="morph-line" style={word2Style}>START VISUALIZING.</div>
        </div>

        <div className="cinematic-subtext" style={subtextStyle}>
          <p>Our approach breaks down complex theorems into visual, logical steps. We strip away the intimidating terminology and teach you how to see the underlying architecture of every problem.</p>
        </div>

        <div className="courses-grid" style={gridStyle}>
          {courses.map((course, i) => (
            <div 
              key={course.id} 
              className={`course-card course-card-${i + 1} ${course.comingSoon ? 'coming-soon' : ''}`} 
              style={cardStyles[i]}
            >
              <div className="course-card-header-flex">
                <h3 className="course-card-title">{course.title}</h3>
                {course.comingSoon && <span className="coming-soon-badge">Coming Soon</span>}
              </div>
              <p className="course-card-desc">{course.desc}</p>
              
              <ul className="course-card-features">
                {course.features.map(f => (
                  <li key={f}>
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              
              {course.comingSoon ? (
                <button className="course-card-btn disabled">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '6px'}}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Coming Soon
                </button>
              ) : (
                <button 
                  className="course-card-btn"
                  onClick={() => handleStartLearning(course)}
                >
                  Start Learning
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Layer 5: Learning Path Timeline (Squeezed more) */}
        <div className="courses-path" style={pathStyle}>
          <div className="path-title">How to start</div>
          
          <div className="path-steps">
            <div className="path-step">
              <span className="step-num">01</span>
              <div className="step-content-box">
                <h4 className="step-name">Diagnose</h4>
                <p className="step-desc">Identify weak concepts</p>
              </div>
            </div>
            
            <div className="path-line"></div>
            
            <div className="path-step">
              <span className="step-num">02</span>
              <div className="step-content-box">
                <h4 className="step-name">Practice</h4>
                <p className="step-desc">Targeted problem solving</p>
              </div>
            </div>
            
            <div className="path-line"></div>
            
            <div className="path-step">
              <span className="step-num">03</span>
              <div className="step-content-box">
                <h4 className="step-name">Master</h4>
                <p className="step-desc">Ace the final exam</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <ChapterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        course={selectedCourse} 
      />
    </section>
  )
}
