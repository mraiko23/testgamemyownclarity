import React from 'react';

function Wheel({ onSpin, result, spinning }) {
  return (
    <div>
      <h2>Колесо фортуны</h2>
      <button onClick={onSpin} disabled={spinning}>Крутить за 5 монет</button>
      {result && <div>Выпало: {result}</div>}
    </div>
  );
}

export default Wheel;
