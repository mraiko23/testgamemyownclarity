import React from 'react';

function Inventory({ items }) {
  return (
    <div>
      <h2>Инвентарь</h2>
      {items.length === 0 ? <div>Пусто</div> : (
        <ul>
          {items.map((item, i) => (
            <li key={i}>{item.name} ({item.rarity})</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Inventory;
