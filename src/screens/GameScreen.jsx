import React from 'react';
import './GameScreen.css';
import MultiplayerGameController from '../components/MultiplayerGameController';
import ConnectFourController from '../components/ConnectFourController';

export default function GameScreen({ onNavigate, player1Name, player2Name, isAdmin, gameType, gameId }) {
  return (
    <div className="game-screen-wrapper">
      {gameType === 'connect4' ? (
        <ConnectFourController 
          initialPlayer1Name={player1Name} 
          initialPlayer2Name={player2Name} 
          isAdmin={isAdmin}
          onNavigate={onNavigate}
          gameId={gameId}
        />
      ) : (
        <MultiplayerGameController 
          initialPlayer1Name={player1Name} 
          initialPlayer2Name={player2Name} 
          autoStart={true} 
          isAdmin={isAdmin}
          onNavigate={onNavigate}
          gameId={gameId}
        />
      )}
      
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
