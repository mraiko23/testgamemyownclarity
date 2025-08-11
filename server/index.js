import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import userRoutes from './routes/user.js';
import gameRoutes from './routes/game.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use('/api/user', userRoutes);
app.use('/api/game', gameRoutes);

app.get('/', (req, res) => {
  res.send('Telegram Game API running');
});

// TODO: Add routes for auth, afk, wheel, inventory, referral, profile

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
