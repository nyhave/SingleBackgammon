/**
 * Connect Four Controller
 * Manages multiplayer state and game loop for 4-på-stribe
 */

import React, { useState, useEffect } from 'react';
import ConnectFourEngine from '../engine/ConnectFourEngine';
import ConnectFourAI from '../engine/ConnectFourAI';
import ConnectFourBoard from './ConnectFourBoard';
import GameSyncService from '../services/GameSyncService';

export default function ConnectFourController({ initialPlayer1Name, initialPlayer2Name, isAdmin, onNavigate, gameId }) {
  const [game] = useState(new ConnectFourEngine());
  const [gameState, setGameState] = useState(game.getGameState());
  const [syncService, setSyncService] = useState(null);
  const [message, setMessage] = useState('');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'System', text: 'Velkommen til 4 på stribe! ❤️' }
  ]);

  const player1Name = initialPlayer1Name || 'Spiller 1';
  const player2Name = initialPlayer2Name || 'Spiller 2';
  const myRole = player1Name === initialPlayer1Name ? 'player1' : 'player2';

  // Initialize Multiplayer
  useEffect(() => {
    const id = gameId || new URLSearchParams(window.location.search).get('gameId') || 'c4_default';
    const service = new GameSyncService(id);
    
    setSyncService(service);
    service.subscribeToGame((remoteRow) => {
      if (remoteRow && remoteRow.game_state) {
        game.setGameState(remoteRow.game_state);
        setGameState({ ...game.getGameState() });
      }
    });

    return () => service.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync state updates
  useEffect(() => {
    if (gameState.isGameOver) {
      const winnerName = gameState.winner === 'draw' ? 'Uafgjort' : (gameState.winner === 'player1' ? player1Name : player2Name);
      setMessage(gameState.winner === 'draw' ? '🤝 Det blev uafgjort!' : `🎉 ${winnerName} vinder!`);
      
      if (syncService) {
        syncService.finishGame(gameState.winner);
      }

      if (onNavigate) {
        setTimeout(() => onNavigate('postgame'), 3000);
      }
    } else {
      const nextPlayer = gameState.currentPlayer === 'player1' ? player1Name : player2Name;
      setMessage(`Det er ${nextPlayer}'s tur`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.isGameOver]);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || gameState.isGameOver) return;

    const timer = setTimeout(() => {
      const bestCol = ConnectFourAI.getBestMove(gameState.board, gameState.currentPlayer);
      if (bestCol !== null) {
        handleColumnClick(bestCol);
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlaying, gameState]);

  const handleColumnClick = async (colIndex) => {
    if (gameState.isGameOver) return;
    
    // In multiplayer, check if it's my turn (for MVP we allow both if admin)
    if (!isAdmin && gameState.currentPlayer !== myRole) {
        setMessage('Vent på din tur...');
        return;
    }

    try {
      const success = game.makeMove(colIndex);
      if (success) {
        const updated = game.getGameState();
        setGameState({ ...updated }); // Spread to ensure new object reference
        if (syncService) {
          await syncService.updateGameState(updated);
        }
      }
    } catch (err) {
      console.error("Fejl ved træk:", err);
      setMessage("Der skete en fejl ved dit træk.");
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { id: Date.now(), sender: player1Name, text: chatInput }]);
    setChatInput('');
  };

  return (
    <div className="game-screen-container">
      {/* Top Bar */}
      <div className="game-topbar">
        <div className="topbar-left">
          <span className="topbar-back" onClick={() => onNavigate('matchmaking')}>←</span>
          <span>4 på stribe</span>
        </div>
        <div className="topbar-right">⚙️</div>
      </div>

      <div className="game-main-layout">
        <div className="game-board-side">
          {/* Message Area */}
          <div style={{ padding: '15px', textAlign: 'center', backgroundColor: '#fdfefe', borderBottom: '1px solid #eee' }}>
            <span style={{ fontWeight: 'bold', color: '#3b5976' }}>{message}</span>
          </div>

          <div className="board-wrapper">
             <ConnectFourBoard gameState={gameState} onColumnClick={handleColumnClick} />
          </div>

          {/* Controls */}
          <div className="game-controls-bar" style={{ padding: '20px' }}>
            {isAdmin && (
              <button 
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                style={{ 
                  backgroundColor: isAutoPlaying ? '#e74c3c' : '#2ecc71', 
                  color: 'white', border: 'none', padding: '10px 20px', 
                  borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' 
                }}
              >
                {isAutoPlaying ? '⏹️ STOP AUTO' : '🤖 AUTO TEST'}
              </button>
            )}
          </div>

          {/* Score Bar */}
          <div className="score-bar">
            <span>{player2Name}</span>
            <div className="score-center">Vs</div>
            <span>{player1Name} (Dig)</span>
          </div>
        </div>

        {/* Chat Section */}
        <div className="chat-section">
          <div className="chat-header" style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#3b5976' }}>
             💬 Chat med {player2Name}
          </div>
          <div className="chat-messages" style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
            {chatMessages.map(msg => (
              <div key={msg.id} style={{ marginBottom: '10px', textAlign: msg.sender === 'System' ? 'center' : 'left' }}>
                <span style={{ fontSize: '10px', color: '#888', display: 'block' }}>{msg.sender}</span>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '8px 12px', 
                  backgroundColor: msg.sender === 'System' ? '#eee' : '#d4f0fa',
                  borderRadius: '12px',
                  fontSize: '14px'
                }}>{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="chat-input-area">
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Skriv en besked..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="chat-send-btn" onClick={handleSendMessage}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}
