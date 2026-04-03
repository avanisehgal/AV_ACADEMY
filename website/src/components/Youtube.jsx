import React, { useRef, useState } from 'react';
import './Youtube.css';

export default function Youtube() {
  const hubRef = useRef(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleVideoClick = (url, fallbackText) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setToastMessage(fallbackText || 'Coming Soon');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Structured API Data for Streamer Rows (16:9)
  const streamData = [
    {
      id: "r1",
      number: "01",
      title: "Class 12 Mathematics",
      subtext: "Chapter-wise mastery. Complete syllabus breakdown.",
      videos: [
        { img: "https://img.youtube.com/vi/FIpJrVsDBms/hqdefault.jpg", title: "Application of Derivatives", views: "1K Views", url: "https://youtu.be/FIpJrVsDBms?si=JygMtEIbB9jvExnI" },
        { img: "https://img.youtube.com/vi/NJ9wcG9tZR0/hqdefault.jpg", title: "Integration - Class 2", views: "947 Views", url: "https://youtu.be/NJ9wcG9tZR0?si=ojrqClcWCAYiA5HY" },
        { img: "https://img.youtube.com/vi/E4VaTWRhQPg/hqdefault.jpg", title: "Integration - Class 5", views: "756 Views", url: "https://youtu.be/E4VaTWRhQPg?si=jYoePcYPWieuYAlT" },
        { img: "https://img.youtube.com/vi/V8JyZl0Xwbs/hqdefault.jpg", title: "Continuity & Differentiability", views: "752 Views", url: "https://youtu.be/V8JyZl0Xwbs?si=DgqTtdzam8oDor2G" },
        { img: "https://img.youtube.com/vi/TKn4gFmjkoI/hqdefault.jpg", title: "Integration - Class 3", views: "729 Views", url: "https://youtu.be/TKn4gFmjkoI?si=k0qESGM0zaq2nOY4" }
      ]
    },
    {
      id: "r2",
      number: "02",
      title: "CUET 21 Days Series",
      subtext: "Starting in 1 week. CUET prep begins soon.",
      videos: [
        { img: "https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Coming Soon", views: "CUET 2026", url: null, fallbackText: "Videos dropping soon" },
        { img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800", title: "Coming Soon", views: "CUET 2026", url: null, fallbackText: "Videos dropping soon" },
        { img: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=800", title: "Coming Soon", views: "CUET 2026", url: null, fallbackText: "Videos dropping soon" },
        { img: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&q=80&w=800", title: "Coming Soon", views: "CUET 2026", url: null, fallbackText: "Videos dropping soon" },
        { img: "https://images.pexels.com/photos/714698/pexels-photo-714698.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Coming Soon", views: "CUET 2026", url: null, fallbackText: "Videos dropping soon" }
      ]
    },
    {
      id: "r3",
      number: "03",
      title: "BTech Mathematics",
      subtext: "Advanced mathematics series in progress. Launching soon.",
      muted: true,
      videos: [
        { img: "https://images.pexels.com/photos/714698/pexels-photo-714698.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Coming Soon", views: "BTech Sem 1", url: null, fallbackText: "Content under development" },
        { img: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&q=80&w=800", title: "Coming Soon", views: "BTech Sem 1", url: null, fallbackText: "Content under development" },
        { img: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=800", title: "Coming Soon", views: "BTech Sem 2", url: null, fallbackText: "Content under development" },
        { img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800", title: "Coming Soon", views: "BTech Sem 2", url: null, fallbackText: "Content under development" },
        { img: "https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Coming Soon", views: "BTech Sem 3", url: null, fallbackText: "Content under development" }
      ]
    }
  ];

  // API Data for Shorts (9:16)
  const shortsData = [
    { id: "s1", img: "https://img.youtube.com/vi/OaKsnIY-0BA/maxresdefault.jpg", title: "Score Booster Trick", views: "1.6K Views", url: "https://youtube.com/shorts/OaKsnIY-0BA?si=_VtafbUtfD-Z4qqg" },
    { id: "s2", img: "https://img.youtube.com/vi/hteU4F6T19s/maxresdefault.jpg", title: "Score 95+ in Maths", views: "1.1K Views", url: "https://youtube.com/shorts/hteU4F6T19s?si=CiKcVjtvyLSH6V8q" },
    { id: "s3", img: "https://img.youtube.com/vi/TXgvzQNOLmw/maxresdefault.jpg", title: "Probability in 120sec", views: "296 Views", url: "https://youtube.com/shorts/TXgvzQNOLmw?si=sPMCCXKTRiX1IA2y" },
    { id: "s4", img: "https://img.youtube.com/vi/QEUMOYqMsUU/maxresdefault.jpg", title: "Target 100 in Boards", views: "736 Views", url: "https://youtube.com/shorts/QEUMOYqMsUU?si=aH8KE2A_631YAxwi" },
    { id: "s5", img: "https://img.youtube.com/vi/xUUqi0HkJrw/maxresdefault.jpg", title: "Class 12 Board Exam OVER?", views: "975 Views", url: "https://youtube.com/shorts/xUUqi0HkJrw?si=mVurtkFqcXZqQj5h" }
  ];

  const PlayIcon = () => (
    <div className="yt-play-icon">
      <svg viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );

  return (
    <section className="youtube-hub" ref={hubRef} id="youtube">
      
      {/* 0. Section Separator */}
      <div className="yt-identifier reveal">
        <div className="yt-id-line"></div>
        <div className="yt-id-content">
          <span className="yt-id-desc">— Free accessible victories</span>
        </div>
      </div>

      {/* 1. Hero / Hook */}
      <div className="yt-hero">
        <h2 className="yt-headline reveal">Learn. Watch.<span className="yt-headline-break"> Understand. Repeat.</span></h2>
        <p className="yt-subtext reveal">Simplifying complex variables into accessible victories. Maths, but make it easy.</p>
      </div>

      {/* 2. Dynamic Content Rows */}
      <div className="yt-streamer-section">
        {streamData.map((row) => (
          <div className="yt-row-container" key={row.id}>
            <div className="yt-row-header reveal">
              <div className="yt-row-num">{row.number}</div>
              <div className="yt-row-title-block">
                <h3 className="yt-row-title">{row.title}</h3>
                <span className="yt-row-subtext">{row.subtext}</span>
              </div>
            </div>
            
            <div className="yt-carousel">
              {row.videos.map((vid, idx) => (
                <div 
                  className={`yt-card reveal ${row.muted ? 'muted' : ''}`} 
                  key={idx} 
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                  onClick={() => handleVideoClick(vid.url, vid.fallbackText)}
                >
                  <div className="yt-thumb-wrapper">
                    <img src={vid.img} alt={vid.title} loading="lazy" />
                    <div className="yt-play-overlay">
                      <PlayIcon />
                    </div>
                  </div>
                  <h4 className="yt-card-title">{vid.title}</h4>
                  <div className="yt-vid-stats">
                    <span>{vid.views}</span> • <span>{vid.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Shorts Breakout */}
      <div className="yt-shorts-section">
        <div className="yt-shorts-header reveal">
          <h2 className="yt-shorts-title">Quick concepts.<br/><span style={{ whiteSpace: 'nowrap' }}>Faster understanding.</span></h2>
          <p className="yt-shorts-subtext">Scroll less. Learn more. Perfect for revision on the go.</p>
        </div>
        
        <div className="yt-shorts-carousel">
          {shortsData.map((short, idx) => (
            <div 
              className="yt-card yt-short-card-wrap reveal" 
              key={short.id} 
              style={{ transitionDelay: `${idx * 0.1}s` }}
              onClick={() => handleVideoClick(short.url)}
            >
              <div className="yt-short-thumb">
                <img src={short.img} alt={short.title} loading="lazy" />
                <div className="yt-play-overlay">
                  <PlayIcon />
                </div>
              </div>
              <h4 className="yt-card-title">{short.title}</h4>
              <div className="yt-vid-stats">
                <span>{short.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Why YouTube? Value Prop Grid */}
      <div className="yt-value-grid-wrap">
        <div className="yt-value-grid">
          <div className="yt-value-card reveal">
            <div className="yt-value-card-header">
              <div className="yt-value-icon">
                {/* Focus Icon Base */}
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/></svg>
              </div>
              <h4 className="yt-value-title">Short & Focused</h4>
            </div>
            <p className="yt-value-desc">No filler. Just high-density learning engineered for maximum retention in minimum time.</p>
          </div>
          
          <div className="yt-value-card reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="yt-value-card-header">
              <div className="yt-value-icon">
                {/* Clarity Base */}
                <svg viewBox="0 0 24 24"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
              </div>
              <h4 className="yt-value-title">Concept Clarity</h4>
            </div>
            <p className="yt-value-desc">Stripping away complex terminology to show you the architectural logic underneath every theorem.</p>
          </div>

          <div className="yt-value-card reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="yt-value-card-header">
              <div className="yt-value-icon">
                {/* Follow Base */}
                <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/><path d="M19 12h-9"/></svg>
              </div>
              <h4 className="yt-value-title">Easy-to-Follow</h4>
            </div>
            <p className="yt-value-desc">Visual stepwise solutions mapping exactly how to approach, deconstruct, and solve exams.</p>
          </div>

          <div className="yt-value-card reveal" style={{ transitionDelay: '0.3s' }}>
            <div className="yt-value-card-header">
              <div className="yt-value-icon">
                {/* Pace Base */}
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h4 className="yt-value-title">Learn at your Pace</h4>
            </div>
            <p className="yt-value-desc">Pause, rewind, and master. Your personal mathematics library accessible instantaneously anywhere.</p>
          </div>
        </div>
      </div>

      {/* 5. CTA Footer */}
      <div className="yt-cta-section reveal">
        <div className="yt-cta-box">
          <h2 className="yt-cta-text">Want structured learning?<br/>Explore chapters organized for you.</h2>
          <button 
            className="yt-cta-btn"
            onClick={() => window.open('https://www.youtube.com/@AVAcademy-f9o', '_blank')}
          >
            Go to Chapters
          </button>
          <span className="yt-cta-tagline">One video closer to clarity.</span>
        </div>
      </div>

      {toastMessage && (
        <div className="yt-toast">
          {toastMessage}
        </div>
      )}
    </section>
  );
}
