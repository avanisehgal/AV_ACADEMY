import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function formatTime(sec) {
  if (!sec) return '—';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function isUnfair(attempt) {
  return (attempt?.timeTaken || 0) < 1500; // 25 minutes = 1500s
}

// ── Attempt History Modal ──────────────────────────────────────────────────────
function AttemptModal({ row, onClose }) {
  const sd = row.score_data || {};

  // Support both new schema {attempts:[], latest:{}} and old flat schema
  const attempts = sd.attempts
    ? [...sd.attempts].reverse() // latest first
    : [sd];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, backdropFilter: 'blur(6px)'
    }} onClick={onClose}>
      <div style={{
        background: '#111', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '16px', padding: '32px', maxWidth: '600px', width: '90%',
        maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.6)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ color: '#fff', margin: 0, fontSize: '1.2rem' }}>
              {(sd.latest?.firstName || sd.firstName || '') + ' ' + (sd.latest?.lastName || sd.lastName || '') || 'Student'}
            </h3>
            <p style={{ color: '#666', margin: '4px 0 0', fontSize: '0.85rem' }}>{row.email}</p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', borderRadius: '50%', width: '36px', height: '36px',
            cursor: 'pointer', fontSize: '1rem'
          }}>✕</button>
        </div>

        <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
          <span style={{ color: '#888', fontSize: '0.85rem' }}>Total Attempts: </span>
          <strong style={{ color: '#fff' }}>{attempts.length}</strong>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {attempts.map((attempt, i) => (
            <div key={i} style={{
              padding: '16px', borderRadius: '10px',
              background: i === 0 ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
              border: i === 0 ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: i === 0 ? '#fff' : '#aaa', fontWeight: '600' }}>
                  Attempt #{attempts.length - i} {i === 0 && <span style={{ color: '#60a5fa', fontSize: '0.8rem', marginLeft: '8px' }}>Latest</span>}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#555' }}>
                  {attempt.savedAt ? new Date(attempt.savedAt).toLocaleString() : '—'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '20px', marginTop: '10px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ color: '#888', fontSize: '0.75rem' }}>Score</div>
                  <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>
                    {attempt.score !== undefined ? attempt.score : '—'} / 200
                  </div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '0.75rem' }}>Time Taken</div>
                  <div style={{ color: '#fff', fontWeight: '600' }}>{formatTime(attempt.timeTaken)}</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '0.75rem' }}>Status</div>
                  <div>
                    {isUnfair(attempt)
                      ? <span style={{ color: '#f87171', fontWeight: '700', fontSize: '0.85rem' }}>⚠ Unfair Means</span>
                      : <span style={{ color: '#4ade80', fontSize: '0.85rem' }}>✓ Verified</span>
                    }
                  </div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '0.75rem' }}>Violations</div>
                  <div style={{ color: attempt.violations > 0 ? '#f87171' : '#666', fontWeight: '600' }}>
                    {attempt.violations ?? 0}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchAdminData = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/get-data', {
        method: 'GET',
        headers: { 'x-admin-token': token }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to authenticate');
      setData(json.data || []);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    fetchAdminData(password);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <h2>AV Academy Secure Portal</h2>
          <p>Please enter the administrator password to access test records.</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Admin Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="admin-input"
            />
            {error && <div className="admin-error">{error}</div>}
            <button type="submit" disabled={loading} className="admin-submit-btn">
              {loading ? 'Verifying...' : 'Access Records'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredData = data.filter(row => 
    row.email.toLowerCase().includes(search.toLowerCase()) || 
    row.test_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard-wrapper">
      {selectedRow && <AttemptModal row={selectedRow} onClose={() => setSelectedRow(null)} />}

      <header className="admin-header">
        <h2>Administrator Dashboard</h2>
        <div className="admin-actions">
          <input 
            type="text" 
            placeholder="Search by email..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="admin-search"
          />
          <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="admin-analytics-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            Live Analytics
          </a>
          <button className="admin-logout-btn" onClick={() => setIsAuthenticated(false)}>Logout</button>
        </div>
      </header>
      
      <p style={{ color: '#555', fontSize: '0.82rem', margin: '0 0 12px 4px' }}>
        💡 Click any row to see the full attempt history for that student.
      </p>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student Email</th>
              <th>Test Name</th>
              <th style={{ textAlign: 'center' }}>Latest Score</th>
              <th>Attempts</th>
              <th>Time Taken</th>
              <th>Status</th>
              <th>Last Attempt</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className="admin-no-data">No submissions found matching your search.</td>
              </tr>
            ) : (
              filteredData.map((row) => {
                const sd = row.score_data || {};

                // Support both new schema and old flat schema
                const latest = sd.latest || (sd.attempts && sd.attempts[sd.attempts.length - 1]) || sd;
                const attemptCount = sd.attempts ? sd.attempts.length : 1;
                const studentName = (latest.firstName || latest.lastName)
                  ? `${latest.firstName || ''} ${latest.lastName || ''}`.trim()
                  : (sd.firstName || sd.lastName)
                    ? `${sd.firstName || ''} ${sd.lastName || ''}`.trim()
                    : 'Unknown';
                const unfair = isUnfair(latest);

                return (
                  <tr 
                    key={row.id} 
                    onClick={() => setSelectedRow(row)}
                    style={{ cursor: 'pointer' }}
                    className="admin-row-clickable"
                  >
                    <td><strong>{studentName}</strong></td>
                    <td>{row.email}</td>
                    <td>{row.test_id}</td>
                    <td className="score-col">{latest.score !== undefined ? latest.score : '—'}</td>
                    <td style={{ textAlign: 'center', color: '#60a5fa', fontWeight: '700' }}>{attemptCount}</td>
                    <td>{formatTime(latest.timeTaken)}</td>
                    <td>
                      {unfair ? (
                        <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Unfair Means</span>
                      ) : (
                        <span style={{ color: '#4ade80', fontSize: '0.9rem' }}>✓ Verified</span>
                      )}
                    </td>
                    <td className="date-col">{new Date(latest.savedAt || row.created_at).toLocaleString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
