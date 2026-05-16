import React from 'react';
import './SelectGameScreen.css';

export default function SelectGameScreen({ onNavigate, opponentName, onGameChosen, gameId }) {
  const shareUrl = `${window.location.origin}${window.location.pathname}?gameId=${gameId}`;

  const handleShare = async () => {
    const shareData = {
      title: 'Spil med mig!',
      text: `Kom og spil mod mig!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed or cancelled:', err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link kopieret til udklipsholder! 🔗');
    }
  };
  const games = [
    {
      id: 'backgammon',
      name: 'Backgammon',
      emoji: '🎲',
      description: 'Det klassiske brætspil med taktik og held.',
      color: '#d4a373'
    },
    {
      id: 'connect4',
      name: '4 på stribe',
      emoji: '🔵',
      description: 'Hurtig og sjov strategi. Få fire på stribe før din modstander.',
      color: '#3b5976'
    }
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

        {opponentName === 'Venter...' && (
          <div className="share-section" style={{ 
            backgroundColor: '#fff', 
            padding: '20px', 
            borderRadius: '12px', 
            marginBottom: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
              Din ven skal bruge dette link for at deltage:
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={handleShare}
                style={{ 
                  backgroundColor: '#3b5976', 
                  color: 'white', 
                  border: 'none', 
                  padding: '12px 24px', 
                  borderRadius: '30px', 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🔗 DEL LINK NU
              </button>
            </div>
            <p style={{ marginTop: '12px', fontSize: '10px', color: '#999', wordBreak: 'break-all' }}>
              {shareUrl}
            </p>
          </div>
        )}

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
