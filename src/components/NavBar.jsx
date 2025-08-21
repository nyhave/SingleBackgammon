import { NavLink } from 'react-router-dom';

const linkStyle = ({ isActive }) => ({
  marginRight: '1rem',
  fontWeight: isActive ? 'bold' : 'normal',
});

export default function NavBar() {
  return (
    <nav>
      <NavLink to="/" style={linkStyle} end>
        Home
      </NavLink>
      <NavLink to="/profile" style={linkStyle}>
        Profile
      </NavLink>
      <NavLink to="/lobby" style={linkStyle}>
        Lobby
      </NavLink>
      <NavLink to="/game" style={linkStyle}>
        Game
      </NavLink>
      <NavLink to="/post-match" style={linkStyle}>
        Post Match
      </NavLink>
    </nav>
  );
}
