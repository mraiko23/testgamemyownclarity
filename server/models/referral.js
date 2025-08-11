import pool from './db.js';

export async function getReferrals(user_id) {
  const res = await pool.query('SELECT * FROM referrals WHERE user_id = $1', [user_id]);
  return res.rows;
}

export async function addReferral(user_id, friend_id) {
  await pool.query(
    'INSERT INTO referrals (user_id, friend_id) VALUES ($1, $2)',
    [user_id, friend_id]
  );
}
