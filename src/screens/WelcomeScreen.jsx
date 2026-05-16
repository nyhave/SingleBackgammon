import React, { useState, useEffect } from 'react';
import './WelcomeScreen.css';
import version from '../version.json';

export default function WelcomeScreen({ onNavigate, onLogin }) {
  const [selectedProfile, setSelectedProfile] = useState('Anna');
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('lastTestProfile');
    if (savedProfile) {
      setSelectedProfile(savedProfile);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('lastTestProfile', selectedProfile);
    if (onLogin) {
      onLogin(selectedProfile, false);
    }
  };

  return (
    <div className="gd-welcome">
      {/* Background image with circular mask */}
      <div className="gd-welcome-visual">
        <div className="gd-circle-mask">
          <img
            src={`${process.env.PUBLIC_URL}/assets/welcome_bg.png`}
            alt="Backgammon ved stearinlys"
            className="gd-circle-img"
          />
        </div>
      </div>

      {/* Logo */}
      <div className="gd-logo-area">
        <div className="gd-split-heart">
          <svg viewBox="0 0 64 58" className="gd-heart-svg">
            <path
              className="heart-left"
              d="M32 56 C32 56, 2 36, 2 18 C2 8, 10 2, 18 2 C24 2, 29 6, 32 10"
            />
            <path
              className="heart-right"
              d="M32 56 C32 56, 62 36, 62 18 C62 8, 54 2, 46 2 C40 2, 35 6, 32 10"
            />
          </svg>
        </div>
        <h1 className="gd-logo-text">GameDate</h1>
      </div>

      {/* Divider */}
      <div className="gd-divider">
        <div className="gd-divider-line"></div>
        <span className="gd-divider-heart">♡</span>
        <div className="gd-divider-line"></div>
      </div>

      {/* Slogan */}
      <h2 className="gd-slogan">
        Mød nye mennesker.<br />
        Spil. Grin. Skab forbindelse.
      </h2>

      <p className="gd-subtext">
        En dating app, hvor I mødes<br />
        om spil og gode samtaler.
      </p>

      {/* Actions */}
      <div className="gd-actions">
        <button
          className="gd-btn-primary"
          onClick={() => onNavigate('profile')}
        >
          Opret profil
        </button>

        <button
          className="gd-btn-outline"
          onClick={() => setShowLogin(!showLogin)}
        >
          Log ind
        </button>
      </div>

      {/* Quick Login (collapsed by default) */}
      {showLogin && (
        <div className="gd-quick-login">
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="gd-select"
          >
            <option value="Anna">Anna</option>
            <option value="Søren">Søren</option>
            <option value="Matilde">Matilde</option>
            <option value="Casper">Casper</option>
          </select>
          <button className="gd-btn-login" onClick={handleLogin}>
            Start →
          </button>
          <button
            className="gd-btn-admin"
            onClick={() => onLogin('Admin', true)}
          >
            Admin
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="gd-footer">
        <span className="gd-footer-icon">👥</span>
        <span>Spil sammen. Mød hinanden.</span>
      </div>

      <div className="gd-version">
        v{version.build} ({version.commit})
      </div>
    </div>
  );
}
