import React, { useState, useRef } from 'react';
import { GOOGLE_CLIENT_ID } from '../config/googleAuth';
import './QuizController.css';

const GOOGLE_ICON = (
  <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <path fill="#FFC107" d="M43.6 20H24v8h11.1C33.5 33.5 29.3 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.8 0 20-7.8 20-21 0-1.4-.1-2.7-.4-4z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.4 15.1 18.9 12 24 12c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 5.1 29.5 3 24 3 16.3 3 9.7 7.9 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 45c5.2 0 10-1.9 13.6-5l-6.3-5.2C29.4 36.5 26.8 37 24 37c-5.2 0-9.4-3.5-10.9-8.1l-6.6 5.1C9.7 40.1 16.3 45 24 45z"/>
    <path fill="#1976D2" d="M43.6 20H24v8h11.1c-.7 2.4-2.2 4.4-4.2 5.8l6.3 5.2C40.9 35.5 44 30.2 44 24c0-1.4-.1-2.7-.4-4z"/>
  </svg>
);

export default function QuizAuth({ onLogin, onGoogleLogin, onClose }) {
  const emailRef    = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Email + Password login ──────────────────────────────────────────────────
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const email    = emailRef.current?.value?.trim().toLowerCase() || '';
    const password = passwordRef.current?.value || '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      emailRef.current?.focus();
      return;
    }
    if (!password || password.length < 4) {
      setError('Please enter a password (minimum 4 characters).');
      passwordRef.current?.focus();
      return;
    }

    setLoading(true);
    setError('');
    setTimeout(async () => {
      try {
        const err = await onLogin(email, password);
        if (err) { setError(err); setLoading(false); }
      } catch (err) {
        setError('Login failed. Please try again.');
        setLoading(false);
      }
    }, 300);
  };

  // ── Google OAuth via GSI Token Client ──────────────────────────────────────
  const handleGoogleClick = () => {
    setError('');

    if (!GOOGLE_CLIENT_ID) {
      setError(
        'Google Sign-In is not configured yet. ' +
        'Please contact AV Academy support or use email + password.'
      );
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      setError('Google services are still loading. Please wait a moment and try again.');
      return;
    }

    setGoogleLoading(true);

    // Reset loading if user closes the popup without completing
    const popupTimeout = setTimeout(() => setGoogleLoading(false), 60000);

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          clearTimeout(popupTimeout);

          if (tokenResponse.error) {
            setError('Google sign-in was cancelled or failed. Please try again.');
            setGoogleLoading(false);
            return;
          }

          try {
            const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            if (!resp.ok) throw new Error('Failed to fetch user info');
            const userInfo = await resp.json();

            // Pass structured Google user data to QuizController
            onGoogleLogin({
              email:     userInfo.email?.toLowerCase() || '',
              firstName: userInfo.given_name  || '',
              lastName:  userInfo.family_name || '',
              picture:   userInfo.picture     || '',
              googleAuth: true,
            });
          } catch (fetchErr) {
            setError('Could not retrieve your Google profile. Please use email login.');
            setGoogleLoading(false);
          }
        },
      });

      // Opens the Google account selector popup
      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      clearTimeout(popupTimeout);
      setError('Google Sign-In failed. Please use email login instead.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="qc-card" onClick={(e) => e.stopPropagation()}>
      <button className="qc-close-btn" onClick={onClose} title="Close">✕</button>

      <div className="qc-branding">
        <div className="qc-branding-logo">AV</div>
        <div className="qc-branding-name">AV Academy <span>/ Exam Portal</span></div>
      </div>

      <h2>Sign in to continue</h2>
      <p className="qc-sub">Access your CUET Probability Test</p>

      <form className="qc-form" onSubmit={handleEmailSubmit}>

        <div className="qc-field">
          <label htmlFor="auth-email">Email Address</label>
          <input
            id="auth-email"
            ref={emailRef}
            type="email"
            className="qc-input"
            placeholder="you@example.com"
            autoFocus
          />
        </div>

        <div className="qc-field">
          <label htmlFor="auth-password">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="auth-password"
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              className="qc-input"
              placeholder="Enter or create a password"
              style={{ paddingRight: 58 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: 'absolute', right: 14, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                color: '#555', cursor: 'pointer',
                fontSize: '0.75rem', fontWeight: 700,
                letterSpacing: '0.06em', fontFamily: 'inherit',
              }}
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
        </div>

        {error && <div className="qc-error">{error}</div>}

        <button className="qc-btn qc-btn-primary" type="submit" disabled={loading || googleLoading}>
          {loading ? 'Signing in…' : 'Continue with Email →'}
        </button>

        <div className="qc-divider"><span>or</span></div>

        <button
          className="qc-btn qc-btn-google"
          type="button"
          onClick={handleGoogleClick}
          disabled={loading || googleLoading}
        >
          {googleLoading
            ? <><div className="qc-google-spinner" /> Waiting for Google…</>
            : <>{GOOGLE_ICON} Continue with Google</>
          }
        </button>

      </form>
    </div>
  );
}
