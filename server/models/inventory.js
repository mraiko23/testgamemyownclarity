import pool from './db.js';

export async function getInventory(user_id) {
  const res = await pool.query('SELECT * FROM inventory WHERE user_id = $1', [user_id]);
  return res.rows;
}

export async function addItem(user_id, item_name, rarity, bonus) {
  await pool.query(
    'INSERT INTO inventory (user_id, item_name, rarity, bonus) VALUES ($1, $2, $3, $4)',
    [user_id, item_name, rarity, bonus]
  );
}
