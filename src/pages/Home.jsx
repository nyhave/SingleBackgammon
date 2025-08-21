import { useEffect } from 'react';

console.log('Home.jsx module loaded');

export default function Home() {
  useEffect(() => {
    console.log('Home page component mounted');
  }, []);
  return <h1>Welcome to Single Backgammon</h1>;
}
