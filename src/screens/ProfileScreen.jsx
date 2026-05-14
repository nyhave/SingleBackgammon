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
    <div className="profile-container">
      <h1 className="profile-header">{mode === 'edit' ? 'DIN PROFIL' : `${profile.username.split(',')[0].toUpperCase()}S PROFIL`}</h1>

      {mode === 'edit' ? (
        <div className="add-photo-btn">
          [ ] TILFØJ BILLEDE
        </div>
      ) : (
        <div className="add-photo-btn" style={{ border: 'none', fontSize: '60px', padding: '20px' }}>
          {profile.username.startsWith('Søren') ? '🧑' : '👩'}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="username">Brugernavn:</label>
        {mode === 'edit' ? (
          <input 
            type="text" 
            id="username"
            name="username"
            className="form-input" 
            value={profile.username}
            onChange={handleChange}
          />
        ) : (
          <div className="view-mode-text" style={{ padding: '12px', color: 'white', backgroundColor: '#3b5976', borderRadius: '8px' }}>{profile.username}</div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="bio">Biografi:</label>
        {mode === 'edit' ? (
          <input 
            type="text" 
            id="bio"
            name="bio"
            className="form-input" 
            value={profile.bio}
            onChange={handleChange}
          />
        ) : (
          <div className="view-mode-text" style={{ padding: '12px', color: 'white', backgroundColor: '#3b5976', borderRadius: '8px' }}>{profile.bio}</div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="level">Niveau:</label>
        {mode === 'edit' ? (
          <select 
            id="level"
            name="level"
            className="form-input" 
            value={profile.level}
            onChange={handleChange}
          >
            <option value="Begynder">Begynder</option>
            <option value="Mellemliggende">Mellemliggende</option>
            <option value="Ekspert">Ekspert</option>
          </select>
        ) : (
          <div className="view-mode-text" style={{ padding: '12px', color: 'white', backgroundColor: '#3b5976', borderRadius: '8px' }}>{profile.level}</div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="seeking">Søger:</label>
        {mode === 'edit' ? (
          <input 
            type="text" 
            id="seeking"
            name="seeking"
            className="form-input" 
            value={profile.seeking}
            onChange={handleChange}
          />
        ) : (
          <div className="view-mode-text" style={{ padding: '12px', color: 'white', backgroundColor: '#3b5976', borderRadius: '8px' }}>{profile.seeking}</div>
        )}
      </div>

      {mode === 'edit' ? (
        <button 
          className="save-button"
          onClick={handleSave}
        >
          [ GEM PROFIL ]
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button 
            onClick={() => onNavigate('matchmaking')}
            style={{ flex: 1, backgroundColor: 'transparent', color: '#ff4b2b', border: '2px solid #ff4b2b', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
          >
            TILBAGE
          </button>
          <button 
            onClick={() => onNavigate('select_game')}
            style={{ flex: 1, backgroundColor: '#ff4b2b', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
          >
            UDFORDR IGEN
          </button>
        </div>
      )}
    </div>
  );
}
