import React, { useState } from 'react';
import './ProfileScreen.css';

export default function ProfileScreen({ onNavigate, onSave, mode = 'edit', profileName }) {
  const [profile, setProfile] = useState({
    username: profileName || 'Anna, 28, København',
    bio: 'Elsker kaffe og gode spil',
    level: 'Mellemliggende',
    seeking: 'Mand, 25-35'
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(profile.username);
    } else {
      onNavigate('matchmaking');
    }
  };

  return (
    <div className="gd-profile">
      <div className="gd-profile-header">
        <div className="gd-profile-back" onClick={() => onNavigate('matchmaking')}>←</div>
        <h1 className="gd-profile-title">
          {mode === 'edit' ? 'Din Profil' : `${profile.username.split(',')[0]}s Profil`}
        </h1>
        <div style={{ width: '30px' }}></div>
      </div>

      <div className="gd-profile-photo">
        {mode === 'edit' ? (
          <div className="gd-photo-placeholder">
            <span className="gd-photo-icon">📷</span>
            <span className="gd-photo-text">Tilføj billede</span>
          </div>
        ) : (
          <div className="gd-photo-avatar">
            {profile.username.startsWith('Søren') ? '🧑' : '👩'}
          </div>
        )}
      </div>

      {mode === 'edit' && (
        <p className="gd-profile-subtitle">{profile.username}</p>
      )}

      <div className="gd-form">
        <div className="gd-form-group">
          <label className="gd-label" htmlFor="username">Brugernavn</label>
          {mode === 'edit' ? (
            <input 
              type="text" id="username" name="username"
              className="gd-input" 
              value={profile.username}
              onChange={handleChange}
            />
          ) : (
            <div className="gd-view-field">{profile.username}</div>
          )}
        </div>

        <div className="gd-form-group">
          <label className="gd-label" htmlFor="bio">Biografi</label>
          {mode === 'edit' ? (
            <input 
              type="text" id="bio" name="bio"
              className="gd-input" 
              value={profile.bio}
              onChange={handleChange}
            />
          ) : (
            <div className="gd-view-field">{profile.bio}</div>
          )}
        </div>

        <div className="gd-form-group">
          <label className="gd-label" htmlFor="level">Niveau</label>
          {mode === 'edit' ? (
            <select id="level" name="level" className="gd-input gd-select" 
              value={profile.level} onChange={handleChange}>
              <option value="Begynder">Begynder</option>
              <option value="Mellemliggende">Mellemliggende</option>
              <option value="Ekspert">Ekspert</option>
            </select>
          ) : (
            <div className="gd-view-field">{profile.level}</div>
          )}
        </div>

        <div className="gd-form-group">
          <label className="gd-label" htmlFor="seeking">Søger</label>
          {mode === 'edit' ? (
            <input 
              type="text" id="seeking" name="seeking"
              className="gd-input" 
              value={profile.seeking}
              onChange={handleChange}
            />
          ) : (
            <div className="gd-view-field">{profile.seeking}</div>
          )}
        </div>
      </div>

      {mode === 'edit' ? (
        <button className="gd-btn-save" onClick={handleSave}>
          Gem profil
        </button>
      ) : (
        <div className="gd-profile-actions">
          <button className="gd-btn-outline-sm" onClick={() => onNavigate('matchmaking')}>
            Tilbage
          </button>
          <button className="gd-btn-primary-sm" onClick={() => onNavigate('select_game')}>
            Udfordr
          </button>
        </div>
      )}
    </div>
  );
}
