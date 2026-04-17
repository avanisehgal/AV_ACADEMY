/**
 * Interfaces directly with the Neon PostgreSQL Serverless function 
 * (located at /api/quiz-handler)
 */

export async function checkTestSubmission(email, testId) {
  try {
    const res = await fetch('/api/check-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, testId })
    });
    
    // Evaluate exact text to catch unexpected HTML/Vite proxy errors
    const textResp = await res.text();

    if (!res.ok) {
      console.warn('Neon check returned non-200 status', res.status);
      return { exists: false };
    }
    
    return JSON.parse(textResp);
  } catch (e) {
    console.error('Neon check failed (fetch Error)', e);
    return { exists: false };
  }
}

export async function submitToNeon(email, testId, score_data) {
  try {
    const res = await fetch('/api/save-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, testId, score_data })
    });
    
    const textResp = await res.text();

    if (!res.ok) {
       console.warn('Neon submit returned non-200 status', res.status);
       return { success: false, error: textResp };
    }
    
    return JSON.parse(textResp);
  } catch (e) {
    console.error('Neon submit failed (fetch Error)', e);
    return { success: false };
  }
}
