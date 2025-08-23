// Represents a single point on the board
const Point = (point, index) => {
  const isTop = index < 12;
  const colorClass = index % 2 === 0
    ? isTop
      ? 'border-b-yellow-600'
      : 'border-t-yellow-600'
    : isTop
      ? 'border-b-orange-700'
      : 'border-t-orange-700';

  const checkers = [];
  for (let i = 0; i < point.count; i++) {
    checkers.push(
      React.createElement('div', {
        key: i,
        className: `w-6 h-6 rounded-full border border-gray-800 mb-1 ${
          point.color === 'white' ? 'bg-white' : 'bg-black'
        }`,
      })
    );
  }

  return React.createElement(
    'div',
    {
      key: index,
      'data-point': index,
      className: 'relative w-8 h-32 flex justify-center items-center',
    },
    React.createElement('div', {
      className: `absolute w-0 h-0 border-l-[16px] border-r-[16px] ${
        isTop ? 'border-b-[96px]' : 'border-t-[96px]'
      } border-l-transparent border-r-transparent ${colorClass} ${
        isTop ? 'top-0' : 'bottom-0'
      }`,
    }),
    React.createElement(
      'div',
      {
        className: `absolute w-full h-full flex flex-col ${
          isTop ? 'justify-end' : 'justify-start'
        } items-center ${isTop ? 'bottom-0' : 'top-0'}`,
      },
      checkers
    )
  );
};

// initial setup for the board state
const createInitialPoints = () => {
  const pts = Array(24)
    .fill(null)
    .map(() => ({ color: null, count: 0 }));

  // White checkers
  pts[0] = { color: 'white', count: 5 }; // point 13
  pts[11] = { color: 'white', count: 2 }; // point 24
  pts[16] = { color: 'white', count: 3 }; // point 8
  pts[18] = { color: 'white', count: 5 }; // point 6

  // Black checkers
  pts[23] = { color: 'black', count: 2 }; // point 1
  pts[12] = { color: 'black', count: 5 }; // point 12
  pts[4] = { color: 'black', count: 3 }; // point 17
  pts[6] = { color: 'black', count: 5 }; // point 19

  return pts;
};

// Game definition handled by boardgame.io
const Backgammon = {
  setup: () => ({ points: createInitialPoints() }),
};

// Board component rendering 24 points using game state
const Board = ({ G }) => {
  const points = G.points;

  return React.createElement(
    'div',
    { className: 'mx-auto' },
    React.createElement(
      'div',
      { className: 'grid grid-cols-12 gap-1' },
      points.slice(0, 12).map((p, i) => Point(p, i))
    ),
    React.createElement(
      'div',
      { className: 'grid grid-cols-12 gap-1' },
      points.slice(12).map((p, i) => Point(p, i + 12))
    )
  );
};

const { Client } = boardgameio;

const App = Client({ game: Backgammon, board: Board });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
