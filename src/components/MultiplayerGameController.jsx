/**
 * Multiplayer Game Controller
 * Manages game flow and Supabase synchronization
 */

import React, { useEffect, useState, useRef } from 'react'
import BackgammonGame from '../engine/BackgammonGame'
import BackgammonAI from '../engine/BackgammonAI'
import GameSyncService from '../services/GameSyncService'
import GameBoard from './GameBoard'
import ReportService from '../services/ReportService'

export default function MultiplayerGameController({ initialPlayer1Name, initialPlayer2Name, autoStart, isAdmin, onNavigate, gameId }) {
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
  const [autoSpeed, setAutoSpeed] = useState(800); // 1500, 800, 300
  const [loadTimeout, setLoadTimeout] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const chatRef = useRef([]);
  const syncRef = useRef(null);
  const initStarted = useRef(false);

  useEffect(() => { chatRef.current = chatMessages; }, [chatMessages]);

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
    }, autoSpeed);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlaying, gameState, autoSpeed]);


  useEffect(() => {
    if (autoStart && !initStarted.current) {
      initStarted.current = true;
      startGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  useEffect(() => {
    return () => {
      if (syncRef.current) {
        syncRef.current.unsubscribe();
      }
    };
  }, []);

  // Initialize game
  const startGame = async () => {
    const timer = setTimeout(() => {
      if (!gameStarted) {
        setLoadTimeout(true);
        ReportService.logError('MultiplayerGameController', new Error('Timeout: Spillet indlæste ikke indenfor 5 sekunder'));
      }
    }, 5000);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const existingGameId = gameId || urlParams.get('gameId');

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
          newGame.borne_off = gameData.game_state.borne_off || { player1: 0, player2: 0 };
          newGame.currentPlayer = gameData.game_state.currentPlayer || newGame.currentPlayer;
          newGame.dice = gameData.game_state.dice || newGame.dice;
          // Always use the engine's board so it shows immediately
          const mergedState = {
            ...gameData.game_state,
            board: gameData.game_state.board || newGame.board,
            bar: gameData.game_state.bar || newGame.bar,
            borne_off: gameData.game_state.borne_off || newGame.borne_off,
            availableDice: gameData.game_state.availableDice || [],
            legalMoves: gameData.game_state.legalMoves || [],
          };
          setGameState(mergedState);
          if (gameData.game_state.dice) {
            setDice(gameData.game_state.dice);
          }
        } else {
          // No state in DB at all, use fresh engine state
          setGameState(newGame.getGameState());
        }
      } else {
        sync = new GameSyncService(null)
        const createdGame = await sync.createGame(player1Name, player2Name)
        const initialState = newGame.getGameState()
        setGameState(initialState)
        window.history.pushState({}, '', `?gameId=${createdGame.id}`)
      }
      
      setSyncService(sync)
      syncRef.current = sync
      
      // Subscribe to updates
      sync.subscribeToGame((updatedState) => {
        if (updatedState.game_state) {
          setGameState(updatedState.game_state)
          
          if (updatedState.game_state.dice) {
            setDice(updatedState.game_state.dice);
          }
          
          if (updatedState.game_state.chat) {
            setChatMessages(updatedState.game_state.chat);
          }
          
          // Keep local game instance in sync
          if (newGame) {
            newGame.board = updatedState.game_state.board || newGame.board;
            newGame.bar = updatedState.game_state.bar || newGame.bar;
            newGame.borne_off = updatedState.game_state.borne_off || { player1: 0, player2: 0 };
            newGame.currentPlayer = updatedState.game_state.currentPlayer || newGame.currentPlayer;
            newGame.dice = updatedState.game_state.dice || newGame.dice;
          }
        }
      })
      
      // Safety check: ensure we actually have a board state before showing the UI
      if (newGame.board || (gameState && gameState.board)) {
        setGameStarted(true)
      } else {
        throw new Error('Spiltilstand manglede board-data')
      }
      if (existingGameId) {
        setMessage('Tilsluttet eksisterende spil!')
      } else {
        setMessage('Spillet er startet! Kopier URL\'en (adressen) for at invitere den anden spiller.')
      }
    } catch (err) {
      console.error("Fejl i startGame:", err);
      ReportService.logError('MultiplayerGameController', err);
      setMessage(`Fejl ved start af spil: ${err.message}`)
    } finally {
      clearTimeout(timer);
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
      syncService.updateGameState({ ...updated, chat: chatRef.current })
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
        await syncService.updateGameState({ ...updated, chat: chatRef.current })
      }
      
      setFromPoint(null)
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
      syncService.updateGameState({ ...updated, chat: chatRef.current })
    }

    setDice([0, 0])
  }

  // Check win condition and Auto-switch logic
  // Check win condition and Auto-switch logic
  useEffect(() => {
    if (!game || !gameState) return

    if (game.isGameOver()) {
      const winner = game.getWinner()
      const winnerName = winner === 'player1' ? player1Name : player2Name
      setMessage(`🎉 ${winnerName} vinder! Tillykke!`)
      setIsAutoPlaying(false); // Stop AI
      
      if (syncService) {
        syncService.finishGame(winnerName)
      }

      // Auto-navigate after 3 seconds
      if (onNavigate) {
        setTimeout(() => {
          onNavigate('postgame');
        }, 3000);
      }
      return
    }

    // Dynamic messages based on state
    if (gameState?.availableDice?.length === 0 && (dice[0] !== 0 || dice[1] !== 0)) {
      setMessage('Alle træk brugt. Skift spiller.')
    } else if (gameState?.gameState === 'moving' && (gameState?.availableDice?.length || 0) > 0 && (gameState?.legalMoves?.length || 0) === 0) {
      setMessage('Ingen mulige træk! Skift spiller.')
    } else if ((gameState?.availableDice?.length || 0) > 0) {
      setMessage(`${gameState.currentPlayer === 'player1' ? player1Name : player2Name} skal flytte brikker`)
    } else {
      setMessage(`${gameState?.currentPlayer === 'player1' ? player1Name : player2Name} skal kaste terninger`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState])

  // Handle Chat sending
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderName: initialPlayer1Name,
      text: chatInput,
      timestamp: new Date().toISOString()
    };

    const updatedChat = [...chatMessages, newMessage];
    setChatMessages(updatedChat);
    setChatInput('');

    if (syncService && gameState) {
      const updatedState = {
        ...gameState,
        chat: updatedChat
      };
      await syncService.updateGameState(updatedState);
    }
  };

  if (!gameStarted) {
    return (
      <div style={{padding: 40, textAlign: 'center'}}>
        <h2>{loadTimeout ? 'Hov! Det tager længere tid end normalt...' : 'Starter spil...'}</h2>
        {loadTimeout ? (
          <div>
            <p style={{color: '#666'}}>Vi har problemer med at forbinde til spillet.</p>
            <button 
              onClick={() => window.location.reload()}
              style={{ padding: '10px 20px', backgroundColor: '#3b5976', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px' }}
            >
              PRØV IGEN
            </button>
          </div>
        ) : (
          <div className="loading-spinner" style={{ margin: '20px auto', width: '40px', height: '40px', border: '4px solid #ddd', borderTop: '4px solid #3b5976', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        )}
        {message && <div style={{color: '#e63946', marginTop: 20, padding: 15, backgroundColor: '#fee', borderRadius: '8px', border: '1px solid #fca5a5'}}>{message}</div>}
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
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
              {/* Settings gear removed for MVP */}
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
            {/* Slot 1: AI Controls */}
            <div style={{ width: '100px', display: 'flex', justifyContent: 'center' }}>
              {isAdmin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', height: '45px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    style={{ 
                      backgroundColor: isAutoPlaying ? '#e74c3c' : '#2ecc71', 
                      color: 'white', border: 'none', padding: '6px 14px', 
                      borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', 
                      cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      width: '80px'
                    }}
                  >
                    {isAutoPlaying ? '⏹️ STOP' : '🤖 AUTO'}
                  </button>
                  {isAutoPlaying && (
                    <div style={{ display: 'flex', gap: '3px' }}>
                    <button onClick={() => setAutoSpeed(1500)} style={{ padding: '3px 4px', fontSize: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: autoSpeed === 1500 ? '#3b5976' : 'white', color: autoSpeed === 1500 ? 'white' : '#333', cursor: 'pointer' }}>x0.5</button>
                    <button onClick={() => setAutoSpeed(800)} style={{ padding: '3px 4px', fontSize: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: autoSpeed === 800 ? '#3b5976' : 'white', color: autoSpeed === 800 ? 'white' : '#333', cursor: 'pointer' }}>x1</button>
                    <button onClick={() => setAutoSpeed(300)} style={{ padding: '3px 4px', fontSize: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: autoSpeed === 300 ? '#3b5976' : 'white', color: autoSpeed === 300 ? 'white' : '#333', cursor: 'pointer' }}>x2</button>
                    <button onClick={() => setAutoSpeed(100)} style={{ padding: '3px 4px', fontSize: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: autoSpeed === 100 ? '#3b5976' : 'white', color: autoSpeed === 100 ? 'white' : '#333', cursor: 'pointer' }}>x3</button>
                  </div>
                  )}
                </div>
              )}
            </div>

            {/* Slot 2: Dice / "Færdig" */}
            <div style={{ width: '150px', display: 'flex', justifyContent: 'center' }}>
              {(dice[0] !== 0 || dice[1] !== 0) && (
                <div className="dice-display-small">
                  {gameState?.availableDice?.length > 0 ? (
                    gameState.availableDice.map((d, i) => (
                      <div key={i} className="mini-die">{d}</div>
                    ))
                  ) : (
                    <span style={{ color: '#3b5976', fontSize: '10px', fontWeight: 'bold', height: '28px', display: 'flex', alignItems: 'center' }}>Færdig!</span>
                  )}
                </div>
              )}
            </div>

            {/* Slot 3: Primary Action Button (Kast or Næste) */}
            <div style={{ width: '100px', display: 'flex', justifyContent: 'center' }}>
              {(dice[0] === 0 && dice[1] === 0) ? (
                <button className="dice-button" onClick={rollDice} style={{ padding: '8px 15px', width: '85px', fontSize: '11px' }}>
                  🎲 KAST
                </button>
              ) : (
                <button 
                  className="dice-button" 
                  onClick={switchPlayer} 
                  style={{
                    fontSize: 11, 
                    padding: '8px 12px', 
                    width: '85px',
                    backgroundColor: (gameState?.legalMoves?.length === 0 || gameState?.availableDice?.length === 0) ? '#27ae60' : '#7f8c8d',
                    color: 'white'
                  }}
                >
                  Næste
                </button>
              )}
            </div>

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
          <div className="chat-header" style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#3b5976', fontSize: '14px', backgroundColor: '#fdfefe', borderRadius: '0 12px 0 0' }}>
            💬 Chat med {myRole === 'player1' ? player2Name : player1Name}
          </div>
          <div className="chat-messages">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`chat-bubble ${msg.senderName === initialPlayer1Name ? 'sent' : 'received'}`}>
                {msg.text}
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
  )
}

