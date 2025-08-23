import React from 'https://esm.sh/react@18.3.1';
import Point from './Point.js';
import Dice from './Dice.js';

const Board = ({ G, ctx, moves, events }) => {
  const points = G.points;
  const [selected, setSelected] = React.useState(null);
  const [possibleMoves, setPossibleMoves] = React.useState([]);
  const [showInstructions, setShowInstructions] = React.useState(false);
  const [autoPlay, setAutoPlay] = React.useState(false);
  const [stepPlay, setStepPlay] = React.useState(false);

  const clearCacheAndReload = async () => {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((reg) => reg.unregister()));
    }
    window.location.reload();
  };

  const calculateMoves = React.useCallback(
    (from) => {
      const color = ctx.currentPlayer === '0' ? 'white' : 'black';
      const direction = ctx.currentPlayer === '0' ? 1 : -1;
      const targets = new Set();
      G.dice.forEach((die) => {
        const dest = from + die * direction;
        if (dest >= 0 && dest <= 23) {
          const t = points[dest];
          if (!t.color || t.color === color || t.count === 1) {
            targets.add(dest);
          }
        }
      });
      return Array.from(targets);
    },
    [ctx.currentPlayer, G.dice, points]
  );

  const handlePointClick = (index) => {
    if (autoPlay || stepPlay || ctx.currentPlayer !== '0') return;
    const point = points[index];
    if (selected === null) {
      if (point.color === 'white' && point.count > 0) {
        setSelected(index);
        setPossibleMoves(calculateMoves(index));
      }
    } else if (possibleMoves.includes(index)) {
      moves.moveChecker(selected, index);
      setSelected(null);
      setPossibleMoves([]);
    } else if (point.color === 'white' && point.count > 0) {
      setSelected(index);
      setPossibleMoves(calculateMoves(index));
    } else {
      setSelected(null);
      setPossibleMoves([]);
    }
  };

  const makeAIMove = React.useCallback(() => {
    const color = ctx.currentPlayer === '0' ? 'white' : 'black';
    const direction = ctx.currentPlayer === '0' ? 1 : -1;
    const possible = [];

    for (let i = 0; i < 24; i++) {
      const p = points[i];
      if (p.color === color && p.count > 0) {
        G.dice.forEach((die) => {
          const dest = i + die * direction;
          if (dest >= 0 && dest <= 23) {
            const t = points[dest];
            if (!t.color || t.color === color || t.count === 1) {
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
  }, [ctx.currentPlayer, points, G.dice, moves, events]);

  React.useEffect(() => {
    const isAuto = autoPlay || (!stepPlay && ctx.currentPlayer === '1');
    if (!isAuto || ctx.gameover) return;
    const timer = setTimeout(makeAIMove, 500);
    return () => clearTimeout(timer);
  }, [ctx.turn, G.dice, autoPlay, stepPlay, makeAIMove, ctx.gameover]);

  React.useEffect(() => {
    setSelected(null);
    setPossibleMoves([]);
  }, [ctx.turn]);

  return React.createElement(
    'div',
    { className: 'mx-auto text-center' },
    showInstructions &&
      React.createElement(
        'div',
        {
          className:
            'fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50',
        },
        React.createElement(
          'div',
          { className: 'bg-white p-4 rounded shadow max-w-sm text-left' },
          React.createElement(
            'h2',
            { className: 'text-lg font-bold mb-2' },
            'How to Play'
          ),
          React.createElement(
            'p',
            { className: 'mb-4 text-sm' },
            'Click one of your white checkers, then click a destination point allowed by the dice. Press End Turn to roll and let the black player move. Bear off all your checkers first to win.'
          ),
          React.createElement(
            'button',
            {
              className: 'mt-2 px-4 py-2 bg-blue-500 text-white rounded',
              onClick: () => setShowInstructions(false),
            },
            'Close'
          )
        )
      ),
    React.createElement(
      'div',
      { className: 'mb-4 flex flex-col items-center' },
      React.createElement(
        'div',
        null,
        `Current player: ${ctx.currentPlayer === '0' ? 'White' : 'Black'}`
      ),
      React.createElement(Dice, { values: G.dice }),
      ctx.gameover &&
        React.createElement(
          'div',
          { className: 'mt-2' },
          `Winner: ${ctx.gameover.winner === '0' ? 'White' : 'Black'}`
        )
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
          highlighted: possibleMoves.includes(i),
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
          highlighted: possibleMoves.includes(i + 12),
          onClick: () => handlePointClick(i + 12),
        })
      )
    ),
    React.createElement(
      'div',
      { className: 'mt-4 flex justify-center space-x-2' },
      stepPlay
        ? React.createElement(
            'button',
            {
              className: 'px-4 py-2 bg-blue-500 text-white rounded',
              onClick: () => makeAIMove(),
            },
            'Next'
          )
        : React.createElement(
            'button',
            {
              className: 'px-4 py-2 bg-blue-500 text-white rounded',
              onClick: () => events.endTurn(),
              disabled: autoPlay,
            },
            'End Turn'
          ),
      stepPlay
        ? React.createElement(
            'button',
            {
              className: 'px-4 py-2 bg-gray-500 text-white rounded',
              onClick: () => setStepPlay(false),
            },
            'Stop'
          )
        : React.createElement(
            'button',
            {
              className: 'px-4 py-2 bg-yellow-500 text-white rounded',
              onClick: () => {
                setStepPlay(true);
                setAutoPlay(false);
              },
              disabled: autoPlay,
            },
            'Step'
          ),
      React.createElement(
        'button',
        {
          className: 'px-4 py-2 bg-green-500 text-white rounded',
          onClick: () => {
            setAutoPlay(true);
            setStepPlay(false);
          },
          disabled: autoPlay,
        },
        'Autoplay'
      ),
      React.createElement(
        'button',
        {
          className: 'px-4 py-2 bg-red-500 text-white rounded',
          onClick: clearCacheAndReload,
        },
        'Reload Game'
      ),
      React.createElement(
        'button',
        {
          className: 'px-4 py-2 bg-gray-500 text-white rounded',
          onClick: () => setShowInstructions(true),
        },
        'Help'
      )
    )
  );
};

export default Board;
