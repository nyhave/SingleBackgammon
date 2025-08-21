import Checker from './Checker.jsx';
import { useEffect } from 'react';

// Render a 24-point board. If no board data is provided, we fall back to an
// empty board so the layout is still visible.
const EMPTY_BOARD = Array.from({ length: 24 }, () => ({ color: null, count: 0 }));

export default function Board({ board = [] }) {
  useEffect(() => {
    console.log('Board component mounted');
  }, []);
  const points = board.length ? board : EMPTY_BOARD;
  const topRow = points.slice(0, 12);
  const bottomRow = points.slice(12).reverse();

  return (
    <div className="p-4 bg-green-800 rounded-md space-y-2">
      <div className="grid grid-cols-12 gap-1">
        {topRow.map((point, index) => (
          <div
            key={index}
            className="flex flex-col-reverse justify-start items-center h-32 bg-amber-200"
          >
            {Array.from({ length: point.count }).map((_, i) => (
              <Checker key={i} color={point.color} />
            ))}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-12 gap-1">
        {bottomRow.map((point, index) => (
          <div
            key={index + 12}
            className="flex flex-col justify-start items-center h-32 bg-amber-200"
          >
            {Array.from({ length: point.count }).map((_, i) => (
              <Checker key={i} color={point.color} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
