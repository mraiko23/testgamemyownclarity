import express from 'express';
import { getInventory, addItem } from '../models/inventory.js';
import { getReferrals, addReferral } from '../models/referral.js';
import { addWheelHistory, getWheelHistory } from '../models/wheel.js';
import { getUserByTelegramId, updateUserAfk } from '../models/user.js';

const router = express.Router();

// Получить инвентарь пользователя
router.get('/inventory/:telegram_id', async (req, res) => {
  const user = await getUserByTelegramId(req.params.telegram_id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const items = await getInventory(user.id);
  res.json(items);
});

// Получить рефералов пользователя
router.get('/referrals/:telegram_id', async (req, res) => {
  const user = await getUserByTelegramId(req.params.telegram_id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const refs = await getReferrals(user.id);
  res.json(refs);
});

// Получить историю колеса фортуны
router.get('/wheel/:telegram_id', async (req, res) => {
  const user = await getUserByTelegramId(req.params.telegram_id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const history = await getWheelHistory(user.id);
  res.json(history);
});

// Крутить колесо фортуны
router.post('/wheel/spin', async (req, res) => {
  const { telegram_id } = req.body;
  const user = await getUserByTelegramId(telegram_id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  // TODO: списать 5 монет, выбрать приз, добавить в инвентарь, записать в историю
  res.json({ result: 'NFT-предмет (заглушка)' });
});

export default router;
