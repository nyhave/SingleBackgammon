import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Board from '../components/Board.jsx';
import Dice from '../components/Dice.jsx';
import GameControls from '../components/GameControls.jsx';
import ChatPanel from '../components/ChatPanel.jsx';
import BackgammonEngine from 'backgammon-engine';

export default function Game() {
  useEffect(() => {
    console.log('Game page component mounted');
  }, []);
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');
  const navigate = useNavigate();
  const [game] = useState(() => new BackgammonEngine());
  const [board, setBoard] = useState(game.board || []);
  const [dice, setDice] = useState(game.dice || []);
  const [chemistry, setChemistry] = useState(0);

  const roll = () => {
    if (game.rollDice) {
      game.rollDice();
      setDice([...game.dice]);
      setBoard([...game.board]);
    }
  };

  const reset = () => {
    if (game.reset) {
      game.reset();
      setBoard([...game.board]);
      setDice([]);
    }
  };

  const handleInteraction = () =>
    setChemistry((c) => Math.min(100, c + 10));

  const endGame = () => {
    localStorage.setItem(
      'matchSummary',
      JSON.stringify({ chemistry, roomId, score: game.score ?? 0 })
    );
    navigate('/post-match');
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Board board={board} />
        <Dice values={dice} />
        <GameControls onRoll={roll} onReset={reset} onEnd={endGame} />
        <div style={{ marginTop: '1rem' }}>
          <label>
            Chemistry
            <progress value={chemistry} max="100" style={{ marginLeft: '0.5rem' }} />
          </label>
        </div>
      </div>
      <ChatPanel roomId={roomId} onInteraction={handleInteraction} />
    </div>
  );
}
