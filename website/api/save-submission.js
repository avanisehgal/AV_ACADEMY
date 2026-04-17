import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.status(500).json({ error: 'Internal Server Error (DB config missing)' });
  }

  const sql = neon(dbUrl);
  
  try {
    const { email, testId, score_data } = req.body;
    if (!email || !testId || !score_data) {
      return res.status(400).json({ error: 'Missing email, testId, or score_data' });
    }

    // Add a timestamp to this attempt
    const thisAttempt = { ...score_data, savedAt: new Date().toISOString() };

    // 1. Check if a record already exists (JavaScript-level logic, avoids complex jsonb SQL)
    const existing = await sql`
      SELECT score_data FROM test_submissions
      WHERE email = ${email} AND test_id = ${testId}
      LIMIT 1
    `;

    let newScoreData;

    if (existing.length > 0) {
      const existingData = existing[0].score_data;

      // Migrate old flat schema to new attempts-array schema if needed
      let history;
      if (existingData && existingData.attempts && Array.isArray(existingData.attempts)) {
        history = [...existingData.attempts, thisAttempt];
      } else {
        // Old flat record — treat it as attempt #1
        history = [existingData, thisAttempt].filter(Boolean);
      }

      newScoreData = { attempts: history, latest: thisAttempt };

      // UPDATE existing row
      await sql`
        UPDATE test_submissions
        SET score_data = ${JSON.stringify(newScoreData)}::jsonb
        WHERE email = ${email} AND test_id = ${testId}
      `;
    } else {
      // INSERT new row
      newScoreData = { attempts: [thisAttempt], latest: thisAttempt };

      await sql`
        INSERT INTO test_submissions (email, test_id, score_data)
        VALUES (${email}, ${testId}, ${JSON.stringify(newScoreData)}::jsonb)
      `;
    }
    
    return res.status(200).json({ success: true, attemptCount: newScoreData.attempts.length });

  } catch (error) {
    console.error('API /save-submission Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
