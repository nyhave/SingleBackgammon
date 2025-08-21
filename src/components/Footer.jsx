import { useEffect } from 'react';

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
