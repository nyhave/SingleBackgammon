import React, { useState } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MatchmakingScreen from './screens/MatchmakingScreen';
import GameScreen from './screens/GameScreen';
import PostGameScreen from './screens/PostGameScreen';
import StatsScreen from './screens/StatsScreen';
import SelectGameScreen from './screens/SelectGameScreen';

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const existingGameId = urlParams.get('gameId');

  // Even if joining a game, start at welcome so they can type their name
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userName, setUserName] = useState('Anna');
  const [opponentName, setOpponentName] = useState('Søren');
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileMode, setProfileMode] = useState('edit');
  const [viewingProfileName, setViewingProfileName] = useState('');
  const [selectedGameType, setSelectedGameType] = useState('backgammon');

  const handleProfileSave = (name) => {
    // Extract just the first name if they typed "Anna, 28"
    const firstName = name.split(',')[0].trim();
    setUserName(firstName);
    
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

  const handleGameChosen = (gameType) => {
    setSelectedGameType(gameType);
    setCurrentScreen('game');
  };

  const handleQuickLogin = (name, adminMode = false) => {
    setUserName(name);
    setIsAdmin(adminMode);
    if (existingGameId) {
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
          profileName={profileMode === 'edit' ? userName : viewingProfileName}
        />;
      case 'matchmaking':
        return <MatchmakingScreen 
          onNavigate={setCurrentScreen} 
          onStartGame={handleStartGame} 
          onViewProfile={handleViewProfile}
          onEditProfile={() => {
            setProfileMode('edit');
            setCurrentScreen('profile');
          }}
        />;
      case 'select_game':
        return <SelectGameScreen 
          onNavigate={setCurrentScreen} 
          opponentName={opponentName} 
          onGameChosen={handleGameChosen} 
        />;
      case 'game':
        // Pass selectedGameType if we ever need it in GameScreen
        return <GameScreen onNavigate={setCurrentScreen} player1Name={userName} player2Name={opponentName} isAdmin={isAdmin} />;
      case 'postgame':
        return <PostGameScreen 
          onNavigate={setCurrentScreen} 
          player1Name={userName} 
          player2Name={opponentName} 
          onViewProfile={handleViewProfile}
        />;
      case 'stats':
        return <StatsScreen onNavigate={setCurrentScreen} />;
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
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh', margin: 0, padding: 0 }}>
      {renderScreen()}
    </div>
  );
}
