export default function GameControls({ onRoll, onReset }) {
  return (
    <div className="game-controls">
      <button onClick={onRoll}>Roll Dice</button>
      <button onClick={onReset}>New Game</button>
    </div>
  );
}
