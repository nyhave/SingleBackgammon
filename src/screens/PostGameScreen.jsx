import React from 'react';
import './PostGameScreen.css';

export default function PostGameScreen({ onNavigate, player1Name, player2Name, onViewProfile }) {
  const winner = player1Name || 'Du';
  const opponent = player2Name || 'Modstander';

  return (
    <div className="postgame-container">
      <h1 className="postgame-title">Spil Afsluttet!</h1>

      <div className="postgame-card">
        <div className="crown-icon">👑</div>

        <h2 className="winner-text">VINDER: DU! ({winner})</h2>
        <p className="score-text">Point: 7-5</p>

        <button
          className="action-btn"
          onClick={() => {
            // Clear the gameId from the URL so we don't accidentally rejoin the old game
            window.history.replaceState({}, '', window.location.pathname);
            onNavigate('select_game');
          }}
        >
          [ SPIL IGEN MED {opponent.toUpperCase()} ]
        </button>

        <button
          className="action-btn secondary"
          onClick={() => onViewProfile ? onViewProfile(opponent) : null}
        >
          [ SE {opponent.toUpperCase()}S PROFIL ]
        </button>

        <button
          className="action-btn secondary"
          style={{ marginTop: '20px', backgroundColor: '#e74c3c', color: '#fff', border: 'none' }}
          onClick={() => {
            window.history.replaceState({}, '', window.location.pathname);
            onNavigate('matchmaking');
          }}
        >
          [ AFSLUT ]
        </button>
      </div>
    </div>
  );
}
