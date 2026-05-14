import React, { useState, useEffect } from 'react';
import './WelcomeScreen.css';

export default function WelcomeScreen({ onNavigate, onLogin }) {
  const [selectedProfile, setSelectedProfile] = useState('Anna');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('lastTestProfile');
    if (savedProfile) {
      setSelectedProfile(savedProfile);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('lastTestProfile', selectedProfile);
    if (onLogin) {
      onLogin(selectedProfile, isAdmin);
    }
  };

  return (
    <div className="welcome-container">
      <div className="logo-container">
        <span className="heart-icon">❤️</span>
        <span className="dice-icon">🎲</span>
      </div>
      
      <h1 className="welcome-title">
        Velkommen til<br />Backgammon Hearts!
      </h1>
      
      <p className="welcome-description">
        Spil Backgammon.<br />
        Mød Singler.<br />
        Find Kærligheden.
      </p>

      <div className="quick-login-section" style={{ margin: '20px 0', width: '100%', maxWidth: '300px' }}>
        <select 
          value={selectedProfile} 
          onChange={(e) => setSelectedProfile(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', fontSize: '16px' }}
        >
          <option value="Anna">Anna</option>
          <option value="Søren">Søren</option>
          <option value="Matilde">Matilde</option>
          <option value="Casper">Casper</option>
        </select>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', color: 'white', fontSize: '14px' }}>
          <input 
            type="checkbox" 
            id="adminMode" 
            checked={isAdmin} 
            onChange={(e) => setIsAdmin(e.target.checked)} 
            style={{ marginRight: '8px' }}
          />
          <label htmlFor="adminMode" style={{ cursor: 'pointer' }}>Admin Mode (AI Aktiveret)</label>
        </div>

        <button 
          className="primary-button" 
          onClick={handleLogin}
          style={{ width: '100%', backgroundColor: '#ff4b2b', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}
        >
          LOG IND
        </button>

        {isAdmin && (
          <button 
            className="secondary-button" 
            onClick={() => onNavigate('stats')}
            style={{ width: '100%', backgroundColor: '#3b5976', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            📊 SE STATISTIK
          </button>
        )}
      </div>

      <div style={{ margin: '10px 0', color: '#888', fontSize: '14px' }}>— eller —</div>

      <button 
        className="secondary-button"
        onClick={() => onNavigate('profile')}
        style={{ width: '100%', maxWidth: '300px', backgroundColor: 'transparent', color: '#ff4b2b', border: '2px solid #ff4b2b', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
      >
        OPRET NY PROFIL
      </button>
    </div>
  );
}
