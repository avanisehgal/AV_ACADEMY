import React, { useState, useRef } from 'react';
import './QuizController.css';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir',
  'Ladakh','Chandigarh','Puducherry','Other'
];

export default function QuizOnboarding({ email, firstName, lastName, googleAuth, onComplete, onBack }) {
  const formRef = useRef(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);
    const firstName = data.get('firstName')?.trim() || '';
    const lastName  = data.get('lastName')?.trim()  || '';
    const mail      = data.get('email')?.trim().toLowerCase() || '';
    const state     = data.get('state') || '';
    const age       = parseInt(data.get('age') || '0', 10);

    if (!firstName || !lastName || !mail || !state || !age) {
      setError('All fields are required.');
      return;
    }
    if (age < 10 || age > 60) {
      setError('Please enter a valid age between 10 and 60.');
      return;
    }
    if (!consent) {
      setError('You must certify that the information provided is true.');
      return;
    }
    setError('');
    onComplete({ firstName, lastName, email: mail, state, age, loggedIn: true });
  };

  return (
    <div className="qc-card" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
      <div className="qc-branding">
        <div className="qc-branding-logo">AV</div>
        <div className="qc-branding-name">AV Academy <span>/ Exam Portal</span></div>
      </div>

      <h2>Your Details</h2>
      <p className="qc-sub">This information is required before starting the test. All fields are mandatory.</p>

      <form ref={formRef} className="qc-form" onSubmit={handleSubmit}>
        <div className="qc-row">
          <div className="qc-field">
            <label htmlFor="ob-fname">First Name</label>
            <input
              id="ob-fname"
              name="firstName"
              className="qc-input"
              placeholder="Aanya"
              defaultValue={firstName || ''}
              readOnly={googleAuth && !!firstName}
              style={googleAuth && firstName ? { opacity: 0.6, cursor: 'default' } : {}}
              autoFocus={!firstName}
            />
          </div>
          <div className="qc-field">
            <label htmlFor="ob-lname">Last Name</label>
            <input
              id="ob-lname"
              name="lastName"
              className="qc-input"
              placeholder="Sharma"
              defaultValue={lastName || ''}
              readOnly={googleAuth && !!lastName}
              style={googleAuth && lastName ? { opacity: 0.6, cursor: 'default' } : {}}
            />
          </div>
        </div>

        <div className="qc-field">
          <label htmlFor="ob-email">
            Email Address
            {googleAuth && <span className="qc-google-verified">✓ Google Verified</span>}
          </label>
          <input
            id="ob-email"
            name="email"
            type="email"
            className="qc-input"
            placeholder="you@example.com"
            defaultValue={email || ''}
            readOnly={!!email}
            style={email ? { opacity: 0.6, cursor: 'default' } : {}}
          />
        </div>

        <div className="qc-row">
          <div className="qc-field">
            <label htmlFor="ob-state">State</label>
            <select id="ob-state" name="state" className="qc-input" style={{ cursor: 'pointer' }}>
              <option value="">Select State</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="qc-field">
            <label htmlFor="ob-age">Age</label>
            <input
              id="ob-age"
              name="age"
              type="number"
              className="qc-input"
              placeholder="Enter your age"
              min="10"
              max="60"
            />
          </div>
        </div>

        <label
          className="qc-consent"
          htmlFor="ob-consent"
          onClick={(e) => {
            // Prevent double-toggle when clicking the label (the input change also fires)
            if (e.target.tagName !== 'INPUT') setConsent(c => !c);
          }}
        >
          <input
            id="ob-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>I certify that the information provided above is true and accurate, and I agree to the exam's academic integrity policy.</span>
        </label>

        {error && <div className="qc-error">{error}</div>}

        <button className="qc-btn qc-btn-primary" type="submit">
          Start Test →
        </button>
        <button className="qc-btn qc-btn-ghost" type="button" onClick={onBack}>
          ← Back to Login
        </button>
      </form>
    </div>
  );
}
