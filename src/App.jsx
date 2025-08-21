import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import Lobby from './pages/Lobby.jsx';
import Game from './pages/Game.jsx';
import PostMatch from './pages/PostMatch.jsx';

export default function App() {
  useEffect(() => {
    console.log('App component mounted with routes: /, profile, lobby, game, post-match');
  }, []);
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="lobby" element={<Lobby />} />
        <Route path="game" element={<Game />} />
        <Route path="post-match" element={<PostMatch />} />
      </Route>
    </Routes>
  );
}
