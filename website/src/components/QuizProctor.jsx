import React, { useEffect, useRef, useCallback, useState } from 'react';
import { syncViolation } from '../utils/gasService';
import './QuizController.css';

export default function QuizProctor({ onForceSubmit, email, children }) {
  const [violations, setViolations] = useState(() =>
    parseInt(localStorage.getItem('av_violations') || '0', 10)
  );
  const [showWarning, setShowWarning]   = useState(false);
  const [isTerminated, setIsTerminated] = useState(() =>
    parseInt(localStorage.getItem('av_violations') || '0', 10) >= 3
  );
  const lastViolationTime = useRef(0);

  const addViolation = useCallback(() => {
    const now = Date.now();
    if (now - lastViolationTime.current < 2000) return; // debounce
    lastViolationTime.current = now;

    setViolations(prev => {
      const next = prev + 1;
      localStorage.setItem('av_violations', next.toString());
      
      // Live sync to GAS
      if (email) syncViolation(email, next);

      if (next >= 3) {
        setIsTerminated(true);
        setShowWarning(false);
        setTimeout(() => onForceSubmit(), 400);
      } else {
        // Show warning — stays open until user clicks "I understand"
        setShowWarning(true);
      }

      return next;
    });
  }, [onForceSubmit]);


  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') addViolation();
    };

    let recentVisibilityChange = false;
    const flagVisibility = () => { recentVisibilityChange = document.visibilityState === 'hidden'; };
    const handleBlur = () => {
      if (!recentVisibilityChange) addViolation();
      recentVisibilityChange = false;
    };

    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I','i','J','j','C','c'].includes(e.key)) ||
        (e.metaKey && e.altKey && ['I','i'].includes(e.key))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const block = (e) => e.preventDefault();

    document.addEventListener('visibilitychange', flagVisibility);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', block);
    document.addEventListener('copy', block);
    document.addEventListener('paste', block);
    document.addEventListener('cut', block);

    return () => {
      document.removeEventListener('visibilitychange', flagVisibility);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', block);
      document.removeEventListener('copy', block);
      document.removeEventListener('paste', block);
      document.removeEventListener('cut', block);
    };
  }, [addViolation]);

  return (
    <>
      {children}

      {/* ── Violation Warning: centered modal with blur backdrop ── */}
      {showWarning && !isTerminated && (
        <div className="qc-violation-backdrop" onClick={(e) => e.stopPropagation()}>
          <div className="qc-violation-modal" role="alertdialog" aria-modal="true">
            <div className="qc-vm-icon">⚠️</div>
            <h3>Tab Switch Detected</h3>
            <p className="qc-vm-count">
              Violation <strong>{violations}</strong> / 3
            </p>
            <p className="qc-vm-sub">
              {violations === 1
                ? 'Please stay in this window. Two more violations will terminate your test.'
                : 'Last warning! One more violation will result in immediate test termination.'}
            </p>
            <button
              className="qc-vm-dismiss"
              onClick={() => setShowWarning(false)}
              autoFocus
            >
              I understand — Return to Test
            </button>
          </div>
        </div>
      )}

      {/* ── Test Terminated overlay ── */}
      {isTerminated && (
        <div className="qc-terminated-overlay">
          <div className="qc-terminated-card">
            <div className="qc-terminated-icon">🚫</div>
            <h2>Test Terminated</h2>
            <p>
              You have been flagged for leaving the test window <strong>3 times</strong>.
              This is a violation of our academic integrity policy.
            </p>
            <p className="qc-terminated-sub">
              Your partial responses have been recorded. Results are being compiled...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
