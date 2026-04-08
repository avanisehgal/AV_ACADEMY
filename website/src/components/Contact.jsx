import React, { useState } from 'react'
import useReveal from '../hooks/useReveal'
import './Contact.css'

/* === SVG Icons for Buttons === */
const QuestionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

/* === SVG Icons for SaaS Footer === */
const EnvelopeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" />
    <rect x="3" y="5" width="18" height="14" rx="2" />
  </svg>
)

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export default function Contact() {
  const { ref } = useReveal()
  const [activeForm, setActiveForm] = useState(null) // 'doubt' or 'collab'
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [videoLoaded, setVideoLoaded] = useState(false)

  const openForm = (type) => {
    setActiveForm(type)
    setShowSuccess(false)
    setErrorText('')
  }

  const closeForm = (e) => {
    if (e) e.stopPropagation()
    setActiveForm(null)
    setShowSuccess(false)
    setErrorText('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorText('')

    // Convert form elements using strict FormData (Bypassing JSON syntax traps)
    const formData = new FormData(e.target)
    
    // Explicitly append Web3Forms credentials
    formData.append("access_key", "cd75fed5-d405-42bb-94e4-3a64d93413a2")
    formData.append("subject", activeForm === 'doubt' ? "New Doubt via AV Academy" : "New Proposal via AV Academy")
    formData.append("from_name", "AV Academy Form")

    try {
      // Web3Forms effortlessly bypasses adblockers and CORS issues!
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      })

      const resData = await response.json()

      if (response.ok) {
        setShowSuccess(true)
      } else {
        // Will show exactly why it fails instead of a vague network error!
        setErrorText(resData.message || "Something went wrong, please try again.")
      }
    } catch (error) {
      setErrorText("Network error. Please check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="contact-premium-wrapper reveal" ref={ref}>

      {/* --- VIDEO BACKGROUND --- */}
      <div className="contact-video-bg" style={{ backgroundColor: '#000000' }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          style={{ opacity: videoLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
        >
          <source src="/landing_page_bg_video.mp4" type="video/mp4" />
        </video>
        <div className="contact-video-overlay" style={{ opacity: videoLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}></div>
      </div>

      {/* --- FLOATING GRAY BOX --- */}
      <div className="contact-box-container">
        <div className="contact-gray-box reveal">
          <h2 className="contact-box-headline">Let's Connect.</h2>
          <p className="contact-box-subtext">
            Whether it’s a complex derivative or a creative collaboration—I’m one message away. <br />
            Maths, but make it human.
          </p>

          <div className="contact-box-buttons">
            <button
              className={`contact-btn ${activeForm === 'doubt' ? 'is-active' : ''}`}
              onClick={() => openForm('doubt')}
            >
              <div className="contact-btn-icon"><QuestionIcon /></div>
              <div className="contact-btn-content">
                <span className="contact-btn-title">Have a Doubt?</span>
                <span className="contact-btn-micro">Confused by a concept? Let’s solve it together. Ask your specific math queries here.</span>
              </div>
            </button>
            <button
              className={`contact-btn ${activeForm === 'collab' ? 'is-active' : ''}`}
              onClick={() => openForm('collab')}
            >
              <div className="contact-btn-icon"><PlusIcon /></div>
              <div className="contact-btn-content">
                <span className="contact-btn-title">Collaborate / Suggest.</span>
                <span className="contact-btn-micro">Have a video idea or a business proposal? Let’s build the future of AV Academy.</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* --- POPUP MODAL OVERLAY (Poppins / Vertical Curved Box) --- */}
      {activeForm && (
        <div className="contact-modal-overlay">
          <div className="contact-modal-content" style={{ maxWidth: (activeForm === 'privacy' || activeForm === 'terms') ? '700px' : '420px' }}>
            <button className="contact-modal-close" onClick={closeForm}>&times;</button>

            {showSuccess ? (
              <div className="contact-modal-success">
                <h3>Message sent successfully</h3>
                <p>I’ll get back to you soon.</p>
                <button type="button" className="contact-modal-submit" onClick={closeForm} style={{ marginTop: '20px' }}>
                  Close
                </button>
              </div>
            ) : activeForm === 'doubt' ? (
              <form className="contact-modal-form poppins" onSubmit={handleSubmit}>
                <h3 className="contact-modal-title">Ask a Doubt</h3>
                {errorText && <p style={{ color: '#ff4444', fontSize: '13px', marginBottom: '15px' }}>{errorText}</p>}
                <input type="text" name="name" placeholder="Your Name" required className="contact-modal-input" />
                <input type="email" name="email" placeholder="Your Email" required className="contact-modal-input" />
                <select name="topic" required className="contact-modal-input contact-modal-select" defaultValue="">
                  <option value="" disabled>Select Topic...</option>
                  <option value="class-12">Class 12</option>
                  <option value="btech">BTech</option>
                  <option value="cuet">CUET</option>
                </select>
                <textarea name="message" placeholder="Describe your doubt..." required className="contact-modal-input contact-modal-textarea" rows="4"></textarea>
                <button type="submit" className="contact-modal-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            ) : activeForm === 'collab' ? (
              <form className="contact-modal-form poppins" onSubmit={handleSubmit}>
                <h3 className="contact-modal-title">Proposal / Suggestion</h3>
                {errorText && <p style={{ color: '#ff4444', fontSize: '13px', marginBottom: '15px' }}>{errorText}</p>}
                <input type="text" name="name" placeholder="Your Name" required className="contact-modal-input" />
                <input type="email" name="email" placeholder="Your Email" required className="contact-modal-input" />
                <input type="url" name="link" placeholder="Channel / Company Link" required className="contact-modal-input" />
                <select name="proposal_type" required className="contact-modal-input contact-modal-select" defaultValue="">
                  <option value="" disabled>Proposal Type...</option>
                  <option value="content">Content Idea</option>
                  <option value="brand">Brand Collaboration</option>
                </select>
                <textarea name="message" placeholder="Brief Details..." required className="contact-modal-input contact-modal-textarea" rows="4"></textarea>
                <button type="submit" className="contact-modal-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Submit Proposal'}
                </button>
              </form>
            ) : activeForm === 'privacy' ? (
              <div className="contact-modal-form poppins" style={{ padding: '30px', textAlign: 'left', maxHeight: '75vh', overflowY: 'auto' }}>
                <h3 className="contact-modal-title" style={{ marginBottom: '20px', textAlign: 'left', color: '#ffffff' }}>Privacy Policy</h3>
                
                <p style={{ marginBottom: '20px', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                  We respect your privacy and are committed to protecting your personal information. This page explains what data we collect and how we use it.
                </p>

                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>Information We Collect</h4>
                <p style={{ marginBottom: '20px', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                  We may collect basic information such as your name, email address, and any message you send through the contact form. We may also collect basic usage data such as how you interact with the website to improve your experience.
                </p>

                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>How We Use Your Information</h4>
                <p style={{ marginBottom: '20px', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                  We use your information to respond to your queries, improve our content, and enhance your learning experience. We do not use your data for anything unrelated to your interaction with the platform.
                </p>

                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>Third-Party Services</h4>
                <p style={{ marginBottom: '20px', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                  Our website may use third-party platforms such as YouTube for video content and analytics tools to understand user behavior. These platforms may collect basic usage data as per their own policies.
                </p>

                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>Data Protection</h4>
                <p style={{ marginBottom: '20px', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                  We take reasonable steps to protect your data and ensure it is handled securely. We do not sell, trade, or misuse your personal information.
                </p>
                
                <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ fontSize: '15px', color: '#ffffff', fontWeight: '500', margin: 0, textAlign: 'center' }}>
                    We don’t spam. We don’t sell your data. We just use it to make learning better.
                  </p>
                </div>

                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>Contact Us</h4>
                <p style={{ marginBottom: '30px', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                  If you have any questions regarding this Privacy Policy, you can contact us at: <strong>avacademyedu@gmail.com</strong>
                </p>
              </div>
            ) : activeForm === 'terms' ? (
              <div className="contact-modal-form poppins" style={{ padding: '30px', textAlign: 'left', maxHeight: '75vh', overflowY: 'auto' }}>
                <h3 className="contact-modal-title" style={{ marginBottom: '20px', textAlign: 'left', color: '#ffffff' }}>Terms & Conditions</h3>
                
                <p style={{ marginBottom: '20px', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                  By accessing and using AV Academy, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
                </p>

                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>Use of Content</h4>
                <p style={{ marginBottom: '20px', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                  All content provided on this website, including videos, notes, and resources, is for educational purposes only. You may not copy, reproduce, or distribute content without permission.
                </p>

                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>User Responsibility</h4>
                <p style={{ marginBottom: '20px', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                  You agree to use this website responsibly and not misuse any content or features. Any misuse may result in restricted access.
                </p>

                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>Accuracy of Information</h4>
                <p style={{ marginBottom: '20px', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                  We strive to provide accurate and updated content, but we do not guarantee that all information is always complete or error-free.
                </p>

                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>External Links</h4>
                <p style={{ marginBottom: '20px', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                  Our website may contain links to third-party platforms such as YouTube. We are not responsible for the content or policies of these external sites.
                </p>

                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>Limitation of Liability</h4>
                <p style={{ marginBottom: '20px', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                  AV Academy is not liable for any loss or damage resulting from the use of this website or reliance on its content.
                </p>
                
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>Changes to Terms</h4>
                <p style={{ marginBottom: '20px', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                  We may update these terms from time to time. Continued use of the website means you accept any updates.
                </p>

                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>Contact Us</h4>
                <p style={{ marginBottom: '30px', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                  For any questions regarding these Terms & Conditions, contact: <strong>avacademyedu@gmail.com</strong>
                </p>
              </div>
            ) : null}

          </div>
        </div>
      )}

      {/* --- SLEEK HORIZONTAL FOOTER (Squeezed Base) --- */}
      <div className="contact-p__footer-wrapper">
        <div className="contact-p__footer-inner">
          <div className="contact-f__ribbon">

            <div className="contact-f__brand">
              <span className="contact-f__brand-title">AV Academy</span>
              <span className="contact-f__brand-subtitle">Making maths simple, clear and scoring.</span>
            </div>

            <ul className="contact-f__list-horizontal">
              <li>
                <a href="mailto:avacademyedu@gmail.com" className="contact-f__item" data-hover>
                  <span className="contact-f__icon"><EnvelopeIcon /></span>
                  <span className="contact-f__text">avacademyedu@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@AVAcademy-f9o" target="_blank" rel="noopener noreferrer" className="contact-f__item" data-hover>
                  <span className="contact-f__icon"><PlayIcon /></span>
                  <span className="contact-f__text">YouTube</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/avani-sehgal-av27062" target="_blank" rel="noopener noreferrer" className="contact-f__item" data-hover>
                  <span className="contact-f__icon"><LinkedInIcon /></span>
                  <span className="contact-f__text">LinkedIn</span>
                </a>
              </li>
              <li>
                <div className="contact-f__item contact-f__item--static">
                  <span className="contact-f__icon"><LocationIcon /></span>
                  <span className="contact-f__text">New Delhi</span>
                </div>
              </li>
            </ul>

            <div className="contact-f__copy-block">
              <span className="contact-f__copy">© 2026 AV Academy.</span>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  className="contact-f__privacy" 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={(e) => { e.preventDefault(); openForm('terms'); }}
                  data-hover
                >
                  Terms
                </button>
                <button 
                  className="contact-f__privacy" 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={(e) => { e.preventDefault(); openForm('privacy'); }}
                  data-hover
                >
                  Privacy
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}
