import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import './Quiz.css';/**
 * Quiz component — pure test interface.
 * All result rendering is now handled by QuizController → QuizAnalysis.
 *
 * Props:
 *   onSubmit({ answers, timeTaken, attemptNumber })  — called on submit
 *   forceSubmit   boolean — set true to trigger forced submission
 *   reviewMode    boolean — start in read-only review mode
 *   reviewAnswers {}      — pre-populated answers for review mode
 *   onBackToAnalysis()    — called from review mode back button
 */
export default function Quiz({
  onSubmit,
  forceSubmit = false,
  reviewMode = false,
  reviewAnswers = {},
  onBackToAnalysis,
  quizData = [],
  testId = 'default',
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(reviewMode ? reviewAnswers : {});
  const [timeLeft, setTimeLeft] = useState(50 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReviewMode] = useState(reviewMode);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [timeLogs, setTimeLogs] = useState({});
  const [showGridMobile, setShowGridMobile] = useState(false);

  // Chrome back button support in review mode
  useEffect(() => {
    if (!isReviewMode) return;
    const handlePopState = () => onBackToAnalysis?.();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isReviewMode, onBackToAnalysis]);

  // Countdown timer & Per-Question timer
  useEffect(() => {
    if (isSubmitted || isReviewMode) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const timer = setInterval(() => {
      setTimeLeft(p => p - 1);
      setTimeLogs(prev => ({
        ...prev,
        [currentQuestionIndex]: (prev[currentQuestionIndex] || 0) + 1
      }));
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isSubmitted, isReviewMode, currentQuestionIndex]);

  // External force-submit trigger
  useEffect(() => {
    if (forceSubmit && !isSubmitted) handleSubmit();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceSubmit]);

  const handleSubmit = () => {
    if (isSubmitted) return;
    const prevAttempts = parseInt(localStorage.getItem(`${testId}_quiz_attempts`) || '0', 10);
    const newAttempt = prevAttempts + 1;
    localStorage.setItem(`${testId}_quiz_attempts`, newAttempt.toString());
    setAttemptNumber(newAttempt);
    setIsSubmitted(true);
    const timeTaken = (50 * 60) - timeLeft;
    onSubmit?.({ answers, timeTaken, attemptNumber: newAttempt, timeLogs });
  };

  const handleOptionSelect = (option) => {
    if (isReviewMode) return;
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1)
      setCurrentQuestionIndex(p => p + 1);
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0)
      setCurrentQuestionIndex(p => p - 1);
  };

  const jumpToQuestion = (index) => setCurrentQuestionIndex(index);

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // After submit, show a brief "Submitting…" state while QuizController transitions
  if (isSubmitted && !isReviewMode) {
    return (
      <div className="quiz-overlay" onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <svg style={{ animation: 'spin 0.9s linear infinite', marginBottom: 16 }} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" />
          </svg>
          <p style={{ fontSize: '1.1rem', color: '#888' }}>Submitting your test…</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];
  const isCorrect = isReviewMode && selectedAnswer &&
    selectedAnswer.charAt(0) === currentQuestion.answer.charAt(0);

  return (
    <div className="quiz-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="quiz-container">

        {/* Header */}
        <header className="quiz-header">
          <div className="quiz-title-section">
            <h2>Probability (CUET)</h2>
            <span className="quiz-badge">{isReviewMode ? 'Review Mode' : 'Live Test'}</span>
          </div>
          <div className="quiz-header-actions">
            {!isReviewMode && (
              <div className={`quiz-timer ${timeLeft < 300 ? 'warning' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {formatTime(timeLeft)}
              </div>
            )}
            {isReviewMode && (
              <button
                className="nav-btn"
                onClick={() => {
                  onBackToAnalysis?.();
                }}
                style={{ fontSize: '0.9rem', padding: '8px 16px' }}
              >
                ← Back to Analysis
              </button>
            )}
          </div>
        </header>

        {/* Main content */}
        <div className="quiz-layout">
          <main className="quiz-main-panel">

            <div className="question-header">
              {isReviewMode && (
                <span className={`status-badge ${selectedAnswer ? (isCorrect ? 'correct' : 'incorrect') : 'unanswered'}`}>
                  {selectedAnswer ? (isCorrect ? 'Correct ✓' : 'Incorrect ✗') : 'Not Attempted'} 
                  <span style={{marginLeft: '10px', opacity: 0.8}}>⏱️ {(reviewAnswers.timeLogs && reviewAnswers.timeLogs[currentQuestionIndex]) || 0}s</span>
                </span>
              )}
            </div>

            <div className="current-question-header">
              <h3>Question {currentQuestionIndex + 1} of {quizData.length}</h3>
            </div>
            <div className="question-text">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {currentQuestion.question}
              </ReactMarkdown>
            </div>

            <div className="options-grid">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                let cls = 'option-card ';
                if (isReviewMode) {
                  const isThisCorrect = option.charAt(0) === currentQuestion.answer.charAt(0);
                  if (isThisCorrect) cls += 'correct-option ';
                  else if (isSelected && !isThisCorrect) cls += 'wrong-option ';
                  else cls += 'disabled-option ';
                } else {
                  if (isSelected) cls += 'selected ';
                }
                return (
                  <button
                    key={idx}
                    className={cls}
                    onClick={() => handleOptionSelect(option)}
                    disabled={isReviewMode}
                  >
                    <div className="option-content">
                      <span className="option-letter">{option.charAt(0)}</span>
                      <span className="option-text">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {option.slice(3)}
                        </ReactMarkdown>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {isReviewMode && (
              <div className="explanation-box">
                <h4>Explanation:</h4>
                <div className="explanation-text">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {currentQuestion.explanation}
                  </ReactMarkdown>
                </div>
                {!selectedAnswer && <p className="missed-note">Correct Answer: {currentQuestion.answer}</p>}
              </div>
            )}

            <div className="quiz-navigation">
              <button
                className="nav-btn prev"
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Previous
              </button>

              {currentQuestionIndex < quizData.length - 1 ? (
                <button className="nav-btn next" onClick={handleNext}>
                  Next
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ) : (
                !isReviewMode ? (
                  <button className="nav-btn submit-btn" onClick={handleSubmit}>
                    Submit Test
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </button>
                ) : (
                  <button className="nav-btn submit-btn" onClick={() => {
                    window.history.back();
                    onBackToAnalysis?.();
                  }}>
                    Back to Analysis
                  </button>
                )
              )}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="quiz-sidebar">
            <div className="sidebar-header-mobile">
              <h4 className="sidebar-title">Question Grid</h4>
              <button className="grid-toggle-btn" onClick={() => setShowGridMobile(!showGridMobile)}>
                {showGridMobile ? 'Hide Grid ▲' : 'View Question Grid ▼'}
              </button>
            </div>
            <div className={`question-grid ${showGridMobile ? 'show' : ''}`}>
              {quizData.map((q, idx) => {
                let cls = 'grid-item ';
                if (idx === currentQuestionIndex) cls += 'active ';
                if (isReviewMode) {
                  const sel = answers[idx];
                  if (!sel) cls += 'unanswered ';
                  else cls += sel.charAt(0) === q.answer.charAt(0) ? 'correct ' : 'wrong ';
                } else {
                  if (answers[idx]) cls += 'answered ';
                }
                return (
                  <button key={idx} className={cls} onClick={() => jumpToQuestion(idx)}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {!isReviewMode && (
              <button className="sidebar-submit-btn" onClick={handleSubmit}>
                Submit Test
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
