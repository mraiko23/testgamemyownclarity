CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  photo_url TEXT,
  referrer_id BIGINT,
  coins INTEGER DEFAULT 0,
  last_afk_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  item_name TEXT,
  rarity TEXT,
  bonus INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  friend_id INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wheel_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  result TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
