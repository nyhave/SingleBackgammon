// Import React and ReactDOM as ES modules to ensure boardgame.io shares the
// same React instance. Mixing UMD and ESM builds can lead to runtime errors
// like "Objects are not valid as a React child" because multiple copies of
// React get loaded.  Loading everything from esm.sh keeps dependencies
// consistent across the app.
import React from 'https://esm.sh/react@18.3.1';
import ReactDOM from 'https://esm.sh/react-dom@18.3.1/client';
// Import the React-specific client from boardgame.io. Using the generic
// client ("boardgame.io/client") returns a plain object which causes React
// to warn that the element type is invalid.
// Explicitly pull React and ReactDOM in as peer dependencies so that
// boardgame.io uses the same instances and doesn't bundle its own
// copies.  Without this, React hooks can fail at runtime with errors
// like "Invalid hook call" because multiple React versions are loaded.
import { Client } from 'https://esm.sh/boardgame.io@0.50.2/react?deps=react@18.3.1,react-dom@18.3.1';

// Represents a single point on the board.
//
// Previously this was implemented as a simple function returning a React
// element. While React can handle arrays of elements as children, calling
// that function directly and returning the element occasionally resulted in
// "Objects are not valid as a React child" errors when React attempted to
// reconcile the array.  Rewriting it as a standard component makes the
// intent explicit and avoids the error.
const Point = ({ point, index, selected, onClick }) => {
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
      'data-point': index,
      onClick,
      className: `relative w-8 h-32 flex justify-center items-center cursor-pointer ${
        selected ? 'bg-green-200' : ''
      }`,
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
      ...checkers
    )
  );
};

// Simple component to render dice values as squares with numbers.
const Dice = ({ values }) => {
  if (!Array.isArray(values)) return null;
  return React.createElement(
    'div',
    { className: 'flex space-x-2 justify-center mt-2' },
    values.map((value, i) =>
      React.createElement(
        'div',
        {
          key: i,
          className:
            'w-8 h-8 flex items-center justify-center border border-gray-800 rounded bg-white',
        },
        value
      )
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
  setup: () => ({ points: createInitialPoints(), dice: [] }),
  moves: {
    moveChecker(G, ctx, from, to) {
      const color = ctx.currentPlayer === '0' ? 'white' : 'black';
      const distance = Math.abs(to - from);
      if (!Array.isArray(G.dice) || !G.dice.includes(distance)) return;
      const source = G.points[from];
      const target = G.points[to];
      if (source.color !== color || source.count === 0) return;
      if (target.color && target.color !== color && target.count > 1) return;

      source.count--;
      if (source.count === 0) source.color = null;

      if (target.color && target.color !== color && target.count === 1) {
        target.color = color;
        target.count = 1;
      } else {
        if (!target.color) target.color = color;
        target.count++;
      }

      const dieIndex = G.dice.indexOf(distance);
      if (dieIndex >= 0) G.dice.splice(dieIndex, 1);
      if (G.dice.length === 0) ctx.events.endTurn();
    },
  },
  turn: {
    onBegin(G, ctx) {
      // ctx.random is undefined when the Random plugin isn't used,
      // so roll dice using Math.random instead to avoid runtime errors.
      const rollDie = () => Math.floor(Math.random() * 6) + 1;
      G.dice = [rollDie(), rollDie()];
    },
  },
};

// Board component rendering 24 points using game state
const Board = ({ G, ctx, moves, events }) => {
  const points = G.points;
  const [selected, setSelected] = React.useState(null);

  const handlePointClick = (index) => {
    if (ctx.currentPlayer !== '0') return;
    if (selected === null) {
      setSelected(index);
    } else {
      moves.moveChecker(selected, index);
      setSelected(null);
    }
  };

  React.useEffect(() => {
    if (ctx.currentPlayer === '1' && Array.isArray(G.dice)) {
      const possible = [];
      for (let i = 0; i < 24; i++) {
        const p = points[i];
        if (p.color === 'black' && p.count > 0) {
          G.dice.forEach((die) => {
            const dest = i - die;
            if (dest >= 0) {
              const t = points[dest];
              if (!t.color || t.color === 'black' || t.count === 1) {
                possible.push([i, dest]);
              }
            }
          });
        }
      }
      if (possible.length > 0) {
        const [from, to] = possible[Math.floor(Math.random() * possible.length)];
        moves.moveChecker(from, to);
      } else {
        events.endTurn();
      }
    }
  }, [ctx.turn]);

  return React.createElement(
    'div',
    { className: 'mx-auto text-center' },
    React.createElement(
      'div',
      { className: 'mb-4 flex flex-col items-center' },
      React.createElement(
        'div',
        null,
        `Current player: ${ctx.currentPlayer === '0' ? 'White' : 'Black'}`
      ),
      React.createElement(Dice, { values: G.dice })
    ),
    React.createElement(
      'div',
      { className: 'grid grid-cols-12 gap-1' },
      ...points.slice(0, 12).map((p, i) =>
        React.createElement(Point, {
          key: i,
          point: p,
          index: i,
          selected: selected === i,
          onClick: () => handlePointClick(i),
        })
      )
    ),
    React.createElement(
      'div',
      { className: 'grid grid-cols-12 gap-1' },
      ...points.slice(12).map((p, i) =>
        React.createElement(Point, {
          key: i + 12,
          point: p,
          index: i + 12,
          selected: selected === i + 12,
          onClick: () => handlePointClick(i + 12),
        })
      )
    ),
    React.createElement(
      'button',
      {
        className: 'mt-4 px-4 py-2 bg-blue-500 text-white rounded',
        onClick: () => events.endTurn(),
      },
      'End Turn'
    )
  );
};

const App = Client({ game: Backgammon, board: Board });

// Simple error boundary to surface runtime problems in the UI
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'An unexpected error occurred.' };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement(
        'div',
        {
          className:
            'p-4 m-4 bg-red-100 text-red-800 border border-red-400 rounded',
        },
        `Error: ${this.state.message}`
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(ErrorBoundary, null, React.createElement(App))
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
