// api/addSchool.js
import pool from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, address, latitude, longitude } = req.body;

  // Basic validation
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, address, latitude, longitude]
    );

    res.status(201).json({ school: result.rows[0] });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
