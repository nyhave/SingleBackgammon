import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import Lobby from './pages/Lobby.jsx';
import Game from './pages/Game.jsx';
import PostMatch from './pages/PostMatch.jsx';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    console.log(
      'App component mounted with routes: /, profile, lobby, game, post-match'
    );
  }, []);

  useEffect(() => {
    console.log(`Route change detected: ${location.pathname}`);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="lobby" element={<Lobby />} />
        <Route path="game" element={<Game />} />
        <Route path="post-match" element={<PostMatch />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
