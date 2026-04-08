import React, { useEffect, useRef, useState } from 'react'
import './About.css'

const About = () => {
  const containerRef = useRef(null)
  const overlayRef = useRef(null)
  const headlineRef = useRef(null)
  const boxWrapRef = useRef(null)

  const [activeImgIndex, setActiveImgIndex] = useState(0)
  
  const images = [
    '/image1.png',
    '/image2.png',
    '/image3.png',
    '/image4.png',
    '/image5.png',
    '/image6.png'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImgIndex((prev) => (prev + 1) % images.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let ticking = false
    const isMobile = window.innerWidth <= 768

    const updateParallax = () => {
      if (!containerRef.current || !overlayRef.current || !headlineRef.current || !boxWrapRef.current) return
      
      const { top, height } = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // If container is totally out of view, do nothing.
      if (top > windowHeight || top < -height) {
        ticking = false
        return
      }

      const scrollPx = -top
      const maxScroll = height - windowHeight
      
      let p = scrollPx / maxScroll
      p = Math.max(0, Math.min(1, p))

      // Phase 1 (0 - 0.25): Invert background and text colors using lighten blend logic
      const p1 = Math.min(1, p / 0.25)
      const rBg = Math.round(235 * (1 - p1))
      const gBg = Math.round(232 * (1 - p1))
      const bBg = Math.round(223 * (1 - p1))
      overlayRef.current.style.backgroundColor = `rgb(${rBg}, ${gBg}, ${bBg})`

      const rText = Math.round(235 * p1)
      const gText = Math.round(232 * p1)
      const bText = Math.round(223 * p1)
      headlineRef.current.style.color = `rgb(${rText}, ${gText}, ${bText})`
      
      // Phase 2 (0.25 - 0.70): Text scales out exponentially
      // Mobile: cap at 8x to prevent GPU tearing on small screens
      const p2 = Math.max(0, Math.min(1, (p - 0.25) / 0.45))
      const maxScale = isMobile ? 8 : 25
      const textScale = 1 + Math.pow(p2, 3) * maxScale
      const textOpacity = 1 - Math.pow(p2, 2)
      
      // translate3d(0,0,0) forces a distinct rendering layer prior to the mathematical scaling, preventing tile fragmentation
      headlineRef.current.style.transform = `translate3d(0px, 0px, 0px) scale(${textScale})`
      headlineRef.current.style.opacity = textOpacity
      
      // Extremely low opacity elements still paint. Hide completely if totally faded to save GPU.
      if (textOpacity <= 0.01) {
        headlineRef.current.style.visibility = 'hidden'
      } else {
        headlineRef.current.style.visibility = 'visible'
      }
      
      // Phase 3 (0.45 - 0.75): Box fades in and scales "out of" the text
      const p3 = Math.max(0, Math.min(1, (p - 0.45) / 0.3))
      const boxScale = 0.85 + p3 * 0.15
      
      boxWrapRef.current.style.transform = `scale(${boxScale})`
      boxWrapRef.current.style.opacity = p3
      boxWrapRef.current.style.pointerEvents = p3 > 0.6 ? 'auto' : 'none'

      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Trigger once on mount
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  return (
    <section id="about" className="about-scroll" ref={containerRef} style={{ height: isMobile ? '400vh' : '600vh' }}>
      <div className="about-sticky">
        
        {/* Layer 1: Underlay Video */}
        <video 
          className="about-video"
          src="/landing_page_bg_video.mp4" 
          autoPlay muted loop playsInline
        />

        {/* Layer 2: Typographic Blend Mask */}
        <div className="about-overlay" ref={overlayRef}>
          <h2 className="about-headline" ref={headlineRef}>
            <span className="desktop-text">TURNING CONFUSION<br/>INTO CONFIDENCE</span>
            <span className="mobile-text">TURNING<br/>CONFUSION<br/>INTO<br/>CONFIDENCE</span>
          </h2>
        </div>

        {/* Layer 3: Glassmorphism Educator Bio Card */}
        <div className="about-box-wrap" ref={boxWrapRef}>
          <div className="about-box">
            
            {/* Top row: Bio text + Oval graphic */}
            <div className="about-box-top">
               <div className="about-box-text">
                  <p className="about-bio">
                    Hi, I’m the educator behind <strong>AV Academy</strong>, focused on making mathematics simple, clear, and actually understandable. I break down complex concepts into easy, step-by-step explanations so you can move from confusion to clarity without feeling overwhelmed. My approach combines strong conceptual understanding with practical problem-solving, helping you not just solve questions but truly understand what you’re doing.
                  </p>
                  <p className="about-bio">
                    Instead of relying on rote learning, I emphasize the “why” behind every concept, along with smart exam strategies that make a real difference in performance. The goal is to help you build confidence in maths, think logically, and approach every question with clarity rather than guesswork.
                  </p>
               </div>

               <div className="about-box-visual">
                   <div className="about-oval-container">
                     <div className="about-oval-bg"></div>
                     <div className="about-images-wrapper">
                       {images.map((src, index) => {
                         const isActive = index === activeImgIndex;
                         return (
                           <img 
                             key={src}
                             src={src} 
                             alt={`Educator ${index + 1}`} 
                             className={`about-dynamic-img img-${index + 1} ${isActive ? 'is-active' : ''}`}
                           />
                         )
                       })}
                     </div>
                   </div>
                   
                   {/* Thought Quote Moved Under Oval */}
                   <div className="about-thought">
                     <span className="thought-quote-mark">"</span>
                     <p className="thought-text">Because Maths isn't hard you just need the right explanation.</p>
                   </div>
               </div>
            </div>

            {/* Bottom row: Horizontal Bullets */}
            <div className="about-box-bottom">
              <ul className="about-list-horizontal">
                <li><span className="about-icon">✓</span> Build strong concepts</li>
                <li><span className="about-icon">✓</span> Gain confidence in problem solving</li>
                <li><span className="about-icon">✓</span> Prepare effectively for your exams</li>
              </ul>
            </div>

          </div>
        </div>
        
      </div>
    </section>
  )
}

export default About
