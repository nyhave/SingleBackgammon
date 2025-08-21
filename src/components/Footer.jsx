import { useEffect } from 'react';

console.log('Footer.jsx module loaded');

export default function Footer() {
  useEffect(() => {
    console.log('Footer component mounted');
  }, []);
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Single Backgammon</p>
    </footer>
  );
}
