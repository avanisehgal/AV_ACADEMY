import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = req.headers['x-admin-token'];
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('SERVER CONFIG ERROR: ADMIN_PASSWORD is not set in environment variables.');
    return res.status(500).json({ error: 'Server Configuration Error' });
  }

  if (token !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Admin Token' });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('SERVER CONFIG ERROR: DATABASE_URL is not set.');
    return res.status(500).json({ error: 'Server Configuration Error' });
  }

  const sql = neon(dbUrl);
  
  try {
    // Select all submissions, ordered by most recent first
    const rows = await sql`
      SELECT id, email, test_id, score_data, created_at 
      FROM test_submissions 
      ORDER BY created_at DESC
    `;
    
    return res.status(200).json({ success: true, data: rows });

  } catch (error) {
    console.error('API /admin/get-data Error:', error);
    return res.status(500).json({ error: 'Internal Server Error fetching data' });
  }
}
