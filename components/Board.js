import React from 'https://esm.sh/react@18.3.1';
import Point from './Point.js';
import Dice from './Dice.js';

const Board = ({ G, ctx, moves, events }) => {
  const points = G.points;
  const [selected, setSelected] = React.useState(null);
  const [showInstructions, setShowInstructions] = React.useState(true);
  const [autoPlay, setAutoPlay] = React.useState(false);

  const handlePointClick = (index) => {
    if (autoPlay || ctx.currentPlayer !== '0') return;
    const point = points[index];
    if (selected === null) {
      if (point.color === 'white' && point.count > 0) {
        setSelected(index);
      }
    } else {
      moves.moveChecker(selected, index);
      setSelected(null);
    }
  };

  React.useEffect(() => {
    const isAI = autoPlay || ctx.currentPlayer === '1';
    if (!isAI || ctx.gameover) return;

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

    const makeMove = () => {
      if (possible.length > 0) {
        const [from, to] = possible[Math.floor(Math.random() * possible.length)];
        moves.moveChecker(from, to);
      } else {
        events.endTurn();
      }
    };

    const timer = setTimeout(makeMove, 500);
    return () => clearTimeout(timer);
  }, [ctx.turn, G.dice, autoPlay]);

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
            'Start'
          ),
          React.createElement(
            'button',
            {
              className: 'mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded',
              onClick: () => {
                setShowInstructions(false);
                setAutoPlay(true);
              },
            },
            'Autoplay'
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
      'div',
      { className: 'mt-4 flex justify-center space-x-2' },
      React.createElement(
        'button',
        {
          className: 'px-4 py-2 bg-blue-500 text-white rounded',
          onClick: () => events.endTurn(),
          disabled: autoPlay,
        },
        'End Turn'
      ),
      React.createElement(
        'button',
        {
          className: 'px-4 py-2 bg-green-500 text-white rounded',
          onClick: () => setAutoPlay(true),
          disabled: autoPlay,
        },
        'Autoplay'
      )
    )
  );
};

export default Board;
