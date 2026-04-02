import React, { useState, useEffect, useRef } from 'react'
import ChapterModal from './ChapterModal'
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
  const [scrollY, setScrollY] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  const handleStartLearning = (course) => {
    setSelectedCourse(course)
    setIsModalOpen(true)
  }

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
    p = Math.max(0, Math.min(1, topDiff / scrollableDistance))
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
  let hookStyle = { opacity: 1, transform: 'translate(-50%, -50%)' }
  if (p <= 0.05) {
    hookStyle = { opacity: 1, transform: 'translate(-50%, -50%)' }
  } else if (p > 0.05 && p <= 0.15) {
    const rp = (p - 0.05) / 0.10
    hookStyle = { opacity: 1 - rp, transform: `translate(-50%, calc(-50% - ${rp * 30}vh))` }
  } else {
    hookStyle = { opacity: 0, transform: 'translate(-50%, calc(-50% - 30vh))' }
  }

  // 2. The Morph Header Math
  let morphContainerStyle = {}
  let word1Style = {}
  let word2Style = {}
  let subtextStyle = {}
  
  if (p <= 0.15) {
    morphContainerStyle = { opacity: 0, transform: 'translate(-50%, calc(-50% + 15vh)) scale(1)' }
  } else if (p > 0.15 && p <= 0.25) { // Enters
    const rp = (p - 0.15) / 0.10
    morphContainerStyle = { opacity: rp, transform: `translate(-50%, calc(-50% + ${15 - rp*15}vh)) scale(1)` }
  } else if (p > 0.25 && p <= 0.45) { // Idle exact center
    morphContainerStyle = { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
  } else if (p > 0.45 && p <= 0.75) { // Morphing Up
    const rp = (p - 0.45) / 0.30
    morphContainerStyle = { 
      opacity: 1, 
      transform: `translate(-50%, calc(-50% - ${rp * 32}vh)) scale(${1 - rp*0.2})` 
    }
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
    // Adjusted translation to end at 21vh 
    subtextStyle = { opacity: rp, transform: `translate(-50%, calc(-50% - ${10 + rp*11}vh))` }
  } else {
    // End exactly at -21vh for perfectly tight text gap
    subtextStyle = { opacity: 1, transform: 'translate(-50%, calc(-50% - 21vh))' }
  }

  // 3. The Grid & Path Reveal
  let gridStyle = {}
  let cardStyles = []
  let pathStyle = {}

  if (p <= 0.45) {
    gridStyle = { opacity: 0 }
    cardStyles = [
      { '--slidex': '-50vw', '--slidey': '0px' },
      { '--slidex': '0px', '--slidey': '50vh' },
      { '--slidex': '50vw', '--slidey': '0px' }
    ]
    pathStyle = { opacity: 0, transform: `translateY(40px) scale(${pathScale})` }
  } 
  else if (p > 0.45 && p <= 0.75) {
    const rp = (p - 0.45) / 0.30
    gridStyle = { opacity: Math.min(1, rp * 1.5) }
    cardStyles = [
      { '--slidex': `-${50 - rp*50}vw`, '--slidey': '0px' },
      { '--slidex': '0px', '--slidey': `${50 - rp*50}vh` },
      { '--slidex': `${50 - rp*50}vw`, '--slidey': '0px' }
    ]
    pathStyle = { 
      opacity: Math.min(1, rp * 1.5), 
      transform: `translateY(${40 - rp*40}px) scale(${pathScale})` 
    }
  } 
  else {
    gridStyle = { opacity: 1 }
    cardStyles = [
      { '--slidex': '0vw', '--slidey': '0vh' },
      { '--slidex': '0vw', '--slidey': '0vh' },
      { '--slidex': '0vw', '--slidey': '0vh' }
    ]
    pathStyle = { opacity: 1, transform: `translateY(0) scale(${pathScale})` }
  }

  return (
    <section id="works" className="courses-section" ref={sectionRef}>
      <div className="courses-sticky-container">

        {/* Dynamic Context Video Background */}
        <div className="courses-bg-video-wrap" style={bgVideoStyle}>
          <video 
            className="courses-bg-video" 
            src="/landing_page_bg_video.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
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
