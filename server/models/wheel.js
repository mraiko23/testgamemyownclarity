import pool from './db.js';

export async function addWheelHistory(user_id, result) {
  await pool.query(
    'INSERT INTO wheel_history (user_id, result) VALUES ($1, $2)',
    [user_id, result]
  );
}

export async function getWheelHistory(user_id) {
  const res = await pool.query('SELECT * FROM wheel_history WHERE user_id = $1', [user_id]);
  return res.rows;
}
