import React from 'react';
import './GameScreen.css';
import MultiplayerGameController from '../components/MultiplayerGameController';

export default function GameScreen({ onNavigate, player1Name, player2Name, isAdmin }) {
  return (
    <div className="game-screen-wrapper">
      <MultiplayerGameController 
        initialPlayer1Name={player1Name} 
        initialPlayer2Name={player2Name} 
        autoStart={true} 
        isAdmin={isAdmin}
      />
      
      {/* Temporary button to simulate game over -> next screen */}
      <div style={{ textAlign: 'center', margin: '20px', position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100 }}>
        <button 
          onClick={() => onNavigate('postgame')}
          style={{ opacity: 0.3, fontSize: '10px' }}
        >
          Afslut Spil (Test)
        </button>
      </div>
    </div>
  );
}
