import { useState, useEffect } from 'react';

console.log('Profile.jsx module loaded');

export default function Profile() {
  useEffect(() => {
    console.log('Profile page component mounted');
  }, []);
  const [profile, setProfile] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem('profile')) || {
          name: '',
          interests: '',
          playStyle: 'casual',
          bio: '',
          favoriteGames: '',
        }
      );
    } catch {
      return { name: '', interests: '', playStyle: 'casual', bio: '', favoriteGames: '' };
    }
  });
  const [editing, setEditing] = useState(!profile.name);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('profile', JSON.stringify(profile));
    setEditing(false);
  };

  if (editing) {
    return (
      <form onSubmit={handleSubmit}>
        <h1>Create Profile</h1>
        <div>
          <label>
            Display Name
            <input name="name" value={profile.name} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Interests
            <input name="interests" value={profile.interests} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            Favorite Games
            <input name="favoriteGames" value={profile.favoriteGames} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            Play Style
            <select name="playStyle" value={profile.playStyle} onChange={handleChange}>
              <option value="casual">Casual</option>
              <option value="competitive">Competitive</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Bio
            <textarea name="bio" value={profile.bio} onChange={handleChange} />
          </label>
        </div>
        <button type="submit">Save Profile</button>
      </form>
    );
  }

  return (
    <div>
      <h1>{profile.name}</h1>
      {profile.interests && <p>Interests: {profile.interests}</p>}
      {profile.favoriteGames && <p>Favorite games: {profile.favoriteGames}</p>}
      <p>Play style: {profile.playStyle}</p>
      {profile.bio && <p>{profile.bio}</p>}
      <button onClick={() => setEditing(true)}>Edit Profile</button>
    </div>
  );
}

