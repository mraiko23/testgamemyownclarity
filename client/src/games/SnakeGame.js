import React, { useState, useEffect } from 'react';

const GRID_SIZE = 20;
const INIT_SNAKE = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
];
const INIT_DIR = { x: 1, y: 0 };

function getRandomFood(snake) {
  let food;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(seg => seg.x === food.x && seg.y === food.y));
  return food;
}

function SnakeGame() {
  const [snake, setSnake] = useState(INIT_SNAKE);
  const [dir, setDir] = useState(INIT_DIR);
  const [food, setFood] = useState(getRandomFood(INIT_SNAKE));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (gameOver) return;
    const handleKey = e => {
      if (e.key === 'ArrowUp' && dir.y !== 1) setDir({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' && dir.y !== -1) setDir({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' && dir.x !== 1) setDir({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' && dir.x !== -1) setDir({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        if (
          head.x < 0 || head.x >= GRID_SIZE ||
          head.y < 0 || head.y >= GRID_SIZE ||
          prev.some(seg => seg.x === head.x && seg.y === head.y)
        ) {
          setGameOver(true);
          return prev;
        }
        let newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomFood(newSnake));
          setScore(s => s + 1);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [dir, food, gameOver]);

  return (
    <div>
      <h2>Змейка</h2>
      <div>Счёт: {score}</div>
      <div style={{
        display: 'grid',
        gridTemplate: `repeat(${GRID_SIZE}, 16px) / repeat(${GRID_SIZE}, 16px)`,
        border: '2px solid #0088cc',
        background: '#fff',
        width: 320,
        height: 320,
        margin: '20px auto'
      }}>
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
          const x = i % GRID_SIZE, y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(seg => seg.x === x && seg.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;
          return <div key={i} style={{
            width: 16, height: 16,
            background: isHead ? '#0088cc' : isSnake ? '#6ec6ff' : isFood ? '#ffb300' : 'transparent',
            border: isSnake || isFood ? '1px solid #eee' : '1px solid transparent',
            boxSizing: 'border-box'
          }} />;
        })}
      </div>
      {gameOver && <div>Игра окончена! <button onClick={() => { setSnake(INIT_SNAKE); setDir(INIT_DIR); setFood(getRandomFood(INIT_SNAKE)); setGameOver(false); setScore(0); }}>Заново</button></div>}
    </div>
  );
}

export default SnakeGame;
