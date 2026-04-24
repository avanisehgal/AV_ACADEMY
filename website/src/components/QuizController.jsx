import React, { useState, useEffect, useCallback } from 'react';
import QuizAuth from './QuizAuth';
import QuizOnboarding from './QuizOnboarding';
import Quiz from './Quiz';
import QuizProctor from './QuizProctor';
import QuizAnalysis from './QuizAnalysis';
import { submitTestResult, fetchUserResult } from '../utils/gasService';
import { checkTestSubmission, submitToNeon } from '../utils/neonService';
import relations_functions_quiz from '../data/relations_functions_quiz.json';
import inverse_trigonometry_quiz from '../data/inverse_trigonometry_quiz.json';
import matrices_quiz from '../data/matrices_quiz.json';
import determinants_quiz from '../data/determinants_quiz.json';
import continuity_differentiability_quiz from '../data/continuity_differentiability_quiz.json';
import applications_of_derivative_quiz from '../data/applications_of_derivative_quiz.json';
import integrals_quiz from '../data/integrals_quiz.json';
import applications_of_integrals_quiz from '../data/applications_of_integrals_quiz.json';
import differential_equations_quiz from '../data/differential_equations_quiz.json';
import vectors_quiz from '../data/vectors_quiz.json';
import three_dimensional_geometry_quiz from '../data/3_dimensional_geometry_quiz.json';
import lpp_quiz from '../data/lpp_quiz.json';
import probability_quiz from '../data/probability_quiz.json';
import './QuizController.css';

const allQuizzes = {
  relations_functions: relations_functions_quiz,
  inverse_trigonometry: inverse_trigonometry_quiz,
  matrices: matrices_quiz,
  determinants: determinants_quiz,
  continuity_differentiability: continuity_differentiability_quiz,
  applications_of_derivative: applications_of_derivative_quiz,
  integrals: integrals_quiz,
  applications_of_integrals: applications_of_integrals_quiz,
  differential_equations: differential_equations_quiz,
  vectors: vectors_quiz,
  '3_dimensional_geometry': three_dimensional_geometry_quiz,
  lpp: lpp_quiz,
  probability: probability_quiz
};

// ─── Countdown Overlay ───────────────────────────────────────────────────────
function CountdownOverlay({ onFinish }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) { const t = setTimeout(onFinish, 700); return () => clearTimeout(t); }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, onFinish]);

  return (
    <div className="qc-countdown">
      <div className="qc-countdown-circle">
        {count === 0
          ? <span className="qc-go">Go!</span>
          : <span key={count} className="qc-count">{count}</span>
        }
      </div>
      <p>Get ready. The clock starts now.</p>
    </div>
  );
}

// ─── Simple Loading Screen (clean, same feel as countdown) ───────────────────
const LOAD_MSGS = [
  'Saving your answers…',
  'Calculating your score…',
  'Building your analysis…',
  'Almost there…',
];
const TOTAL_DURATION_MS = 4000;

function SimpleLoadingScreen() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [dots, setDots]     = useState('');

  useEffect(() => {
    LOAD_MSGS.forEach((_, i) => {
      if (i === 0) return;
      const t = setTimeout(() => setMsgIdx(i), i * (TOTAL_DURATION_MS / LOAD_MSGS.length));
      return () => clearTimeout(t);
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="qc-loading-wrap">
      <div className="qc-loading-ring">
        <div className="qc-loading-av">AV</div>
      </div>
      <p className="qc-loading-msg" key={msgIdx}>{LOAD_MSGS[msgIdx]}{dots}</p>
      <p className="qc-loading-sub">Please keep this tab open.</p>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Main QuizController ─────────────────────────────────────────────────────
export default function QuizController({ onClose, testId = 'probability' }) {
  const quizData = allQuizzes[testId] || [];
  const [screen, setScreen]                   = useState(null);
  const [userProfile, setUserProfile]         = useState(null);
  const [testResult, setTestResult]           = useState(null);
  const [forceSubmitQuiz, setForceSubmitQuiz] = useState(false);

  // Lock body scroll for the entire duration QuizController is mounted
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Resolve initial screen from localStorage + silently restore testResult from Neon
  useEffect(() => {
    const raw = localStorage.getItem('av_user_session');
    if (raw) {
      try {
        const profile = JSON.parse(raw);
        setUserProfile(profile);

        // Restore cached testResult instantly (no flash)
        const cachedResult = localStorage.getItem(`av_last_neon_result_${testId}`);
        if (cachedResult) {
          try { setTestResult(JSON.parse(cachedResult)); } catch(_) {}
        }

        setScreen('welcome');

        // Then silently refresh from Neon in background
        checkTestSubmission(profile.email, testId + '_test').then(neonCheck => {
          if (neonCheck.exists && neonCheck.score_data) {
            const sd = neonCheck.score_data;
            const resolved = sd.latest || (sd.attempts && sd.attempts[sd.attempts.length - 1]) || sd;
            localStorage.setItem(`av_last_neon_result_${testId}`, JSON.stringify(resolved));
            setTestResult(resolved);
          }
        }).catch(() => {});
        return;
      } catch (_) {}
    }
    setScreen('auth');
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = async (email, password) => {
    const raw = localStorage.getItem('av_user_session');
    
    const processLogin = async (profileObj, skipOnboarding = false) => {
      setScreen('loading-auth');
      
      const [dbResult, neonCheck] = await Promise.all([
        fetchUserResult(email),
        checkTestSubmission(email, testId + '_test')
      ]);

      let fullProfile = { ...profileObj };
      let hasData = false;

      // Merge data from GAS if available
      if (dbResult && dbResult.result) {
        const gasProfile = dbResult.result;
        fullProfile = {
          ...fullProfile,
          firstName: fullProfile.firstName || gasProfile.firstName || '',
          lastName: fullProfile.lastName || gasProfile.lastName || '',
          state: fullProfile.state || gasProfile.state || '',
          age: fullProfile.age || gasProfile.age || ''
        };
        hasData = true;
      }
      
      if (neonCheck.exists) {
        const sd = neonCheck.score_data;
        const resolved = sd.latest || (sd.attempts && sd.attempts[sd.attempts.length - 1]) || sd;
        
        // Merge data from Neon if available and not already set
        fullProfile = {
          ...fullProfile,
          firstName: fullProfile.firstName || resolved.firstName || '',
          lastName: fullProfile.lastName || resolved.lastName || '',
          state: fullProfile.state || resolved.state || '',
          age: fullProfile.age || resolved.age || ''
        };
        hasData = true;

        localStorage.setItem(`av_last_neon_result_${testId}`, JSON.stringify({ ...resolved, saved: true }));
        setTestResult(resolved);
      }

      setUserProfile(fullProfile);
      
      // Persist recovered data locally so it survives refreshes
      if (hasData) {
        localStorage.setItem('av_user_session', JSON.stringify(fullProfile));
      }

      if (neonCheck.exists) {
        setScreen('welcome');
        return null;
      }
      
      setScreen(skipOnboarding ? 'welcome' : 'onboarding');
      return null;
    };

    if (raw) {
      try {
        const profile = JSON.parse(raw);
        if (profile.email === email) {
          if (profile.password && !profile.googleAuth && profile.password !== password)
            return 'Incorrect password. Please try again.';
          
          return await processLogin(profile, true);
        }
      } catch (_) {}
    }
    
    return await processLogin({ email, password }, false);
  };

  const handleGoogleLogin = async ({ email, firstName, lastName, picture, googleAuth }) => {
    setScreen('loading-auth');
    
    const [dbResult, neonCheck] = await Promise.all([
      fetchUserResult(email),
      checkTestSubmission(email, testId + '_test')
    ]);
    
    if (dbResult && dbResult.result) {
      const profile = dbResult.result;
      const fullProfile = {
        email, 
        firstName: profile.firstName || firstName, 
        lastName:  profile.lastName || lastName,
        state:     profile.state, 
        age:       profile.age, 
        picture, 
        googleAuth: true, 
        password:   null
      };
      
      setUserProfile(fullProfile);
      localStorage.setItem('av_user_session', JSON.stringify(fullProfile));
      localStorage.setItem('av_violations', (profile.violations || 0).toString());
      
      if (parseInt(profile.violations || '0', 10) >= 3 || profile.status === 'terminated') {
         setTestResult({ status: 'terminated' });
         setScreen('analysis');
         return;
      }
      
      if (neonCheck.exists) {
        const sd = neonCheck.score_data;
        const resolved = sd.latest || (sd.attempts && sd.attempts[sd.attempts.length - 1]) || sd;
        localStorage.setItem(`av_last_neon_result_${testId}`, JSON.stringify(resolved));
        setTestResult(resolved);
        setScreen('welcome');
        return;
      }
      
      setScreen('welcome');
    } else {
      const newUser = { email, firstName, lastName, picture, googleAuth: true, password: null };
      setUserProfile(newUser);
      
      if (neonCheck.exists) {
        const sd = neonCheck.score_data;
        const resolved = sd.latest || (sd.attempts && sd.attempts[sd.attempts.length - 1]) || sd;
        localStorage.setItem(`av_last_neon_result_${testId}`, JSON.stringify(resolved));
        setTestResult(resolved);
        setScreen('welcome');
        return;
      }
      
      setScreen('onboarding');
    }
  };

  const handleOnboardingComplete = (profile) => {
    const fullProfile = {
      ...profile,
      password:   userProfile?.password   || null,
      googleAuth: userProfile?.googleAuth || false,
      picture:    userProfile?.picture    || null,
    };
    localStorage.setItem('av_user_session', JSON.stringify(fullProfile));
    setUserProfile(fullProfile);
    setScreen('countdown');
  };

  const handleTestSubmit = useCallback(async ({ answers, timeTaken, attemptNumber, timeLogs, forced = false }) => {
    const violations = parseInt(localStorage.getItem('av_violations') || '0', 10);
    
    // Calculate score for the backend so it doesn't just guess zeroes
    let correctCount = 0, wrongCount = 0;
    quizData.forEach((q, i) => {
      const sel = answers[i];
      if (sel) {
        if (sel.charAt(0) === q.answer.charAt(0)) correctCount++;
        else wrongCount++;
      }
    });
    const cuetMarks = (correctCount * 5) - (wrongCount * 1);

    // Merge timeLogs into answers for review hydration natively
    const finalAnswers = { ...answers, timeLogs };

    // Frontend calculation of unfair means
    let finalStatus = forced ? 'terminated' : 'submitted';
    if (finalStatus === 'submitted' && timeTaken < 1500) {
      finalStatus = 'unfair';
    }

    const result = {
      ...userProfile,
      firstName: userProfile?.firstName || '',
      lastName: userProfile?.lastName || '',
      email: String(userProfile?.email || ''), // Enforce string requirement for backend processing
      answers: finalAnswers,
      timeTaken,
      score: cuetMarks,
      correctCount: correctCount, // Added for GAS redundancy
      totalMarks: 200,            // Added for GAS redundancy
      testId: testId,             // Native test ID tracking
      attemptNumber,
      violations,
      status: finalStatus,
    };
    setTestResult(result);
    setScreen('loading');
    localStorage.removeItem('av_violations');

    try {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'avanisehgal22@gmail.com';
      if (result.email === adminEmail) {
        console.log('[Admin Mode] Skipping Neon and GAS writes.');
      } else {
        // 1. Submit to Neon SQL Database first
        console.log('[Frontend] Saving to Neon DB first...');
        await submitToNeon(result.email, testId + '_test', result);

        // 2. Submit to GAS Email Service sequentially
        console.log('[Frontend] Calling GAS Email Service...');
        await submitTestResult(result);
      }

      // Render aesthetic simulated delay
      await new Promise(resolve => setTimeout(resolve, TOTAL_DURATION_MS));
    } catch (e) {
      console.error('[Frontend] Submission pipeline error:', e);
    }

    setScreen('analysis');
  }, [userProfile]);

  const handleForceSubmit = useCallback(() => setForceSubmitQuiz(true), []);

  const handleSwitchAccount = () => {
    localStorage.removeItem('av_user_session');
    setUserProfile(null);
    setScreen('auth');
  };

  const displayName = capitalize(userProfile?.firstName || '');

  // Persistent dark bg — prevents course page from ever showing through
  if (!screen) return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'all' }}
    >
      <div className="qc-bg" />
    </div>
  );

  return (
    // ── CRITICAL: stopPropagation on the root wrapper prevents ChapterModal's
    //    backdrop onClick={onClose} from firing when the user clicks inside
    //    any quiz screen (overlays, welcome card, loading screen, etc.)
    <div onClick={(e) => e.stopPropagation()} style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>

      <div className="qc-bg" style={{ pointerEvents: 'none' }} />

      {screen === 'loading-auth' && (
        <div className="qc-overlay" style={{ pointerEvents: 'all' }}>
          <div className="qc-card qc-welcome-card" onClick={(e) => e.stopPropagation()}>
             <div className="qc-google-spinner" style={{ width: 36, height: 36, borderWidth: 3, marginBottom: 20 }} />
             <h2 className="qc-welcome-name">Connecting Check</h2>
             <p className="qc-welcome-sub">Looking up your profile securely...</p>
          </div>
        </div>
      )}

      {screen === 'auth' && (
        <div className="qc-overlay" style={{ pointerEvents: 'all' }}>
          <QuizAuth
            onLogin={handleLogin}
            onGoogleLogin={handleGoogleLogin}
            onClose={onClose}
          />
        </div>
      )}

      {screen === 'onboarding' && (
        <div className="qc-overlay" style={{ pointerEvents: 'all' }}>
          <QuizOnboarding
            email={userProfile?.email}
            firstName={userProfile?.firstName || ''}
            lastName={userProfile?.lastName  || ''}
            googleAuth={userProfile?.googleAuth || false}
            onComplete={handleOnboardingComplete}
            onBack={() => setScreen('auth')}
          />
        </div>
      )}

      {screen === 'welcome' && (
        <div className="qc-overlay" style={{ pointerEvents: 'all' }}>
          <div className="qc-card qc-welcome-card" onClick={(e) => e.stopPropagation()}>
            <button className="qc-close-btn" onClick={onClose} title="Close">✕</button>

            {userProfile?.picture
              ? <img src={userProfile.picture} alt="Profile" className="qc-profile-pic" referrerPolicy="no-referrer" />
              : (
                <div className="qc-profile-circle">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )
            }

            <h2 className="qc-welcome-name">{testResult ? `Welcome Back, ${displayName}! 👋` : `Hi, ${displayName}! 👋`}</h2>
            <p className="qc-welcome-sub">Ready to tackle {capitalize(testId.replace(/_/g, ' '))}?</p>

            {userProfile?.email === (import.meta.env.VITE_ADMIN_EMAIL || 'avanisehgal22@gmail.com') && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '12px', textAlign: 'center' }}>
                Admin Mode: No data will be recorded.
              </div>
            )}

            <div className="qc-welcome-info">
              <span>{userProfile?.email}</span>
              <span>State: {userProfile?.state}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', marginTop: '20px', width: '100%' }}>
              <button
                className="qc-btn qc-btn-primary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap', padding: '14px 16px' }}
                onClick={() => setScreen('countdown')}
              >
                {testResult ? 'Reattempt Test' : 'Start Test'}
                <span style={{ fontSize: '1rem', lineHeight: 1 }}>→</span>
              </button>
              
              {testResult && testResult.status !== 'terminated' && (
                <button
                  className="qc-btn"
                  style={{
                    flex: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    background: 'rgba(255,255,255,0.08)', color: '#e5e5e5', 
                    border: '1px solid rgba(255,255,255,0.18)', padding: '14px 16px',
                    fontWeight: '600', cursor: 'pointer',
                    transition: 'all 0.2s', whiteSpace: 'nowrap'
                  }}
                  onClick={() => setScreen('analysis')}
                >
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>📊</span> View Analysis
                </button>
              )}
            </div>

            <button className="qc-btn qc-btn-ghost" style={{ marginTop: '8px' }} onClick={handleSwitchAccount}>
              Not you? Switch Account
            </button>
          </div>
        </div>
      )}

      {screen === 'countdown' && (
        <div className="qc-overlay" style={{ pointerEvents: 'all' }}>
          <CountdownOverlay onFinish={() => setScreen('test')} />
        </div>
      )}

      {screen === 'test' && (
        <div style={{ pointerEvents: 'all' }}>
          <QuizProctor 
            onForceSubmit={handleForceSubmit} 
            email={userProfile?.email}
            firstName={userProfile?.firstName}
            lastName={userProfile?.lastName}
          >
            <Quiz
              onSubmit={handleTestSubmit}
              forceSubmit={forceSubmitQuiz}
              reviewMode={false}
              reviewAnswers={{}}
              testId={testId}
              onBackToAnalysis={() => setScreen('analysis')}
              quizData={quizData}
            />
          </QuizProctor>
        </div>
      )}

      {screen === 'review' && (
        <div style={{ pointerEvents: 'all' }}>
          <Quiz
            onSubmit={() => {}}
            forceSubmit={false}
            reviewMode={true}
            reviewAnswers={testResult?.answers || {}}
            onBackToAnalysis={() => setScreen('analysis')}
            quizData={quizData}
            testId={testId}
          />
        </div>
      )}

      {screen === 'loading' && (
        <div className="qc-overlay" style={{ pointerEvents: 'all' }}>
          <SimpleLoadingScreen />
        </div>
      )}

      {screen === 'analysis' && (
        <div className="qc-overlay" style={{ pointerEvents: 'all' }}>
          <QuizAnalysis
            testResult={testResult}
            userProfile={userProfile}
            onClose={onClose}
            onReview={() => setScreen('review')}
            quizData={quizData}
            testId={testId}
          />
        </div>
      )}

    </div>
  );
}
