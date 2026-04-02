import React, { useState, useEffect } from 'react'
import './Navbar.css'

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Courses', href: '#works' },
  { label: 'YouTube', href: '#youtube' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ showLogo = true }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [active, setActive] = useState('#hero')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      
      // Scroll Spy Logic
      const sections = ['hero', 'about', 'works', 'youtube', 'contact']
      const scrollPos = window.scrollY + window.innerHeight / 2

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActive(`#${section}`)
          }
        }
      }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // Initialize on mount
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setActive(href)
    setMobileMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      {/* Logo only — circular, no text */}
      <div className="navbar__logo">
        <a href="#home" onClick={(e) => handleNavClick(e, '#hero')}>
          <img 
            src="/logo.png" 
            alt="AV Academy Logo" 
            className="navbar__logo-img" 
            style={{ opacity: showLogo ? 1 : 0 }}
          />
        </a>
      </div>

      {/* Center nav links */}
      <ul className={`navbar__links ${mobileMenuOpen ? 'navbar__links--open' : ''}`}>
        {navLinks.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className={`navbar__link ${active === href ? 'navbar__link--active' : ''}`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Enroll Now CTA */}
      <a
        href="#works"
        onClick={(e) => handleNavClick(e, '#works')}
        className="navbar__cta"
      >
        Enroll Now
      </a>

      {/* Mobile hamburger */}
      <button
        className={`navbar__hamburger ${mobileMenuOpen ? 'navbar__hamburger--open' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>
    </nav>
  )
}
