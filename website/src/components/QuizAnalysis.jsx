import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../utils/gasService';
import './Quiz.css';
import './QuizController.css';

const PDF_URL = 'https://drive.google.com/file/d/1JqAKPYUDERy9N_5Y7gK1D6dQelYt36VB/view?usp=sharing';

const CHAPTER_VERDICTS = {
  relations_functions: {
    overall: "Moderate (CUET Standard) - Focuses heavily on NCERT-based definitions and standard results. Students should solve these in under 45–60 seconds.",
    easy: "40%: Direct formula-based or definition-based questions (Domain, Range, Types of Relations). Bank time here.",
    moderate: "50%: Requires checking logical properties like reflexivity or composition calculations. Selection zone.",
    hard: "10%: Tricky equivalence classes and abstract mappings."
  },
  inverse_trigonometry: {
    overall: "Formula Intensive - Emphasizes domain/range bounds and principal values.",
    easy: "30%: Direct evaluation of principal values.",
    moderate: "50%: Composition of trig functions and solving equations.",
    hard: "20%: Substitutions and calculus-preparatory transformations."
  },
  matrices: {
    overall: "Calculative & Property-Based - Blends arithmetic speed with matrix algebra properties.",
    easy: "40%: Order of matrices, basic addition/multiplication.",
    moderate: "40%: Symmetric/Skew-symmetric, algebraic manipulation.",
    hard: "20%: Pattern recognition in higher powers of matrices."
  },
  determinants: {
    overall: "Moderate to Lengthy - Heavily tests properties to avoid raw expansions.",
    easy: "30%: Simple 2x2 and 3x3 evaluation. Area of triangles.",
    moderate: "50%: Adjoint properties, inverse conditions, and system of equations.",
    hard: "20%: Tricky property applications minimizing calculation."
  },
  probability: {
    overall: "Moderate - A perfect reflection of actual CUET difficulty focusing on Conceptual Speed.",
    easy: "30%: Foundation & Formula Recall (Direct application of P(A|B) and multiplication rules).",
    moderate: "50%: Application & Logic Traps (Independent vs. Mutually Exclusive and Mean/Variance).",
    hard: "20%: Posterior Probability & Rank-Makers (Bayes' Theorem word problems)."
  },
  default: {
    overall: "Standard CUET difficulty strictly adhering to NCERT patterns and concepts.",
    easy: "30%: Foundations: Direct formula applications.",
    moderate: "50%: Core Syllabus: Multi-step calculations testing clarity.",
    hard: "20%: Advanced Application: Time-consuming analytical logic traps."
  }
};

export default function QuizAnalysis({ testResult, userProfile, onClose, onReview, quizData = [], testId = 'probability' }) {
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLb, setLoadingLb] = useState(true);
  const [showLbModal, setShowLbModal] = useState(false);

  useEffect(() => {
    if (testResult && showLbModal && leaderboard.length === 0) {
       fetchLeaderboard().then(res => {
         if (res && res.ok) setLeaderboard(res.data || []);
         setLoadingLb(false);
       });
    }
  }, [testResult, showLbModal, leaderboard.length]);

  if (!testResult) return null;

  const { answers = {}, timeTaken = 0, attemptNumber = 1, violations = 0, status = 'submitted' } = testResult;
  const isTerminated = status === 'terminated';
  const isUnfair = !isTerminated && (status === 'unfair' || timeTaken < 1500); // 25 min = 1500s

  // Score calculation
  let correctCount = 0, wrongCount = 0, unattemptedCount = 0;
  quizData.forEach((q, i) => {
    const sel = answers[i];
    if (!sel) unattemptedCount++;
    else if (sel.charAt(0) === q.answer.charAt(0)) correctCount++;
    else wrongCount++;
  });
  
  // CUET Scale: +5 Correct, -1 Incorrect
  const cuetMarks = (correctCount * 5) - (wrongCount * 1);
  const maxCuetMarks = 40 * 5; // 200

  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;
  const timeStr = `${mins}m ${secs}s`;

  let verdictTitle = '', verdictDesc = '', verdictClass = '', miniVerdict = '';
  // Convert benchmarks to CUET scale mapping (35/40 was ~175/200, 28/40 was ~140/200)
  if (cuetMarks >= 175) {
    verdictTitle = 'Exceptional ( > 175 ) 🏆';
    verdictDesc = 'You are ready for a 100-percentile score and have mastered probability. Amazing work! Let\'s conquer the actual exam!';
    verdictClass = 'exceptional'; miniVerdict = 'Exceptional 🏆';
  } else if (cuetMarks >= 140) {
    verdictTitle = 'Very Good ( 140–174 ) 🌟';
    verdictDesc = 'Some improvement needed. Likely losing marks on Bayes\' Theorem or arithmetic in Variance. You can do it — just a little more practice!';
    verdictClass = 'good'; miniVerdict = 'Very Good 🌟';
  } else {
    verdictTitle = 'Needs Revision ( < 140 ) 📚';
    verdictDesc = 'Poor performance this time — better luck next time! Try harder and you\'ll get there. Revisit Independent vs. Exclusive events and notation before re-attempting.';
    verdictClass = 'needs-rev'; miniVerdict = 'Needs Revision 📚';
  }

  return (
    <>
      <div className="quiz-result-container" onClick={(e) => e.stopPropagation()} style={{ overflowX: 'hidden' }}>

        {/* Header */}
        <header className="result-header">
          <h2>{isTerminated ? '🚫 Test Terminated' : 'Test Analysis'}</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="nav-btn"
              onClick={onClose}
              style={{ fontSize: '0.9rem', padding: '8px 16px', background: 'rgba(255,255,255,0.08)' }}
            >
              Back to Course
            </button>
            <button className="quiz-close-btn" onClick={onClose} title="Exit">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        <div className="result-content scrollable">

          {/* Terminated banner */}
          {isTerminated && (
            <div className="unfair-warning" style={{ background: 'rgba(239,68,68,0.12)', marginBottom: 24 }}>
              <h3>🚫 Test Terminated Due to Academic Violation</h3>
              <p>You were removed from the test after 3 window-switch violations. This result has been flagged and will not be counted.</p>
            </div>
          )}

          {/* Unfair means warning */}
          {isUnfair && (
            <div className="unfair-warning">
              <h3>⚠️ WARNING: Suspicious Submission Time</h3>
              <p>You completed a 50-minute test in under 25 minutes ({timeStr}). Unfair means may have been used. This result may not be counted.</p>
            </div>
          )}

          {/* Meta badges */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
            <div className="submission-time-badge" style={{ marginBottom: 0, fontSize: '0.95rem' }}>
              <strong>TIME TAKEN:</strong> <span style={{ fontWeight: 800, color: '#fff' }}>{timeStr}</span>
            </div>
            <div className="submission-time-badge" style={{ marginBottom: 0, background: 'rgba(56,189,248,0.12)', color: '#38bdf8', borderColor: 'rgba(56,189,248,0.3)', fontSize: '0.95rem' }}>
              <strong>ATTEMPT:</strong> <span style={{ fontWeight: 800, color: '#fff' }}>#{attemptNumber}</span>
            </div>
            {violations > 0 && (
              <div className="submission-time-badge" style={{ marginBottom: 0, background: 'rgba(239,68,68,0.12)', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)', fontSize: '0.95rem' }}>
                <strong>VIOLATIONS:</strong> <span style={{ fontWeight: 800, color: '#fff' }}>{violations}/3</span>
              </div>
            )}
          </div>

          {/* Score circle */}
          <div className="score-hero">
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
              <div className="score-circle" style={{ marginBottom: 0 }}>
                <span className="score-number">{cuetMarks}</span>
                <span className="score-max">/ {maxCuetMarks}</span>
              </div>
              {!isTerminated && (
                <div style={{
                  position: 'absolute', bottom: -5, right: -22,
                  background: 'rgba(34,197,94,0.15)', color: '#4ade80',
                  padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap',
                  backdropFilter: 'blur(10px)', border: '1px solid rgba(34,197,94,0.3)',
                  fontWeight: 'bold', fontSize: '0.85rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transform: 'rotate(-5deg)'
                }}>
                  {miniVerdict}
                </div>
              )}
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
              <div className="stat-card" style={{ cursor: 'pointer', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setShowLbModal(true)}>
                <span className="stat-value">👑</span>
                <span className="stat-label" style={{ color: '#eab308', fontWeight: 600 }}>Check Rank</span>
              </div>
            </div>
          </div>

          <hr className="divider" />


          {/* Verdict */}
          {!isTerminated && (
            <div className={`verdict-box ${verdictClass}`}>
              <h3>Final Verdict: {verdictTitle}</h3>
              <p>{verdictDesc}</p>
            </div>
          )}

          {/* Analysis Breakdown */}
          {!isTerminated && (() => {
            const verdictObj = CHAPTER_VERDICTS[testId] || CHAPTER_VERDICTS['default'];
            return (
              <div className="analysis-breakdown">
                <h3>1. Overall Level</h3>
                <p>{verdictObj.overall}</p>

                <h3>2. Difficulty Breakdown</h3>
                <ul className="breakdown-list">
                  <li>
                    <strong>Easy: Foundation & Formula Recall</strong><br />
                    Focus: {verdictObj.easy}<br />
                    <em>CUET Goal: These are "Time-Savers." Bank time here.</em>
                  </li>
                  <li>
                    <strong>Moderate: Application & Logic</strong><br />
                    Focus: {verdictObj.moderate}<br />
                    <em>CUET Goal: This is the "Selection Zone." Accuracy determines the 95th percentile.</em>
                  </li>
                  <li>
                    <strong>Hard/Tricky: Rank-Makers</strong><br />
                    Focus: {verdictObj.hard}<br />
                    <em>CUET Goal: These are "Rank-Determiners." Need clear step-by-step logic.</em>
                  </li>
                </ul>
              </div>
            );
          })()}

          {/* Actions */}
          {(() => {
            const canAccess = !isUnfair && !isTerminated;
            return (
              <div className="result-actions">

                {/* Review Answers — locked when unfair/terminated */}
                <button
                  className={`action-btn review${canAccess ? '' : ' btn-locked'}`}
                  onClick={canAccess ? onReview : undefined}
                  disabled={!canAccess}
                  title={canAccess ? '' : 'Locked: suspicious submission detected'}
                >
                  {canAccess
                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  }
                  Review Answers
                  {!canAccess && <span className="locked-badge">LOCKED</span>}
                </button>

                {/* Download PDF — locked when unfair/terminated */}
                <button
                  className={`action-btn pdf${canAccess ? '' : ' btn-locked'}`}
                  onClick={canAccess ? () => window.open(PDF_URL, '_blank') : undefined}
                  disabled={!canAccess}
                  title={canAccess ? '' : 'Locked: suspicious submission detected'}
                >
                  {canAccess
                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  }
                  Download PDF
                  {!canAccess && <span className="locked-badge">LOCKED</span>}
                </button>

                {/* Analyse Answers — always available */}
                <button
                  className="action-btn video"
                  onClick={() => showToast('Video Analysis will be uploaded soon!')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  Analyse Answers
                </button>

              </div>
            );
          })()}

          {/* Locked reason notice */}
          {(isUnfair || isTerminated) && (
            <p className="locked-reason">
              🔒 Review Answers &amp; Download PDF are locked due to{' '}
              {isTerminated ? 'test termination from repeated violations' : 'suspicious submission time'}.
            </p>
          )}

        </div>
      </div>

      {toast && <div className="modal-toast">{toast}</div>}

      {/* ── Global Leaderboard Modal ── */}
      {showLbModal && (
        <div className="qc-overlay" onClick={() => setShowLbModal(false)} style={{ zIndex: 1000000 }}>
          <div className="qc-card" style={{ maxWidth: 800, padding: 30 }} onClick={e => e.stopPropagation()}>
            <button className="qc-close-btn" onClick={() => setShowLbModal(false)}>✕</button>
            <div className="qc-leaderboard-container" style={{ marginTop: 0, borderTop: 'none', paddingTop: 0 }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: 24 }}>🌍 Global Leaderboard</h3>
              {loadingLb ? (
                <div className="qc-lb-loading">Fetching live rankings...</div>
              ) : (
                <div className="qc-table-wrapper" style={{ maxHeight: 400 }}>
                  <table className="qc-table">
                    <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                      <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>State</th>
                        <th>Score</th>
                        <th>Time</th>
                        <th>Strikes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.length === 0 ? (
                        <tr><td colSpan="6" style={{textAlign:'center', color:'#888', padding: '40px 0'}}>No results yet</td></tr>
                      ) : (
                        leaderboard.map((u, i) => {
                          const isMe = userProfile && userProfile.email && 
                                       (userProfile.firstName + " " + userProfile.lastName).trim() === u.name;
                          return (
                            <tr key={i} className={isMe ? 'qc-lb-me' : ''}>
                              <td>#{i + 1}</td>
                              <td style={{fontWeight:600}}>{u.name || 'Anonymous'}</td>
                              <td>{u.state || '-'}</td>
                              <td style={{fontWeight:800}}>{u.score}</td>
                              <td>{Math.floor(u.timeTaken/60)}m {u.timeTaken%60}s</td>
                              <td style={{color: u.violations > 0 ? '#ef4444' : 'inherit'}}>
                                {u.violations}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
