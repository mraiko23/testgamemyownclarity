import pool from './db.js';

export async function getUserByTelegramId(telegram_id) {
  const res = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [telegram_id]);
  return res.rows[0];
}

export async function createUser({ telegram_id, username, first_name, last_name, photo_url, referrer_id }) {
  const res = await pool.query(
    `INSERT INTO users (telegram_id, username, first_name, last_name, photo_url, referrer_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [telegram_id, username, first_name, last_name, photo_url, referrer_id]
  );
  return res.rows[0];
}

export async function updateUserAfk(telegram_id, last_afk_time, coins) {
  await pool.query(
    'UPDATE users SET last_afk_time = $1, coins = $2 WHERE telegram_id = $3',
    [last_afk_time, coins, telegram_id]
  );
}

// ...другие методы для инвентаря, рефералов, предметов, колеса фортуны
