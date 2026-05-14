import React from 'react';
import './SelectGameScreen.css';

export default function SelectGameScreen({ onNavigate, opponentName, onGameChosen }) {
  const games = [
    {
      id: 'backgammon',
      name: 'Backgammon',
      emoji: '🎲',
      description: 'Det klassiske brætspil med taktik og held.',
      color: '#d4a373'
    },
    // Placeholders for future games:
    // { id: 'chess', name: 'Skak', emoji: '♟️', description: 'Ren strategi uden terninger.', color: '#3b5976' },
    // { id: 'ludo', name: 'Ludo', emoji: '🔴', description: 'Sjov og ballade for op til 4 spillere.', color: '#e63946' }
  ];

  return (
    <div className="select-game-container">
      <div className="select-game-header">
        <div className="back-button" onClick={() => onNavigate('matchmaking')}>
          &lt;
        </div>
        <h1 className="header-title">Vælg Spil</h1>
      </div>

      <div className="select-game-content">
        <h2 className="opponent-title">
          Udfordr <span className="highlight-name">{opponentName || 'Modstander'}</span> i...
        </h2>

        <div className="games-list">
          {games.map(game => (
            <div 
              key={game.id} 
              className="game-card" 
              onClick={() => onGameChosen(game.id)}
            >
              <div className="game-icon" style={{ backgroundColor: game.color }}>
                {game.emoji}
              </div>
              <div className="game-info">
                <h3>{game.name}</h3>
                <p>{game.description}</p>
              </div>
              <div className="play-arrow">
                ▶
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
