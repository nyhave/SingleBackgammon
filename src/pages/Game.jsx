import { useState } from 'react';
import Board from '../components/Board.jsx';
import Dice from '../components/Dice.jsx';
import GameControls from '../components/GameControls.jsx';
import ChatPanel from '../components/ChatPanel.jsx';
import BackgammonEngine from 'backgammon-engine';

export default function Game() {
  const [game] = useState(() => new BackgammonEngine());
  const [board, setBoard] = useState(game.board || []);
  const [dice, setDice] = useState(game.dice || []);

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

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Board board={board} />
        <Dice values={dice} />
        <GameControls onRoll={roll} onReset={reset} />
      </div>
      <ChatPanel />
    </div>
  );
}
