import React, { useState } from 'react';
import './Quiz.css';

export default function QuizResult({ answers, quizData, timeTaken, attemptNumber, onClose, onReview }) {
  const [toastMessage, setToastMessage] = useState(null);

  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  quizData.forEach((question, index) => {
    const selected = answers[index];
    if (!selected) {
      unattemptedCount++;
    } else if (selected.charAt(0) === question.answer.charAt(0)) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  // Optional: Apply negative marking if required (e.g. CUET gives +5, -1, but request just says score based on marks)
  // We'll just show raw score out of 40 here as typical for small mocks.
  const score = correctCount; 

  const isUnfair = timeTaken < 25 * 60;
  const timeStr = `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`;

  let verdictTitle = "";
  let verdictDesc = "";
  let verdictClass = "";
  let miniVerdict = "";

  if (score > 35) {
    verdictTitle = "Exceptional ( > 35 ) 🏆";
    verdictDesc = "You are ready for a 100-percentile score and have mastered the `boundary conditions` of probability. Amazing work! Let's conquer the actual exam!";
    verdictClass = "exceptional";
    miniVerdict = "Exceptional 🏆";
  } else if (score >= 28) {
    verdictTitle = "Very Good ( 28 - 35 ) 🌟";
    verdictDesc = "Likely losing marks on Section 3 (Bayes') or making arithmetic errors in Section 4 (Variance). Some improvement needed. You can do it! Just a little more improvement needed.";
    verdictClass = "good";
    miniVerdict = "Very Good 🌟";
  } else {
    verdictTitle = "Needs Revision ( < 28 ) 📚";
    verdictDesc = "Poor performance. Better luck next time! Try harder and you will get there! Likely confusing `Independent` with `Exclusive` or struggling with basic notation. Revisit concepts before attempting the distribution problems.";
    verdictClass = "needs-rev";
    miniVerdict = "Needs Revision 📚";
  }

  const handleResourceClick = (url, fallback) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      setToastMessage(fallback);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <>
      <div className="quiz-result-container" onClick={(e) => e.stopPropagation()}>
        
        <header className="result-header">
          <h2>Test Analysis complete.</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="nav-btn" onClick={onClose} style={{ fontSize: '0.9rem', padding: '8px 16px', background: 'rgba(255,255,255,0.1)' }}>
              Back to Course
            </button>
            <button className="quiz-close-btn" onClick={onClose} title="Exit">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </header>

        <div className="result-content scrollable">
          
          {isUnfair && (
            <div className="unfair-warning">
              <h3>⚠️ WARNING: Suspicious Activity Detected ⚠️</h3>
              <p>Unfair means have been used. You completed a 50-minute test in under 25 minutes ({timeStr}). The test result will not be counted.</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div className="submission-time-badge" style={{ marginBottom: '0', fontSize: '1rem' }}>
               <strong>TIME TAKEN:</strong> <span style={{ fontWeight: 800, color: '#fff' }}>{timeStr}</span>
            </div>
            <div className="submission-time-badge" style={{ marginBottom: '0', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)', fontSize: '1rem' }}>
               <strong>ATTEMPT:</strong> <span style={{ fontWeight: 800, color: '#fff' }}>#{attemptNumber}</span>
            </div>
          </div>

          {/* Score showcase */}
          <div className="score-hero">
            <div className="score-circle-wrapper" style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
              <div className="score-circle" style={{ marginBottom: '0' }}>
                <span className="score-number">{score}</span>
                <span className="score-max">/ 40</span>
              </div>
              <div className="score-circle-comment" style={{ position: 'absolute', bottom: '-5px', right: '-20px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '6px 14px', borderRadius: '20px', whiteSpace: 'nowrap', backdropFilter: 'blur(10px)', border: '1px solid rgba(34, 197, 94, 0.3)', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transform: 'rotate(-5deg)' }}>
                {miniVerdict}
              </div>
            </div>
            <div className="score-stats">
              <div className="stat-card">
                <span className="stat-value correct-text">{correctCount}</span>
                <span className="stat-label">Correct</span>
              </div>
              <div className="stat-card">
                <span className="stat-value wrong-text">{wrongCount}</span>
                <span className="stat-label">Incorrect</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{unattemptedCount}</span>
                <span className="stat-label">Skipped</span>
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* Verdict Box */}
          <div className={`verdict-box ${verdictClass}`}>
            <h3>Final Verdict: {verdictTitle}</h3>
            <p>{verdictDesc}</p>
          </div>

          {/* AI Analysis provided in prompt */}
          <div className="analysis-breakdown">
            <h3>1. Overall Level: Moderate</h3>
            <p>This paper is a perfect reflection of the actual CUET difficulty. It avoids extremely long, multi-case permutations and instead focuses on "Conceptual Speed"—questions that can be solved in 45–60 seconds if the student understands the underlying properties.</p>
            
            <h3>2. Difficulty Breakdown</h3>
            <ul className="breakdown-list">
              <li>
                <strong>Easy (30%): Foundation & Formula Recall</strong><br/>
                Focus: Direct application of P(A|B) and multiplication rules.<br/>
                <em>CUET Goal: These are "Time-Savers." Bank time here.</em>
              </li>
              <li>
                <strong>Moderate (50%): Application & Logic Traps</strong><br/>
                Focus: Independent vs. mutually exclusive and Mean/Variance.<br/>
                <em>CUET Goal: This is the "Selection Zone." Accuracy determines the 95th percentile.</em>
              </li>
              <li>
                <strong>Hard/Tricky (20%): Posterior Probability & Rank-Makers</strong><br/>
                Focus: Bayes' Theorem word problems and "at least" logic.<br/>
                <em>CUET Goal: These are the "Rank-Determiners." Need clear step-by-step logic.</em>
              </li>
            </ul>

            <h3>3. Why this is "CUET-Ready"</h3>
            <p><strong>The "Not Defined" Check:</strong> Tests if students realize P(A|B) is only defined when P(B) &gt; 0.</p>
            <p><strong>Posterior Logic:</strong> Bayes' Theorem depth of logic (Machine output, Truth-telling) exactly matches previous years.</p>
            <p><strong>Independence Mastery:</strong> Forces students to distinguish P(A ∩ B) = P(A)P(B) from Mutually Exclusive events.</p>
          </div>

          {/* Actions */}
          <div className="result-actions">
            <button className="action-btn review" onClick={onReview}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Review Answers
            </button>
            <button 
              className="action-btn pdf" 
              onClick={() => handleResourceClick('https://drive.google.com/file/d/1JqAKPYUDERy9N_5Y7gK1D6dQelYt36VB/view?usp=sharing', null)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download PDF
            </button>
            <button 
              className="action-btn video" 
              onClick={() => handleResourceClick(null, "Video Analysis will be uploaded soon!")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
              Analyse Answers
            </button>
          </div>
        </div>
      </div>
      {toastMessage && (
        <div className="modal-toast">
          {toastMessage}
        </div>
      )}
    </>
  );
}
