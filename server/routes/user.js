import express from 'express';
import { getUserByTelegramId, createUser, updateUserAfk } from '../models/user.js';
const router = express.Router();

// Авторизация через Telegram WebApp
router.post('/auth', async (req, res) => {
  const { telegram_id, username, first_name, last_name, photo_url, referrer_id } = req.body;
  let user = await getUserByTelegramId(telegram_id);
  if (!user) {
    user = await createUser({ telegram_id, username, first_name, last_name, photo_url, referrer_id });
  }
  res.json(user);
});

// AFK фарм: получить монеты
router.post('/afk', async (req, res) => {
  const { telegram_id } = req.body;
  // ...логика начисления монет
  res.json({ success: true });
});

// TODO: Роуты для колеса фортуны, инвентаря, рефералов, профиля

export default router;
