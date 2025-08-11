import React from 'react';

function AfkFarm({ coins, onCollect, nextCollect }) {
  return (
    <div>
      <h2>AFK Фарм</h2>
      <div>💰 Ваши монеты: {coins}</div>
      <button onClick={onCollect} disabled={nextCollect > 0}>
        {nextCollect > 0 ? `Доступно через ${nextCollect} мин.` : 'Забрать монеты'}
      </button>
    </div>
  );
}

export default AfkFarm;
