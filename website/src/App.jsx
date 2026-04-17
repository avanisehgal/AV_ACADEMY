import React, { useEffect, useState, useCallback } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Cursor from './components/Cursor'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Works from './components/Works'
import Youtube from './components/Youtube'
import Contact from './components/Contact'
import AdminDashboard from './components/AdminDashboard'
import './App.css'

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPreloaderDone, setIsPreloaderDone] = useState(false)

  const handlePreloaderDone = useCallback(() => {
    setIsLoaded(true)
    // The shrink animation takes 600ms. Exactly at 600ms, the preloader fades.
    setTimeout(() => {
      setIsPreloaderDone(true)
    }, 600)
  }, [])

  // Global scroll-reveal observer
  useEffect(() => {
    if (!isLoaded) return
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { 
        if (e.isIntersecting) {
          e.target.classList.add('visible')
        } else {
          e.target.classList.remove('visible')
        }
      }),
      { threshold: 0.12 }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [isLoaded])

  // Native SPA Route for Admin Portal (Bypassing Navbar/Hero)
  if (window.location.pathname === '/av-admin-portal') {
    return (
      <>
        <Cursor />
        <AdminDashboard />
        <Analytics />
      </>
    );
  }

  return (
    <>
      <Preloader onComplete={handlePreloaderDone} />
      <Navbar showLogo={isPreloaderDone} />
      <main style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.5s ease 0.1s' }}>
        <Hero isLoaded={isLoaded} />
        <About />
        <Works />
        <Youtube />
        <Contact />
      </main>
      <Cursor />
      <Analytics />
    </>
  )
}
