/**
 * Google Apps Script Integration
 * 
 * HOW TO SET UP:
 * 1. Go to https://script.google.com and create a new project.
 * 2. Paste the Code.gs content (provided separately).
 * 3. Deploy as Web App → Execute as: Me → Who has access: Anyone.
 * 4. Copy the Web App URL and paste it below.
 */

const GAS_URL = import.meta.env.VITE_GAS_URL || null;

export async function submitTestResult(data) {
  // Only send what GAS actually needs — stripping picture, password, timeLogs
  // to prevent payload size from causing GAS execution timeout
  const payload = {
    action: 'submitQuiz',
    timestamp: new Date().toISOString(),
    email:        data.email,
    firstName:    data.firstName || '',
    lastName:     data.lastName  || '',
    state:        data.state     || '',
    age:          data.age       || '',
    score:        data.score,
    correctCount: data.correctCount,
    totalMarks:   data.totalMarks,
    timeTaken:    data.timeTaken,
    attemptNumber: data.attemptNumber,
    violations:   data.violations,
    status:       data.status,
    answers:      data.answers || {},
    testId:       data.testId,
  };

  localStorage.setItem('av_last_result', JSON.stringify(payload));

  if (!GAS_URL) {
    console.info('[GAS] No URL configured – result saved to localStorage only.');
    return { ok: true, local: true };
  }

  try {
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    
    const textResp = await res.text();
    return JSON.parse(textResp);
  } catch (e) {
    console.error('[GAS] POST failed, local fallback used.', e);
    return { ok: true, local: true };
  }
}

export async function syncViolation(email, count) {
  if (!GAS_URL || !email) return;
  try {
    // Send a non-blocking request to update violation count instantly
    fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'updateViolations', email, violations: count }),
    }).catch(() => {});
  } catch (e) {}
}

export async function fetchUserResult(email) {
  if (!GAS_URL) return null;
  try {
    const res = await fetch(`${GAS_URL}?action=getUser&email=${encodeURIComponent(email)}`);
    return await res.json();
  } catch (e) {
    console.error('[GAS] GET User failed', e);
    return null;
  }
}

export async function fetchLeaderboard() {
  if (!GAS_URL) return { ok: false, data: [] };
  try {
    const res = await fetch(`${GAS_URL}?action=getLeaderboard`);
    return await res.json();
  } catch (e) {
    console.error('[GAS] GET Leaderboard failed', e);
    return { ok: false, data: [] };
  }
}
