  useEffect(() => {
    if (nextCollect > 0) {
      const timer = setInterval(() => setNextCollect(n => Math.max(n - 1, 0)), 60000);
      return () => clearInterval(timer);
    }
  }, [nextCollect]);
  useEffect(() => {
    // Получить количество рефералов
    if (user) {
      fetch(`/api/game/referrals/${user.id}`)
        .then(res => res.json())
        .then(refs => setInvitedCount(refs.length))
        .catch(() => setInvitedCount(0));
    }
  }, [user]);
  useEffect(() => {
    // Получить инвентарь пользователя
    if (user) {
      setRefLink(window.location.origin + '/?ref=' + user.id);
      fetch(`/api/game/inventory/${user.id}`)
        .then(res => res.json())
        .then(setItems)
        .catch(() => setItems([]));
    }
  }, [user]);
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTelegram } from '@vkruglikov/react-telegram-web-app';
import Profile from './pages/Profile';
import AfkFarm from './pages/AfkFarm';
import Wheel from './pages/Wheel';
import Inventory from './pages/Inventory';
import Referral from './pages/Referral';
import Games from './pages/Games';
import SnakeGame from './games/SnakeGame';
import TetrisGame from './games/TetrisGame';

function App() {
  const { user } = useTelegram();
  const [coins, setCoins] = useState(0);
  const [invitedCount, setInvitedCount] = useState(0);
  const [items, setItems] = useState([]);
  const [refLink, setRefLink] = useState('');
  const [nextCollect, setNextCollect] = useState(0);
  const [wheelResult, setWheelResult] = useState(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    // Получить профиль и баланс пользователя
    if (user) {
      setRefLink(window.location.origin + '/?ref=' + user.id);
      fetch('/api/user/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          photo_url: user.photo_url,
          referrer_id: (new URLSearchParams(window.location.search)).get('ref') || null
        })
      })
        .then(res => res.json())
        .then(data => setCoins(data.coins || 0))
        .catch(() => setCoins(0));
    }
  }, [user]);

  const handleCollect = () => {
    if (!user) return;
    fetch('/api/user/afk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram_id: user.id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && typeof data.coins === 'number') {
          setCoins(data.coins);
          setNextCollect(data.nextCollect || 20);
        }
      });
  };

  const handleSpin = () => {
    if (!user) return;
    setSpinning(true);
    fetch('/api/game/wheel/spin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram_id: user.id })
    })
      .then(res => res.json())
      .then(data => setWheelResult(data.result))
      .catch(() => setWheelResult('Ошибка'))
      .finally(() => setSpinning(false));
  };

  return (
    <Router>
      <div style={{ fontFamily: 'Arial', background: '#f3f6fa', minHeight: '100vh', color: '#222' }}>
        <header style={{ padding: 20, background: '#0088cc', color: '#fff' }}>
          <h1>Telegram Game</h1>
          <nav>
            <Link to="/">Профиль</Link> |{' '}
            <Link to="/afk">AFK Фарм</Link> |{' '}
            <Link to="/wheel">Колесо</Link> |{' '}
            <Link to="/inventory">Инвентарь</Link> |{' '}
            <Link to="/referral">Рефералы</Link> |{' '}
            <Link to="/games">Мини-игры</Link>
          </nav>
        </header>
        <main style={{ padding: 20 }}>
          <Routes>
            <Route path="/" element={<Profile user={user} coins={coins} invitedCount={invitedCount} />} />
            <Route path="/afk" element={<AfkFarm coins={coins} onCollect={handleCollect} nextCollect={nextCollect} />} />
            <Route path="/wheel" element={<Wheel onSpin={handleSpin} result={wheelResult} spinning={spinning} />} />
            <Route path="/inventory" element={<Inventory items={items} />} />
            <Route path="/referral" element={<Referral refLink={refLink} invitedCount={invitedCount} />} />
            <Route path="/games" element={<Games />} />
            <Route path="/snake" element={<SnakeGame />} />
            <Route path="/tetris" element={<TetrisGame />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
