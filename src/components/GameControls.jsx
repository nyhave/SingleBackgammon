import { useEffect } from 'react';

export default function GameControls({ onRoll, onReset, onEnd }) {
  useEffect(() => {
    console.log('GameControls component mounted');
  }, []);
  return (
    <div className="game-controls">
      <button onClick={onRoll}>Roll Dice</button>
      <button onClick={onReset}>New Game</button>
      {onEnd && <button onClick={onEnd}>End Game</button>}
    </div>
  );
}
