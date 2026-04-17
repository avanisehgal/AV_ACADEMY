import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not set.');
    return res.status(500).json({ error: 'Internal Server Error (DB config missing)' });
  }

  const sql = neon(dbUrl);
  
  try {
    
    // Ensure table exists safely
    await sql`
      CREATE TABLE IF NOT EXISTS test_submissions (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        test_id VARCHAR(255) NOT NULL,
        score_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(email, test_id)
      )
    `;

    const { email, testId } = req.body;
    if (!email || !testId) {
      return res.status(400).json({ error: 'Missing email or testId' });
    }

    const rows = await sql`
      SELECT score_data FROM test_submissions
      WHERE email = ${email} AND test_id = ${testId}
    `;

    if (rows.length > 0) {
      return res.status(200).json({ exists: true, score_data: rows[0].score_data });
    } else {
      return res.status(200).json({ exists: false });
    }

  } catch (error) {
    console.error('API /check-submission Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
