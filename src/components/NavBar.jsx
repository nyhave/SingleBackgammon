import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

console.log('NavBar.jsx module loaded');

const linkClass = ({ isActive }) =>
  `hover:underline${isActive ? ' font-bold' : ''}`;

export default function NavBar() {
  useEffect(() => {
    console.log('NavBar component mounted');
  }, []);
  return (
    <nav className="bg-gray-800 p-4 text-white flex gap-4">
      <NavLink to="/" className={linkClass} end>
        Home
      </NavLink>
      <NavLink to="profile" className={linkClass}>
        Profile
      </NavLink>
      <NavLink to="lobby" className={linkClass}>
        Lobby
      </NavLink>
      <NavLink to="game" className={linkClass}>
        Game
      </NavLink>
      <NavLink to="post-match" className={linkClass}>
        Post Match
      </NavLink>
    </nav>
  );
}
