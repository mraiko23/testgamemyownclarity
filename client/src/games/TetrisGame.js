import React, { useState, useEffect, useRef } from 'react';

const ROWS = 20;
const COLS = 10;
const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
];
const COLORS = ['#00bcd4', '#ffeb3b', '#e040fb', '#3f51b5', '#ff9800', '#4caf50', '#f44336'];

function randomShape() {
  const i = Math.floor(Math.random() * SHAPES.length);
  return { shape: SHAPES[i], color: COLORS[i], idx: i };
}

function rotate(shape) {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}

function TetrisGame() {
  const [grid, setGrid] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [piece, setPiece] = useState(randomShape());
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (gameOver) return;
    const handleKey = e => {
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowDown') drop();
      if (e.key === 'ArrowUp') rotatePiece();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  useEffect(() => {
    if (gameOver) return;
    ref.current = setInterval(() => {
      drop();
    }, 400);
    return () => clearInterval(ref.current);
  });

  function collide(px, py, shape) {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const nx = px + x, ny = py + y;
          if (nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && grid[ny][nx])) return true;
        }
      }
    }
    return false;
  }

  function merge(newGrid, px, py, shape, color) {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const nx = px + x, ny = py + y;
          if (ny >= 0) newGrid[ny][nx] = color;
        }
      }
    }
  }

  function drop() {
    if (!collide(pos.x, pos.y + 1, piece.shape)) {
      setPos(p => ({ ...p, y: p.y + 1 }));
    } else {
      const newGrid = grid.map(row => [...row]);
      merge(newGrid, pos.x, pos.y, piece.shape, piece.color);
      // clear lines
      let lines = 0;
      for (let y = ROWS - 1; y >= 0; y--) {
        if (newGrid[y].every(cell => cell)) {
          newGrid.splice(y, 1);
          newGrid.unshift(Array(COLS).fill(null));
          lines++;
        }
      }
      setScore(s => s + lines * 100);
      setGrid(newGrid);
      const next = randomShape();
      setPiece(next);
      setPos({ x: 3, y: 0 });
      if (collide(3, 0, next.shape)) setGameOver(true);
    }
  }

  function move(dir) {
    if (!collide(pos.x + dir, pos.y, piece.shape)) setPos(p => ({ ...p, x: p.x + dir }));
  }

  function rotatePiece() {
    const rotated = rotate(piece.shape);
    if (!collide(pos.x, pos.y, rotated)) setPiece(p => ({ ...p, shape: rotated }));
  }

  function restart() {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setPiece(randomShape());
    setPos({ x: 3, y: 0 });
    setScore(0);
    setGameOver(false);
  }

  return (
    <div>
      <h2>Тетрис</h2>
      <div>Счёт: {score}</div>
      <div style={{
        display: 'grid',
        gridTemplate: `repeat(${ROWS}, 16px) / repeat(${COLS}, 16px)`,
        border: '2px solid #0088cc',
        background: '#fff',
        width: 160,
        height: 320,
        margin: '20px auto'
      }}>
        {grid.map((row, y) => row.map((cell, x) => {
          let color = cell;
          // draw falling piece
          if (
            y >= pos.y && y < pos.y + piece.shape.length &&
            x >= pos.x && x < pos.x + piece.shape[0].length &&
            piece.shape[y - pos.y][x - pos.x]
          ) {
            color = piece.color;
          }
          return <div key={x + '-' + y} style={{
            width: 16, height: 16,
            background: color || 'transparent',
            border: '1px solid #eee',
            boxSizing: 'border-box'
          }} />;
        }))}
      </div>
      {gameOver && <div>Игра окончена! <button onClick={restart}>Заново</button></div>}
    </div>
  );
}

export default TetrisGame;
