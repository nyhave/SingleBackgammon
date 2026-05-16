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

  const allOpponents = [
    { id: 1, name: 'Anna', level: 'Mellemliggende', avatar: '👩' },
    { id: 2, name: 'Søren', level: 'Begynder', avatar: '🧑' },
    { id: 3, name: 'Matilde', level: 'Ekspert', avatar: '👩' },
    { id: 4, name: 'Casper', level: 'Mellemliggende', avatar: '🧔' },
  ];
  const opponents = allOpponents.filter(o => o.name !== userDisplayName);

  return (
    <div className="gd-matchmaking">
      {/* Header */}
      <div className="gd-mm-header">
        <h1 className="gd-mm-title">GameDate</h1>
        <div className="gd-mm-profile" onClick={onEditProfile}>
          <span className="gd-mm-avatar-icon">👤</span>
          <span className="gd-mm-profile-name">{userDisplayName}</span>
        </div>
      </div>

      {/* Invite Card */}
      <div className="gd-mm-invite" onClick={onInviteFriend}>
        <div>
          <h3 className="gd-mm-invite-title">Invitér en ven til GameDate</h3>
          <p className="gd-mm-invite-sub">Del appen med nogen du kender</p>
        </div>
        <span className="gd-mm-invite-icon">🔗</span>
      </div>

      {/* Active Games */}
      {activeGames.length > 0 && (
        <div className="gd-mm-section">
          <h2 className="gd-mm-section-title">DINE AKTIVE SPIL</h2>
          <div className="gd-mm-active-list">
            {activeGames.map(game => {
              const isPlayer1 = game.player1_name === userDisplayName;
              const opponentName = isPlayer1 ? game.player2_name : game.player1_name;
              const isMyTurn = (game.game_state?.currentPlayer === 'player1' && isPlayer1) || 
                               (game.game_state?.currentPlayer === 'player2' && !isPlayer1);
              const isConnect4 = game.game_state?.cols === 7;

              return (
                <div key={game.id} className={`gd-active-card ${isMyTurn ? 'my-turn' : ''}`}>
                  <div>
                    <div className="gd-active-opponent">
                      {opponentName.includes('Venter') ? '🔗 Venter på ven...' : opponentName}
                    </div>
                    <div className="gd-active-meta">
                      {isConnect4 ? '🔵 4 på stribe' : '🎲 Backgammon'} • {isMyTurn ? 'Din tur' : 'Venter...'}
                    </div>
                  </div>
                  <div className="gd-active-actions">
                    <button 
                      className="gd-active-delete"
                      onClick={() => {
                        if (window.confirm('Er du sikker på, at du vil afslutte dette spil?')) {
                          onDeleteGame(game.id);
                        }
                      }}
                    >🗑️</button>
                    <button 
                      className={`gd-active-play ${isMyTurn ? 'turn' : ''}`}
                      onClick={() => onResumeGame(game)}
                    >SPIL</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Opponents Feed */}
      <div className="gd-mm-section">
        <h2 className="gd-mm-section-title">FIND MODSTANDER</h2>
        <div className="gd-mm-feed">
          {opponents.map((opponent) => (
            <div key={opponent.id} className="gd-opp-card">
              <div className="gd-opp-avatar">{opponent.avatar}</div>
              <div className="gd-opp-info">
                <h3 className="gd-opp-name">{opponent.name}</h3>
                <p className="gd-opp-level">Niveau: {opponent.level}</p>
                <div className="gd-opp-actions">
                  <button 
                    className="gd-opp-play"
                    disabled={isLimitReached}
                    onClick={() => onStartGame ? onStartGame(opponent) : onNavigate('game')}
                  >
                    {isLimitReached ? 'Grænse nået' : 'Spil'}
                  </button>
                  <button 
                    className="gd-opp-profile"
                    onClick={() => onViewProfile ? onViewProfile(opponent.name) : null}
                  >
                    Se profil
                  </button>
                </div>
              </div>
              <div className="gd-opp-heart">♡</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
