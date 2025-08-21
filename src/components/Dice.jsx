import { useEffect } from 'react';

console.log('Dice.jsx module loaded');

export default function Dice({ values = [] }) {
  useEffect(() => {
    console.log('Dice component mounted');
  }, []);
  return (
    <div className="dice">
      {values.map((value, index) => (
        <div key={index} className={`die face-${value}`}>
          {value}
        </div>
      ))}
    </div>
  );
}
