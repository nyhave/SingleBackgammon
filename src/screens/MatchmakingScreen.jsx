import React from 'react';
import './MatchmakingScreen.css';

export default function MatchmakingScreen({ onNavigate, onStartGame, onViewProfile, onEditProfile }) {
  // Test data for opponents based on the design
  const opponents = [
    {
      id: 1,
      name: 'Matilde, 26',
      level: 'Ekspert',
      avatar: '🎲', // Using emoji as placeholder for the board image
      avatarStyle: { backgroundColor: '#d4a373' }
    },
    {
      id: 2,
      name: 'Søren, 30',
      level: 'Begynder',
      avatar: '❤️',
      avatarStyle: { backgroundColor: '#ffcccb' }
    },
    {
      id: 3,
      name: 'Malia, 37',
      level: 'Begynder',
      avatar: '🧑',
      avatarStyle: { backgroundColor: '#e2e8f0' }
    },
    {
      id: 4,
      name: 'Lars, 42',
      level: 'Mellemliggende',
      avatar: '🧔',
      avatarStyle: { backgroundColor: '#d1d5db' }
    },
    {
      id: 5,
      name: 'Sofie, 29',
      level: 'Ekspert',
      avatar: '👩',
      avatarStyle: { backgroundColor: '#fca5a5' }
    }
  ];

  return (
    <div className="matchmaking-container">
      <div className="matchmaking-header">
        <h1 className="header-title">Backgammon & Matchmaking</h1>
        <div className="own-profile-btn" onClick={onEditProfile} title="Din Profil">
          👤
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-badge">FILTRER</div>
        <p className="filter-text">Alder, Niveau, Lokation</p>
      </div>

      <div className="opponents-list">
        {opponents.map((opponent) => (
          <div key={opponent.id} className="opponent-card">
            <div className="heart-badge">❤️</div>
            <div className="opponent-avatar" style={opponent.avatarStyle}>
              {opponent.avatar}
            </div>
            <div className="opponent-info">
              <h2 className="opponent-name">{opponent.name}</h2>
              <p className="opponent-level">Niveau: {opponent.level}</p>
              <div className="action-buttons" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button 
                  className="play-button"
                  style={{ flex: 1 }}
                  onClick={() => onStartGame ? onStartGame(opponent) : onNavigate('game')}
                >
                  [ SPIL ]
                </button>
                <button 
                  className="view-profile-button"
                  style={{ flex: 1, backgroundColor: 'transparent', color: '#3b5976', border: '1px solid #3b5976', padding: '10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                  onClick={() => onViewProfile ? onViewProfile(opponent.name) : null}
                >
                  [ SE PROFIL ]
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
