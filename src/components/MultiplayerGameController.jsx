/**
 * Multiplayer Game Controller
 * Manages game flow and Supabase synchronization
 */

import React, { useEffect, useState, useRef } from 'react'
import BackgammonGame from '../engine/BackgammonGame'
import BackgammonAI from '../engine/BackgammonAI'
import GameSyncService from '../services/GameSyncService'
import GameBoard from './GameBoard'

export default function MultiplayerGameController({ initialPlayer1Name, initialPlayer2Name, autoStart, isAdmin }) {
  const [game, setGame] = useState(null)
  const [syncService, setSyncService] = useState(null)
  const [gameState, setGameState] = useState(null)
  const [player1Name, setPlayer1Name] = useState(initialPlayer1Name || 'Spiller 1')
  const [player2Name, setPlayer2Name] = useState(initialPlayer2Name || 'Spiller 2')
  const [gameStarted, setGameStarted] = useState(false)
  const [fromPoint, setFromPoint] = useState(null)
  const [message, setMessage] = useState('')
  const [dice, setDice] = useState([0, 0])
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const initStarted = useRef(false);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || !game || !gameState) return;

    const timer = setTimeout(async () => {
      // 1. If we need to roll
      if (gameState.dice[0] === 0 && gameState.dice[1] === 0) {
        rollDice();
        return;
      }

      // 2. If no legal moves, switch turn
      if (gameState.legalMoves.length === 0) {
        switchPlayer();
        return;
      }

      // 3. Get best move from AI
      const bestMove = BackgammonAI.getBestMove(gameState);
      if (bestMove) {
        await executeMove(bestMove.from, bestMove.to);
      } else {
        switchPlayer();
      }
    }, 800); // 800ms delay between actions for visibility

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlaying, gameState]);


  useEffect(() => {
    if (autoStart && !gameStarted && !initStarted.current) {
      initStarted.current = true;
      startGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, gameStarted]);

  // Initialize game
  const startGame = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const existingGameId = urlParams.get('gameId');

      const newGame = new BackgammonGame()
      setGame(newGame)
      
      let sync;
      if (existingGameId) {
        sync = new GameSyncService(existingGameId);
        const gameData = await sync.getGameState();
        
        if (gameData) {
          if (gameData.player1_name) setPlayer1Name(gameData.player1_name);
          if (gameData.player2_name) setPlayer2Name(gameData.player2_name);
        }

        if (gameData.game_state) {
          newGame.board = gameData.game_state.board || newGame.board;
          newGame.bar = gameData.game_state.bar || newGame.bar;
          newGame.borne_off = gameData.game_state.borne_off || newGame.borne_off;
          newGame.currentPlayer = gameData.game_state.currentPlayer || newGame.currentPlayer;
          newGame.dice = gameData.game_state.dice || newGame.dice;
          setGameState(gameData.game_state);
          if (gameData.game_state.dice) {
            setDice(gameData.game_state.dice);
          }
        }
      } else {
        sync = new GameSyncService(null)
        const createdGame = await sync.createGame(player1Name, player2Name)
        setGameState(newGame.getGameState())
        window.history.pushState({}, '', `?gameId=${createdGame.id}`)
      }
      
      setSyncService(sync)
      
      // Subscribe to updates
      sync.subscribeToGame((updatedState) => {
        if (updatedState.game_state) {
          setGameState(updatedState.game_state)
          
          if (updatedState.game_state.dice) {
            setDice(updatedState.game_state.dice);
          }
          
          // Keep local game instance in sync
          if (newGame) {
            newGame.board = updatedState.game_state.board;
            newGame.bar = updatedState.game_state.bar;
            newGame.borne_off = updatedState.game_state.borne_off;
            newGame.currentPlayer = updatedState.game_state.currentPlayer;
            newGame.dice = updatedState.game_state.dice;
          }
        }
      })
      
      setGameStarted(true)
      if (existingGameId) {
        setMessage('Tilsluttet eksisterende spil!')
      } else {
        setMessage('Spillet er startet! Kopier URL\'en (adressen) for at invitere den anden spiller.')
      }
    } catch (err) {
      console.error("Fejl i startGame:", err);
      setMessage(`Fejl ved start af spil: ${err.message}`)
    }
  }

  // Roll dice
  const rollDice = () => {
    if (!game) return
    
    const rolledDice = game.rollDice()
    setDice(rolledDice)
    setMessage(`Du kastede: ${rolledDice[0]} og ${rolledDice[1]}`)
    
    const updated = game.getGameState()
    setGameState(updated)
    
    if (syncService) {
      syncService.updateGameState(updated)
    }
  }
  // Handle point click - two-click move system
  const handlePointClick = async (pointIndex) => {
    if (!game || (dice[0] === 0 && dice[1] === 0)) {
      setMessage('Kast først terning!')
      return
    }

    const currentPlayer = game.currentPlayer
    const isOurTurn = (currentPlayer === 'player1' && player1Name === initialPlayer1Name) || 
                      (currentPlayer === 'player2' && player2Name === initialPlayer1Name)

    if (!isOurTurn) {
      setMessage('Det er ikke din tur!')
      return
    }

    // First click - select source
    if (fromPoint === null) {
      if (pointIndex === 'bar') {
        if (gameState.bar[currentPlayer] > 0) {
          setFromPoint('bar')
          setMessage('Brik fra Bar valgt. Vælg destination.')
        } else {
          setMessage('Du har ingen brikker på Bar.')
        }
      } else if (typeof pointIndex === 'number') {
        const point = gameState.board[pointIndex]
        if (point[currentPlayer] > 0) {
          if (gameState.bar[currentPlayer] > 0) {
            setMessage('Du skal flytte dine brikker fra Bar først!')
          } else {
            setFromPoint(pointIndex)
            setMessage(`Punkt ${pointIndex + 1} valgt. Vælg destination.`)
          }
        } else {
          setMessage('Vælg et punkt med dine egne brikker.')
        }
      }
      return
    }

    // Second click - select destination and execute
    if (pointIndex !== fromPoint) {
      await executeMove(fromPoint, pointIndex)
    } else {
      setFromPoint(null)
      setMessage('Valg annulleret.')
    }
  }

  // Execute the move
  const executeMove = async (from, to) => {
    if (!game) return

    // Try all available dice to find a legal move
    const availableDice = gameState.availableDice || []
    let moveSuccessful = false

    // We try to find which die can achieve this move
    for (const die of [...new Set(availableDice)]) {
      if (game.makeMove(from, to, die)) {
        moveSuccessful = true
        break
      }
    }
    
    if (moveSuccessful) {
      const updated = game.getGameState()
      setGameState(updated)
      
      if (syncService) {
        await syncService.logMove(game.currentPlayer === 'player1' ? player1Name : player2Name, { from, to })
        await syncService.updateGameState(updated)
      }
      
      setMessage(`✓ Træk udført!`)
      setFromPoint(null)

      // Auto-check for no more moves
      if (updated.legalMoves.length === 0 && updated.availableDice.length > 0) {
        setMessage('Ingen flere mulige træk. Tryk på "Næste Spiller".')
      } else if (updated.availableDice.length === 0) {
        setMessage('Alle træk brugt. Tryk på "Næste Spiller".')
      }
    } else {
      setMessage('Ugyldigt træk! Prøv igen.')
      setFromPoint(null)
    }
  }

  // Switch player
  const switchPlayer = () => {
    if (!game) return
    
    game.switchPlayer()
    const updated = game.getGameState()
    setGameState(updated)
    
    if (syncService) {
      syncService.updateGameState(updated)
    }
    
    setMessage(`${game.currentPlayer === 'player1' ? player1Name : player2Name} skal trække`)
    setDice([0, 0])
  }

  // Check win condition and Auto-switch logic
  useEffect(() => {
    if (!game || !gameState) return

    if (game.isGameOver()) {
      const winner = game.getWinner()
      const winnerName = winner === 'player1' ? player1Name : player2Name
      setMessage(`🎉 ${winnerName} vinder! Tillykke!`)
      
      if (syncService) {
        syncService.finishGame(winnerName)
      }
      return
    }

    // Check if player has no moves left after rolling
    if (gameState.gameState === 'moving' && gameState.availableDice.length > 0 && gameState.legalMoves.length === 0) {
      setMessage('Ingen mulige træk! Skift spiller.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState])

  // Dummy Chat messages for MVP
  const chatMessages = [
    { id: 1, sender: 'opponent', text: 'Godt træk!' },
    { id: 2, sender: 'me', text: 'Tak! Er du her ofte?' }
  ];

  if (!gameStarted) {
    return (
      <div style={{padding: 20}}>
        <h2>Starter spil...</h2>
        {message && <div style={{color: 'red', marginTop: 10, padding: 10, backgroundColor: '#fee'}}>{message}</div>}
      </div>
    )
  }

  const myRole = player1Name === initialPlayer1Name ? 'player1' : 'player2';
  const opponentRole = myRole === 'player1' ? 'player2' : 'player1';
  const activePlayer = gameState?.currentPlayer;

  const validDestinations = fromPoint !== null && gameState?.legalMoves 
    ? gameState.legalMoves.filter(m => m.from === fromPoint).map(m => m.to)
    : [];

  return (
    <div className="game-screen-container">
      <div className="game-main-layout">
        <div className="game-board-side">
          {/* Top Bar */}
          <div className="game-topbar">
            <div className="topbar-left">
              <span className="topbar-back" onClick={() => window.location.href = '/'}>&lt;</span>
              <span>SPIL & CHAT</span>
            </div>
            <div className="topbar-right">
              ⚙️
            </div>
          </div>

          {/* Player Headers */}
          <div className="player-headers" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.7)', color: '#000', fontWeight: 'bold' }}>
            {/* Left Player (The other person) */}
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '8px',
              backgroundColor: activePlayer === opponentRole ? 'rgba(46, 204, 113, 0.3)' : 'transparent',
              border: activePlayer === opponentRole ? '2px solid #2ecc71' : '2px solid transparent',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                width: '12px', height: '12px', borderRadius: '50%', 
                backgroundColor: opponentRole === 'player1' ? '#fdfefe' : '#17202a', 
                border: '1px solid #7f8c8d' 
              }}></div>
              <span className="player-avatar">{opponentRole === 'player1' ? '👩' : '🧑'}</span> 
              {myRole === 'player1' ? player2Name : player1Name}
            </div>
            
            {/* Right Player (Me / Du) */}
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '8px',
              backgroundColor: activePlayer === myRole ? 'rgba(46, 204, 113, 0.3)' : 'transparent',
              border: activePlayer === myRole ? '2px solid #2ecc71' : '2px solid transparent',
              transition: 'all 0.3s ease'
            }}>
              Du ({initialPlayer1Name}) <span className="player-avatar">{myRole === 'player1' ? '👩' : '🧑'}</span>
              <div style={{ 
                width: '12px', height: '12px', borderRadius: '50%', 
                backgroundColor: myRole === 'player1' ? '#fdfefe' : '#17202a', 
                border: '1px solid #7f8c8d' 
              }}></div>
            </div>
          </div>

          {/* Board Area */}
          <div className="board-wrapper">
            {gameState && <GameBoard gameState={gameState} onPointClick={handlePointClick} selectedPoint={fromPoint} validDestinations={validDestinations} />}
          </div>

          {/* Controls Bar (Moved from overlay to avoid board overlap) */}
          <div className="game-controls-bar">
            {isAdmin && (
              <button 
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                style={{ 
                  backgroundColor: isAutoPlaying ? '#e74c3c' : '#2ecc71', 
                  color: 'white', border: 'none', padding: '5px 12px', 
                  borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', 
                  cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {isAutoPlaying ? '⏹️ STOP AUTO' : '🤖 AUTO'}
              </button>
            )}

            {(dice[0] === 0 && dice[1] === 0) ? (
              <button className="dice-button" onClick={rollDice} style={{ padding: '8px 15px' }}>
                🎲 KAST
              </button>
            ) : (
              <div className="dice-display-small">
                {gameState?.availableDice?.map((d, i) => (
                  <div key={i} className="mini-die">{d}</div>
                ))}
                {gameState?.availableDice?.length === 0 && (
                  <span style={{ color: '#3b5976', fontSize: '10px', fontWeight: 'bold' }}>Færdig!</span>
                )}
              </div>
            )}

            {(dice[0] !== 0 || dice[1] !== 0) && game && (
              <button 
                className="dice-button" 
                onClick={switchPlayer} 
                style={{
                  fontSize: 10, 
                  padding: '8px 12px', 
                  backgroundColor: (gameState?.legalMoves?.length === 0 || gameState?.availableDice?.length === 0) ? '#27ae60' : '#7f8c8d',
                  color: 'white'
                }}
              >
                Næste
              </button>
            )}

            {message && !isAutoPlaying && (
              <div className="game-msg-toast">
                {message}
              </div>
            )}
          </div>

          {/* Score Bar */}
          <div className="score-bar">
            <span>{player1Name === initialPlayer1Name ? player2Name : player1Name}</span>
            <span className="score-center">1 : 3</span>
            <span>Du ({initialPlayer1Name})</span>
          </div>
        </div>

        {/* Chat Section */}
        <div className="chat-section">
          <div className="chat-messages">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`chat-bubble ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input-area">
            <div className="chat-add-btn">+</div>
            <input type="text" className="chat-input" placeholder="Skriv en besked..." />
            <button className="chat-send-btn">➤</button>
          </div>
        </div>
      </div>
    </div>
  )
}

