import React from 'react';
import './MatchmakingScreen.css';

export default function MatchmakingScreen({ 
  onNavigate, 
  onStartGame, 
  onResumeGame,
  onDeleteGame,
  onViewProfile, 
  onInviteFriend, 
  onEditProfile, 
  userDisplayName,
  activeGames = [] 
}) {
  const isLimitReached = activeGames.length >= 5;
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
        <h1 className="header-title">Matchmaking</h1>
        <div className="own-profile-section" style={{ textAlign: 'right' }}>
          <div className="own-profile-btn" onClick={onEditProfile} title="Din Profil">
            👤
          </div>
          <div className="own-profile-name" style={{ fontSize: '10px', marginTop: '2px', color: '#fff', opacity: 0.8 }}>
            {userDisplayName}
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-badge" onClick={() => alert('Ikke-implementeret endnu')}>FILTRER</div>
        <p className="filter-text">Alder, Niveau, Lokation</p>
      </div>

      <div className="invite-friend-section" style={{ padding: '0 20px', marginBottom: '20px' }}>
        <div 
          className="invite-card"
          onClick={isLimitReached ? null : onInviteFriend}
          style={{ 
            background: isLimitReached ? '#bdc3c7' : 'linear-gradient(135deg, #3b5976 0%, #2c3e50 100%)',
            padding: '20px',
            borderRadius: '16px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            cursor: isLimitReached ? 'default' : 'pointer',
            transition: 'transform 0.2s',
            opacity: isLimitReached ? 0.7 : 1
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Spil med en ven 🔗</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
              {isLimitReached ? 'Du har nået grænsen på 5 spil' : 'Send et direkte link til en du kender'}
            </p>
          </div>
          <div style={{ fontSize: '24px' }}>{isLimitReached ? '🛑' : '🚀'}</div>
        </div>
      </div>

      {activeGames.length > 0 && (
        <div className="active-games-section" style={{ padding: '0 20px', marginBottom: '25px' }}>
          <h2 style={{ fontSize: '14px', color: '#fff', marginBottom: '12px', opacity: 0.9 }}>DINE AKTIVE SPIL</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeGames.map(game => {
              const isPlayer1 = game.player1_name === userDisplayName;
              const opponentName = isPlayer1 ? game.player2_name : game.player1_name;
              const isMyTurn = (game.game_state?.currentPlayer === 'player1' && isPlayer1) || 
                               (game.game_state?.currentPlayer === 'player2' && !isPlayer1);
              const isConnect4 = game.game_state?.cols === 7;

              return (
                <div key={game.id} style={{ 
                  backgroundColor: 'rgba(255,255,255,0.95)', 
                  padding: '12px 16px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  borderLeft: isMyTurn ? '4px solid #2ecc71' : '4px solid #ddd'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                      {opponentName.includes('Venter') ? '🔗 Venter på ven...' : opponentName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                      {isConnect4 ? '🔵 4 på stribe' : '🎲 Backgammon'} • {isMyTurn ? 'Din tur' : 'Venter...'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      onClick={() => {
                        if (window.confirm('Er du sikker på, at du vil afslutte dette spil?')) {
                          onDeleteGame(game.id);
                        }
                      }}
                      style={{ 
                        backgroundColor: 'transparent', 
                        border: 'none', 
                        fontSize: '16px', 
                        cursor: 'pointer',
                        padding: '5px'
                      }}
                      title="Slet spil"
                    >
                      🗑️
                    </button>
                    <button 
                      onClick={() => onResumeGame(game)}
                      style={{ 
                        backgroundColor: isMyTurn ? '#2ecc71' : '#3b5976', 
                        color: 'white', border: 'none', padding: '6px 12px', 
                        borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' 
                      }}
                    >
                      SPIL
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="opponents-list">
        <h2 style={{ fontSize: '14px', color: '#fff', padding: '0 20px', marginBottom: '12px', opacity: 0.9 }}>FIND NY MODSTANDER</h2>
        {opponents.map((opponent) => (
          <div key={opponent.id} className="opponent-card">
            <div className="opponent-avatar" style={opponent.avatarStyle}>
              {opponent.avatar}
            </div>
            <div className="opponent-info">
              <h2 className="opponent-name">{opponent.name}</h2>
              <p className="opponent-level">Niveau: {opponent.level}</p>
              <div className="action-buttons" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button 
                  className="play-button"
                  disabled={isLimitReached}
                  style={{ flex: 1, opacity: isLimitReached ? 0.5 : 1, cursor: isLimitReached ? 'default' : 'pointer' }}
                  onClick={() => onStartGame ? onStartGame(opponent) : onNavigate('game')}
                >
                  {isLimitReached ? '[ GRÆNSE NÅET ]' : '[ SPIL ]'}
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
