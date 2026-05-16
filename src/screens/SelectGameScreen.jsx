import React from 'react';
import './SelectGameScreen.css';

export default function SelectGameScreen({ onNavigate, opponentName, onGameChosen }) {
  const games = [
    {
      id: 'backgammon',
      name: 'Backgammon',
      emoji: '🎲',
      description: 'Det klassiske brætspil med taktik og held.',
    },
    {
      id: 'connect4',
      name: '4 på stribe',
      emoji: '🔵',
      description: 'Hurtig og sjov strategi. Få fire på stribe før din modstander.',
    }
  ];

  return (
    <div className="gd-select">
      <div className="gd-select-header">
        <div className="gd-select-back" onClick={() => onNavigate('matchmaking')}>←</div>
        <h1 className="gd-select-title">Vælg Spil</h1>
        <div style={{ width: '30px' }}></div>
      </div>

      <div className="gd-select-content">
        <p className="gd-select-subtitle">
          Udfordr <span className="gd-highlight">{opponentName || 'Modstander'}</span> i...
        </p>

        <div className="gd-games-list">
          {games.map(game => (
            <div 
              key={game.id} 
              className="gd-game-card" 
              onClick={() => onGameChosen(game.id)}
            >
              <div className="gd-game-emoji">{game.emoji}</div>
              <div className="gd-game-info">
                <h3>{game.name}</h3>
                <p>{game.description}</p>
              </div>
              <div className="gd-game-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
