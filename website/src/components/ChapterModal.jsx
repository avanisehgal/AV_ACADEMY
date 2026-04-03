import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ChapterModal.css';

const math12Chapters = [
  { 
    id: 1, title: 'Relations & Functions', marks: '6 marks (7.5%)',
    resources: {
      youtube: 'https://www.youtube.com/playlist?list=PLutsOszbYQH2xBI_aUP6300mTpkUMEfdY',
      oneshot: 'https://youtu.be/Oh6Uk2hRPmA?si=YZee6VhoQwi-4nY8',
      formula: 'https://drive.google.com/file/d/1PZiLWsaK9cPtUY1W3C94jJkzxkblpZHl/view?usp=drive_link',
      practice: null, test: null
    }
  },
  { 
    id: 2, title: 'Inverse Trigonometric Functions', marks: '4 marks (5%)',
    resources: {
      youtube: 'https://www.youtube.com/playlist?list=PLutsOszbYQH213qnjjfuyp-OoLBJ6BpDe',
      oneshot: 'https://youtu.be/iGRS6VwbBZI?si=_Fb9XaEVJ7ZJZnvg',
      formula: 'https://drive.google.com/file/d/1N_R55uLi_YugQ1N4m6GHPpn7zlAXk8qS/view?usp=sharing',
      practice: null, test: null
    }
  },
  { 
    id: 3, title: 'Matrices', marks: '6 marks (7.5%)',
    resources: {
      youtube: 'https://www.youtube.com/playlist?list=PLutsOszbYQH3kY_cTfgG8VZboJssAPnbs',
      oneshot: 'https://youtu.be/M0ogxLEAWqQ?si=lgY-X5E-HlENr6vj',
      formula: 'https://drive.google.com/file/d/1ZKem_gudYfVzlNgG8YXAoyQRVagAGUbU/view?usp=sharing',
      practice: 'https://drive.google.com/drive/folders/1xy3T9zpDjW_lfXfra3LrJh4zyP2P7ZHl?usp=sharing', test: null
    }
  },
  { 
    id: 4, title: 'Determinants', marks: '8 marks (10%)',
    resources: {
      youtube: 'https://www.youtube.com/playlist?list=PLutsOszbYQH373xt_j1GiUohkBiij8pb2',
      oneshot: 'https://youtu.be/tMaCG6QBjGA?si=nvbIjXy0MPRK6ObJ',
      formula: 'https://drive.google.com/file/d/1ppyNEn9pwvnRsnJM5CY-pPkzfUJy2W7w/view?usp=sharing',
      practice: 'https://drive.google.com/drive/folders/1nf8pEUWlYYHQMKAcA5zrl1pvgqmJM1FV?usp=sharing', test: null
    }
  },
  { 
    id: 5, title: 'Continuity & Differentiability', marks: '8 marks (10%)',
    resources: {
      youtube: 'https://www.youtube.com/playlist?list=PLutsOszbYQH0CYd6xrdsqT7bHX4HUKKsO',
      oneshot: 'https://youtu.be/kv50k9EqkKs?si=BKKxkI958W46vedc',
      formula: 'https://drive.google.com/file/d/1avbu5l1d9ZNisq9Lh9Lz_0ZPN9H1UJPX/view?usp=sharing',
      practice: null, test: null
    }
  },
  { 
    id: 6, title: 'Applications of Derivatives', marks: '8 marks (10%)',
    resources: {
      youtube: 'https://www.youtube.com/playlist?list=PLutsOszbYQH2MvsKBPW87VyNWi9KY204u',
      oneshot: 'https://youtu.be/c7jYZgVT2Uc?si=I4mnWQA79CqAzmIH',
      formula: 'https://drive.google.com/file/d/1Ft-83RrRhJ0Bd0XXAsJN3YwdS_4wkO71/view?usp=sharing',
      practice: null, test: null
    }
  },
  { 
    id: 7, title: 'Integrals', marks: '8 marks (10%)',
    resources: {
      youtube: 'https://www.youtube.com/playlist?list=PLutsOszbYQH2EGHyQMUZjsBBv7BF1dG7P',
      oneshot: 'https://youtu.be/qRS7ZuZAY9c?si=Yilik7iuIfZ0ELGw',
      formula: 'https://drive.google.com/file/d/1w6rtVI6tSZYWyj1WGR0ESzcsklEhQodf/view?usp=sharing',
      practice: 'https://drive.google.com/drive/folders/1CaIxk_RflpguQ9lidwfy6tqQX7U36vbw?usp=sharing', test: null
    }
  },
  { 
    id: 8, title: 'Applications of Integrals', marks: '8 marks (10%)',
    resources: {
      youtube: 'https://www.youtube.com/playlist?list=PLutsOszbYQH2EGHyQMUZjsBBv7BF1dG7P',
      oneshot: 'https://youtu.be/rJPRYC_f2mk?si=gmutkuXYntKW4djb',
      formula: 'https://drive.google.com/file/d/1w6rtVI6tSZYWyj1WGR0ESzcsklEhQodf/view?usp=sharing',
      practice: null, test: null
    }
  },
  { 
    id: 9, title: 'Differential Equations', marks: '3 marks (3.75%)',
    resources: {
      youtube: null, oneshot: null,
      formula: 'https://drive.google.com/file/d/1mhnd_hValAFGxQhIZdMXrY0m3hDhw6i1/view?usp=sharing',
      practice: null, test: null
    }
  },
  { 
    id: 10, title: 'Vector Algebra', marks: '6 marks (7.5%)',
    resources: {
      youtube: null, oneshot: null,
      formula: 'https://drive.google.com/file/d/1TWvSfIdUJnvKOdXk2DxNG430RY1AKaYD/view?usp=sharing',
      practice: null, test: null
    }
  },
  { 
    id: 11, title: 'Three Dimensional Geometry', marks: '8 marks (10%)',
    resources: {
      youtube: null, oneshot: null,
      formula: 'https://drive.google.com/file/d/1F9jIZtidoaxmx-aeiuzlECSbOjbN5w0r/view?usp=sharing',
      practice: null, test: null
    }
  },
  { 
    id: 12, title: 'Linear Programming', marks: '5 marks (6.25%)',
    resources: {
      youtube: null, oneshot: null,
      formula: 'https://drive.google.com/file/d/1iJROy5jp_8cyubKVTjeFFzcW7ISqV8nD/view?usp=sharing',
      practice: null, test: null
    }
  },
  { 
    id: 13, title: 'Probability', marks: '10 marks (12.5%)',
    resources: {
      youtube: 'https://www.youtube.com/playlist?list=PLutsOszbYQH0Md1zSWkkLzYhLNIJeZSwH',
      oneshot: 'https://youtu.be/0lHFmVB0ADI?si=zB83NAy-H9WafADb',
      formula: 'https://drive.google.com/file/d/1LfiJT5MRUtd5oixTb79SBw6UJlfKglk-/view?usp=sharing',
      practice: null, test: null
    }
  }
];

const cuetMarks = {
  1: '2–3 questions (10–15 marks | 5–7.5%)',
  2: '1–2 questions (5–10 marks | 2.5–5%)',
  3: '3–4 questions (15–20 marks | 7.5–10%)',
  4: '3–4 questions (15–20 marks | 7.5–10%)',
  5: '2–3 questions (10–15 marks | 5–7.5%)',
  6: '3–4 questions (15–20 marks | 7.5–10%)',
  7: '3–4 questions (15–20 marks | 7.5–10%)',
  8: '1–2 questions (5–10 marks | 2.5–5%)',
  9: '2–3 questions (10–15 marks | 5–7.5%)',
  10: '2–3 questions (10–15 marks | 5–7.5%)',
  11: '2–3 questions (10–15 marks | 5–7.5%)',
  12: '1–2 questions (5–10 marks | 2.5–5%)',
  13: '4–5 questions (20–25 marks | 10–12.5%)'
};

const cuetChapters = math12Chapters.map(ch => ({
  ...ch,
  marks: cuetMarks[ch.id] || ch.marks
}));

const btechChapters = [
  { id: 1, title: 'Engineering Calculus', marks: '15 Marks' },
  { id: 2, title: 'Linear Algebra & Matrices', marks: '10 Marks' },
  { id: 3, title: 'Ordinary Differential Equations', marks: '12 Marks' },
  { id: 4, title: 'Complex Variable Theory', marks: '8 Marks' },
  { id: 5, title: 'Vector Calculus', marks: '10 Marks' },
  { id: 6, title: 'Numerical Methods', marks: '15 Marks' },
];

const courseMap = {
  '01': math12Chapters,
  '03': cuetChapters,
  '02': btechChapters
};

export default function ChapterModal({ isOpen, onClose, course }) {
  const [expandedId, setExpandedId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  
  const handleResourceClick = (url, fallbackMessage) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      setToastMessage(fallbackMessage || 'Coming Soon');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Prevent background scrolling when modal is open and reset state gracefully
  useEffect(() => {
    let timer;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      timer = setTimeout(() => {
        setExpandedId(null);
      }, 400); // Wait for fade out to complete before resetting states
    }
    return () => {
      document.body.style.overflow = '';
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  // Reset expanded id if course changes
  useEffect(() => {
    setExpandedId(null);
  }, [course]);

  // Use the mapped chapters based on course.id, default to math 12
  const activeChapters = course ? (courseMap[course.id] || math12Chapters) : math12Chapters;

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Safe fallback
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{course?.title || 'Course Details'}</h2>
            <p className="modal-subtitle">One chapter at a time. Complete Syllabus & Resources.</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-flow-banner">
             <span className="flow-text">Clarity → Practice → Mastery</span>
          </div>
          <div className="chapters-list">
            {activeChapters.map((chapter) => (
              <div 
                key={chapter.id} 
                className={`chapter-item ${expandedId === chapter.id ? 'expanded' : ''}`}
              >
                <div 
                  className="chapter-header" 
                  onClick={() => handleToggle(chapter.id)}
                >
                  <div className="chapter-title-group">
                    <span className="chapter-num">Chapter {chapter.id}</span>
                    <span className="chapter-name">{chapter.title}</span>
                  </div>
                  <div className="chapter-meta">
                    {chapter.marks && <span className="chapter-marks">{chapter.marks}</span>}
                    <svg 
                      className="chapter-chevron" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
                
                <div className="chapter-body">
                  <div className="chapter-body-inner">
                    <p className="chapter-flow-guide">Start with lectures, then revise, then test yourself</p>
                    
                    <div className="resources-grid">
                      <button 
                        className="resource-card video"
                        onClick={() => handleResourceClick(chapter.resources?.youtube, "Playlist is being curated")}
                      >
                        <div className="resource-icon-wrap">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                        </div>
                        <span>Watch Playlist</span>
                      </button>
                      
                      <button 
                        className="resource-card oneshot"
                        onClick={() => handleResourceClick(chapter.resources?.oneshot, "One-Shot coming soon")}
                      >
                        <div className="resource-icon-wrap">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        </div>
                        <span>One-Shot Revision</span>
                      </button>
                      
                      <button 
                        className="resource-card file"
                        onClick={() => handleResourceClick(chapter.resources?.formula, "Formula sheet uploading...")}
                      >
                        <div className="resource-icon-wrap">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <span>View Formula Sheet</span>
                      </button>
                      
                      <button 
                        className="resource-card file"
                        onClick={() => handleResourceClick(chapter.resources?.practice, "Worksheets arriving shortly!")}
                      >
                        <div className="resource-icon-wrap">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                        </div>
                        <span>Practice Worksheets</span>
                      </button>
                      
                      <button 
                        className="resource-card test"
                        onClick={() => handleResourceClick(chapter.resources?.test, "Tests will be added soon!")}
                      >
                        <div className="resource-icon-wrap">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <span>Attempt Test</span>
                      </button>

                      {(!course || course.id === '01') && (
                        <button 
                          className="resource-card file"
                          onClick={() => handleResourceClick(chapter.resources?.notes, "Notes coming soon")}
                        >
                          <div className="resource-icon-wrap">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                          </div>
                          <span>Notes</span>
                        </button>
                      )}

                      {course?.id === '03' && (
                        <button 
                          className="resource-card test"
                          onClick={() => handleResourceClick(chapter.resources?.testAnswers, "Solutions will be available soon.")}
                        >
                          <div className="resource-icon-wrap">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><path d="M10 13l2 2 4-4"/></svg>
                          </div>
                          <span>Test Answers</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {toastMessage && (
        <div className="modal-toast">
          {toastMessage}
        </div>
      )}
    </div>,
    document.body
  );
}
