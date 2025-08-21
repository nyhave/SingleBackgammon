import { useEffect } from 'react';

console.log('Checker.jsx module loaded');

export default function Checker({ color }) {
  useEffect(() => {
    console.log('Checker component mounted');
  }, []);
  const colorClass =
    color === 'white' ? 'bg-white' : color === 'black' ? 'bg-black' : 'bg-transparent';

  return (
    <div
      className={`w-6 h-6 rounded-full border border-gray-700 mb-1 ${colorClass}`}
    />
  );
}
