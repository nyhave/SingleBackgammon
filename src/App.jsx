import React, { useState, useEffect } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MatchmakingScreen from './screens/MatchmakingScreen';
import GameScreen from './screens/GameScreen';
import PostGameScreen from './screens/PostGameScreen';
import StatsScreen from './screens/StatsScreen';
import SelectGameScreen from './screens/SelectGameScreen';
import FeedbackButton from './components/FeedbackButton';
import ReportService from './services/ReportService';
import GameSyncService from './services/GameSyncService';

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const existingGameId = urlParams.get('gameId');

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('gamedate-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('gamedate-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Even if joining a game, start at welcome so they can type their name
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userName, setUserName] = useState('Anna');
  const [opponentName, setOpponentName] = useState('Søren');
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileMode, setProfileMode] = useState('edit');
  const [viewingProfileName, setViewingProfileName] = useState('');
  const [fullProfileName, setFullProfileName] = useState('Anna, 28');
  const [selectedGameType, setSelectedGameType] = useState('backgammon');
  const [activeGameId, setActiveGameId] = useState(null);
  const [activeGames, setActiveGames] = useState([]);
  
  useEffect(() => {
    const handleError = (event) => {
      // If it's a generic 'Script error.', it usually means a cross-origin issue or a missing resource
      let msg = event.message || 'Ukendt script fejl';
      if (msg === 'Script error.') {
        msg = `Script Error (Muligvis CORS eller manglende fil): ${event.filename || 'ukendt fil'} på linje ${event.lineno || '?'}`;
      }
      
      const error = event.error || new Error(msg);
      ReportService.logError(currentScreen, error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      ReportService.logError(currentScreen, error);
    });

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [currentScreen]);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.toLowerCase().includes('/admin')) {
      setIsAdmin(true);
      setCurrentScreen('stats');
    }
  }, []);

  const handleProfileSave = (name) => {
    // Extract just the first name if they typed "Anna, 28"
    const firstName = name.split(',')[0].trim();
    setUserName(firstName);
    setFullProfileName(name);
    
    if (existingGameId) {
      // If we are joining a game via URL, skip matchmaking and go straight to game
      setCurrentScreen('game');
    } else {
      // Otherwise, go to matchmaking to find an opponent
      setCurrentScreen('matchmaking');
    }
  };

  const handleStartGame = (opponent) => {
    const oppName = opponent.name.split(',')[0].trim();
    setOpponentName(oppName);
    setCurrentScreen('select_game');
  };

  const handleGameChosen = async (gameType) => {
    setSelectedGameType(gameType);
    ReportService.logGameStart(gameType);
    
    // Create game in DB to get a valid ID
    const service = new GameSyncService();
    try {
      let initialState = null;
      if (gameType === 'connect4') {
        initialState = {
          board: Array(7).fill(null).map(() => Array(6).fill(null)),
          currentPlayer: 'player1',
          isGameOver: false,
          winner: null,
          lastMove: null,
          rows: 6,
          cols: 7
        };
      }
      
      const newGame = await service.createGame(userName, opponentName, initialState);
      setActiveGameId(newGame.id);
      setCurrentScreen('game');
    } catch (err) {
      console.error("Kunne ikke oprette spil:", err);
      setCurrentScreen('game'); // Fallback to offline/local if DB fails
    }
  };

  const fetchActiveGames = async (name) => {
    if (!name) return;
    const service = new GameSyncService();
    const games = await service.getActiveGames(name);
    setActiveGames(games);
  };

  const handleQuickLogin = (name, adminMode = false) => {
    setUserName(name);
    fetchActiveGames(name);
    // Add default ages for test users
    const ages = { 'Anna': '28', 'Søren': '30', 'Matilde': '26', 'Casper': '32' };
    setFullProfileName(name + (ages[name] ? `, ${ages[name]}` : ''));
    setIsAdmin(adminMode);
    if (adminMode) {
      setCurrentScreen('stats');
    } else if (existingGameId) {
      setCurrentScreen('game');
    } else {
      setCurrentScreen('matchmaking');
    }
  };

  const handleViewProfile = (name) => {
    setViewingProfileName(name);
    setProfileMode('view');
    setCurrentScreen('profile');
  };

  const handleInviteFriend = async () => {
    const appUrl = `${window.location.origin}${window.location.pathname}`;
    const shareData = {
      title: 'GameDate',
      text: 'Prøv GameDate – spil brætspil og mød nye mennesker! 🎲❤️',
      url: appUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled:', err);
      }
    } else {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(appUrl);
        } else {
          // Fallback for HTTP / older browsers
          const ta = document.createElement('textarea');
          ta.value = appUrl;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        alert('Link kopieret til udklipsholder! 🔗');
      } catch (e) {
        alert(`Del dette link med din ven:\n${appUrl}`);
      }
    }
  };

  const handleResumeGame = (game) => {
    setActiveGameId(game.id);
    setOpponentName(game.player1_name === userName ? game.player2_name : game.player1_name);
    setSelectedGameType(game.game_state?.cols === 7 ? 'connect4' : 'backgammon');
    setCurrentScreen('game');
  };

  const handleDeleteGame = async (gameId) => {
    const service = new GameSyncService();
    try {
      await service.deleteGame(gameId);
      fetchActiveGames(userName);
    } catch (err) {
      console.error("Kunne ikke slette spil:", err);
    }
  };

  useEffect(() => {
    // Refresh active games every 30 seconds when on matchmaking screen
    let interval;
    if (currentScreen === 'matchmaking' && userName) {
      fetchActiveGames(userName);
      interval = setInterval(() => fetchActiveGames(userName), 30000);
    }
    return () => clearInterval(interval);
  }, [currentScreen, userName]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen 
          onNavigate={(screen) => {
            if (screen === 'profile') setProfileMode('edit');
            setCurrentScreen(screen);
          }} 
          onLogin={handleQuickLogin} 
        />;
      case 'profile':
        return <ProfileScreen 
          onNavigate={setCurrentScreen} 
          onSave={handleProfileSave} 
          mode={profileMode}
          profileName={profileMode === 'edit' ? fullProfileName : viewingProfileName}
        />;
      case 'matchmaking':
        return <MatchmakingScreen 
          onNavigate={setCurrentScreen} 
          onStartGame={handleStartGame} 
          onResumeGame={handleResumeGame}
          onDeleteGame={handleDeleteGame}
          onViewProfile={handleViewProfile}
          onInviteFriend={handleInviteFriend}
          onEditProfile={() => {
            setProfileMode('edit');
            setCurrentScreen('profile');
          }}
          userDisplayName={fullProfileName}
          activeGames={activeGames}
        />;
      case 'select_game':
        return <SelectGameScreen 
          onNavigate={setCurrentScreen} 
          opponentName={opponentName} 
          onGameChosen={handleGameChosen} 
        />;
      case 'game':
        return <GameScreen 
          onNavigate={setCurrentScreen} 
          player1Name={userName} 
          player2Name={opponentName} 
          isAdmin={isAdmin} 
          gameType={selectedGameType}
          gameId={activeGameId}
        />;
      case 'postgame':
        return <PostGameScreen 
          onNavigate={setCurrentScreen} 
          player1Name={userName} 
          player2Name={opponentName} 
          onViewProfile={handleViewProfile}
        />;
      case 'stats':
        return <StatsScreen 
          onNavigate={setCurrentScreen} 
          onStartAIGame={() => {
            setUserName('Admin (Test)');
            setOpponentName('Robot-AI');
            setCurrentScreen('select_game');
          }}
        />;
      default:
        return <WelcomeScreen 
          onNavigate={(screen) => {
            if (screen === 'profile') setProfileMode('edit');
            setCurrentScreen(screen);
          }} 
        />;
    }
  };

  return (
    <div
      data-theme={darkMode ? 'dark' : 'light'}
      style={{ fontFamily: 'Arial, sans-serif', backgroundColor: 'var(--bg-1)', minHeight: '100vh', margin: 0, padding: 0 }}
    >
      {renderScreen()}
      <FeedbackButton currentScreen={currentScreen} />
      <button
        onClick={() => setDarkMode(d => !d)}
        title={darkMode ? 'Skift til lystema' : 'Skift til mørkt tema'}
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '135px',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: 'rgba(var(--gold-rgb), 0.9)',
          color: 'var(--gold-on)',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s',
        }}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
