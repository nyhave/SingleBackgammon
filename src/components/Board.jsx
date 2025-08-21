import Checker from './Checker.jsx';

export default function Board({ board = [] }) {
  return (
    <div className="board">
      {board.map((point, index) => (
        <div key={index} className="point">
          {Array.from({ length: point.count }).map((_, i) => (
            <Checker key={i} color={point.color} />
          ))}
        </div>
      ))}
    </div>
  );
}
