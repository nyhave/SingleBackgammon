import React from 'https://esm.sh/react@18.3.1';
import Point from './Point.js';
import Dice from './Dice.js';
import Bar from './Bar.js';
import {
  rollDice,
  createInitialPoints,
  moveChecker as applyMove,
  getWinner,
  allInHome,
} from '../game.js';

const Board = () => {
  const [points, setPoints] = React.useState(createInitialPoints());
  const initialRoll = React.useMemo(() => rollDice(), []);
  const [dice, setDice] = React.useState(initialRoll);
  const [displayDice, setDisplayDice] = React.useState(initialRoll);
  const [waitingForRoll, setWaitingForRoll] = React.useState(false);
  const [currentPlayer, setCurrentPlayer] = React.useState('0');
  const [turn, setTurn] = React.useState(0);
  const [gameover, setGameover] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [possibleMoves, setPossibleMoves] = React.useState([]);
  const [showInstructions, setShowInstructions] = React.useState(false);
  const [autoPlay, setAutoPlay] = React.useState(false);
  const [stepPlay, setStepPlay] = React.useState(false);
  const [lastMove, setLastMove] = React.useState(null);
  const [scores, setScores] = React.useState({ white: 0, black: 0 });
  const [playerNames, setPlayerNames] = React.useState({
    white: 'Christian',
    black: 'Marianne',
  });
  const [bar, setBar] = React.useState({ white: 0, black: 0 });

  const offCounts = React.useMemo(() => {
    const counts = { white: 15, black: 15 };
    points.forEach((p) => {
      if (p.color) counts[p.color] -= p.count;
    });
    counts.white -= bar.white;
    counts.black -= bar.black;
    return counts;
  }, [points, bar]);

  const endTurn = () => {
    const nextPlayer = currentPlayer === '0' ? '1' : '0';
    setCurrentPlayer(nextPlayer);
    setTurn((t) => t + 1);
    if (nextPlayer === '1' || autoPlay) {
      const newRoll = rollDice();
      setDice(newRoll);
      setDisplayDice(newRoll);
      setWaitingForRoll(false);
    } else {
      setDice([]);
      setWaitingForRoll(true);
    }
  };

  const moveChecker = (from, to) => {
    const result = applyMove({ points, dice, bar }, currentPlayer, from, to);
    if (!result) return;
    setPoints(result.points);
    setDice(result.dice);
    setBar(result.bar);
    setLastMove({ from, to });
    if (result.dice.length === 0) endTurn();
    const winner = getWinner(result.points, result.bar);
    if (winner) {
      setGameover({ winner });
      setScores((s) => ({
        white: s.white + (winner === '0' ? 1 : 0),
        black: s.black + (winner === '1' ? 1 : 0),
      }));
    }
  };

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

  const newGame = () => {
    const firstRoll = rollDice();
    setPoints(createInitialPoints());
    setDice(firstRoll);
    setDisplayDice(firstRoll);
    setCurrentPlayer('0');
    setTurn(0);
    setGameover(null);
    setSelected(null);
    setPossibleMoves([]);
    setAutoPlay(false);
    setStepPlay(false);
    setLastMove(null);
    setBar({ white: 0, black: 0 });
    setWaitingForRoll(false);
  };

  const rollForCurrentPlayer = React.useCallback(() => {
    const newRoll = rollDice();
    setDice(newRoll);
    setDisplayDice(newRoll);
    setWaitingForRoll(false);
  }, []);

  const calculateMoves = React.useCallback(
    (from) => {
      const color = currentPlayer === '0' ? 'white' : 'black';
      const direction = currentPlayer === '0' ? 1 : -1;
      const targets = new Set();
      const inHome = allInHome(points, color, bar);
      if (bar[color] > 0 && from !== (color === 'white' ? -1 : 24)) {
        return [];
      }
      dice.forEach((die) => {
        let dest;
        if (from === -1) {
          dest = die - 1;
        } else if (from === 24) {
          dest = 24 - die;
        } else {
          dest = from + die * direction;
        }
        if (dest >= 0 && dest <= 23) {
          const t = points[dest];
          if (!t.color || t.color === color || t.count === 1) {
            targets.add(dest);
          }
        } else if (inHome && from !== -1 && from !== 24) {
          if (color === 'white') {
            const noBehind = points.slice(0, from).every((p) => p.color !== 'white');
            if (dest > 23 && noBehind) targets.add(dest);
          } else {
            const noBehind = points
              .slice(from + 1)
              .every((p) => p.color !== 'black');
            if (dest < 0 && noBehind) targets.add(dest);
          }
        }
      });
      return Array.from(targets);
    },
    [currentPlayer, dice, points, bar]
  );

  React.useEffect(() => {
    const color = currentPlayer === '0' ? 'white' : 'black';
    if (bar[color] > 0) {
      setSelected(null);
      setPossibleMoves(calculateMoves(color === 'white' ? -1 : 24));
    } else {
      setPossibleMoves([]);
    }
  }, [bar, currentPlayer, calculateMoves]);

  const handlePointClick = (index) => {
    if (autoPlay || stepPlay || currentPlayer !== '0' || waitingForRoll) return;
    if (bar.white > 0) {
      if (possibleMoves.includes(index)) {
        moveChecker(-1, index);
      }
      return;
    }
    const point = points[index];
    if (selected === null) {
      if (point.color === 'white' && point.count > 0) {
        setSelected(index);
        setPossibleMoves(calculateMoves(index));
      }
    } else if (possibleMoves.includes(index)) {
      moveChecker(selected, index);
      setSelected(null);
      setPossibleMoves([]);
    } else if (
      index === selected &&
      possibleMoves.some((m) => m < 0 || m > 23)
    ) {
      const off = possibleMoves.find((m) => m < 0 || m > 23);
      moveChecker(selected, off);
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
    const color = currentPlayer === '0' ? 'white' : 'black';
    const direction = currentPlayer === '0' ? 1 : -1;
    const possible = [];
    const inHome = allInHome(points, color, bar);

    if (bar[color] > 0) {
      const from = color === 'white' ? -1 : 24;
      dice.forEach((die) => {
        const dest = color === 'white' ? die - 1 : 24 - die;
        if (dest >= 0 && dest <= 23) {
          const t = points[dest];
          if (!t.color || t.color === color || t.count === 1) {
            possible.push([from, dest]);
          }
        }
      });
    } else {
      for (let i = 0; i < 24; i++) {
        const p = points[i];
        if (p.color === color && p.count > 0) {
          dice.forEach((die) => {
            const dest = i + die * direction;
            if (dest >= 0 && dest <= 23) {
              const t = points[dest];
              if (!t.color || t.color === color || t.count === 1) {
                possible.push([i, dest]);
              }
            } else if (inHome) {
              if (color === 'white') {
                const noBehind = points
                  .slice(0, i)
                  .every((pnt) => pnt.color !== 'white');
                if (dest > 23 && noBehind) possible.push([i, dest]);
              } else {
                const noBehind = points
                  .slice(i + 1)
                  .every((pnt) => pnt.color !== 'black');
                if (dest < 0 && noBehind) possible.push([i, dest]);
              }
            }
          });
        }
      }
    }

    if (possible.length > 0) {
      const [from, to] = possible[Math.floor(Math.random() * possible.length)];
      moveChecker(from, to);
    } else {
      endTurn();
    }
  }, [currentPlayer, points, dice, bar, moveChecker, endTurn]);

  React.useEffect(() => {
    const isAuto = autoPlay || (!stepPlay && currentPlayer === '1');
    if (!isAuto || gameover) return;
    const timer = setTimeout(makeAIMove, 500);
    return () => clearTimeout(timer);
  }, [turn, dice, autoPlay, stepPlay, makeAIMove, gameover, currentPlayer]);

  React.useEffect(() => {
    setSelected(null);
    setPossibleMoves([]);
  }, [turn]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (stepPlay) {
          makeAIMove();
        } else if (!autoPlay) {
          if (waitingForRoll) {
            rollForCurrentPlayer();
          } else {
            endTurn();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [autoPlay, stepPlay, makeAIMove, endTurn, waitingForRoll, rollForCurrentPlayer]);

  const chatPlaceholder = React.createElement(
    'div',
    {
      className:
        'flex-1 border-2 border-dashed border-gray-400 flex items-center justify-center',
    },
    'Chat'
  );

  const videoPlaceholder = React.createElement(
    'div',
    {
      className:
        'flex-1 border-2 border-dashed border-gray-400 flex items-center justify-center',
    },
    'Video'
  );

  return React.createElement(
    'div',
    { className: 'flex w-full justify-center items-start' },
    React.createElement(
      'div',
      { className: 'flex flex-col items-center' },
      showInstructions &&
        React.createElement(
          'div',
          {
            className:
              'fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50',
        },
        React.createElement(
          'div',
          {
            className:
              'bg-white p-4 rounded shadow max-w-sm text-left overflow-y-auto max-h-[90vh]',
          },
          React.createElement(
            'h2',
            { className: 'text-lg font-bold mb-2' },
            'How to Play'
          ),
          React.createElement(
            'p',
            { className: 'mb-2 text-sm' },
            'Move all your white checkers around the board and bear them off before the computer does.'
          ),
          React.createElement(
            'ol',
            { className: 'mb-2 list-decimal pl-5 text-sm space-y-1' },
            React.createElement('li', null, 'Click a white checker to select it.'),
            React.createElement(
              'li',
              null,
              'Click a destination point that matches one of the dice values.'
            ),
            React.createElement(
              'li',
              null,
              'Hitting a lone opposing checker sends it to the bar.'
            ),
            React.createElement(
              'li',
              null,
              'Checkers on the bar must re-enter before you can move others.'
            ),
            React.createElement(
              'li',
              null,
              'Once all your checkers are in your home board you can bear them off by double-clicking a checker.'
            )
          ),
          React.createElement(
            'p',
            { className: 'mb-2 text-sm' },
            'Buttons above the board provide extra options:'
          ),
          React.createElement(
            'ul',
            { className: 'mb-4 list-disc pl-5 text-sm space-y-1' },
            React.createElement(
              'li',
              null,
              'End Turn: roll the dice and pass play to the computer opponent.'
            ),
            React.createElement(
              'li',
              null,
              'Step: watch the computer play one move at a time. Press Next for each move.'
            ),
            React.createElement(
              'li',
              null,
              'Autoplay: let the computer control both sides automatically.'
            ),
            React.createElement(
              'li',
              null,
              'New Game: reset the board and keep the running score.'
            ),
            React.createElement(
              'li',
              null,
              'Reload Game: clear cached data and restart the match.'
            )
          ),
          React.createElement(
            'p',
            { className: 'mb-4 text-sm' },
            'First player to bear off all their checkers wins.'
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
      { className: 'mb-4 bg-green-500 text-white w-full' },
      React.createElement(
        'div',
        { className: 'text-center font-bold' },
        'SingleBackgammon'
      ),
      React.createElement(
        'div',
        {
          className:
            'flex items-center justify-between px-4 py-1 max-w-[428px] mx-auto',
        },
        React.createElement(
          'div',
          { className: 'flex flex-col items-center' },
          React.createElement('input', {
            value: playerNames.white,
            onChange: (e) =>
              setPlayerNames((n) => ({ ...n, white: e.target.value })),
            className:
              'mb-1 w-24 text-center font-bold bg-transparent border-b border-white text-white placeholder-white',
            placeholder: 'Christian',
          }),
          React.createElement('span', { className: 'font-bold' }, scores.white)
        ),
        React.createElement(Dice, { values: displayDice }),
        React.createElement(
          'div',
          { className: 'flex flex-col items-center text-black' },
          React.createElement('input', {
            value: playerNames.black,
            onChange: (e) =>
              setPlayerNames((n) => ({ ...n, black: e.target.value })),
            className:
              'mb-1 w-24 text-center font-bold bg-transparent border-b border-black text-black placeholder-black',
            placeholder: 'Marianne',
          }),
          React.createElement('span', { className: 'font-bold text-black' }, scores.black)
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'w-[428px] text-center flex-shrink-0' },
      React.createElement(
        'div',
        { className: 'mb-4 flex justify-between' },
        React.createElement(
        'div',
        { className: 'flex items-center' },
        React.createElement('span', { className: 'mr-2' }, 'White off:'),
        React.createElement(
          'div',
          { className: 'flex space-x-1' },
          ...Array.from({ length: offCounts.white }).map((_, i) =>
            React.createElement('div', {
              key: i,
              className:
                'w-4 h-4 rounded-full border border-gray-800 bg-white',
            })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'flex items-center' },
        React.createElement('span', { className: 'mr-2' }, 'Black off:'),
        React.createElement(
          'div',
          { className: 'flex space-x-1' },
          ...Array.from({ length: offCounts.black }).map((_, i) =>
            React.createElement('div', {
              key: i,
              className:
                'w-4 h-4 rounded-full border border-gray-800 bg-black',
            })
          )
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'mb-4 flex flex-col items-center' },
      React.createElement(
        'div',
        null,
        `Current player: ${currentPlayer === '0' ? 'White' : 'Black'}`
      ),
      React.createElement(
        'div',
        { className: 'flex items-center space-x-2 mt-2' },
        stepPlay &&
          !waitingForRoll &&
          React.createElement(
            'button',
            {
              className: 'px-4 py-2 bg-blue-500 text-white rounded',
              onClick: () => makeAIMove(),
            },
            'Next'
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
        )
      ),
      gameover &&
        React.createElement(
          'div',
          { className: 'mt-2' },
          `Winner: ${gameover.winner === '0' ? 'White' : 'Black'}`
        )
    ),
    React.createElement(
      'div',
      { className: 'mb-4 flex justify-center space-x-2 flex-wrap' },
      waitingForRoll
        ? React.createElement(
            'button',
            {
              className: 'px-4 py-2 bg-blue-500 text-white rounded',
              onClick: () => rollForCurrentPlayer(),
            },
            'Roll'
          )
        : React.createElement(
            'button',
            {
              className: 'px-4 py-2 bg-blue-500 text-white rounded',
              onClick: () => endTurn(),
              disabled: autoPlay,
            },
            'End Turn'
          ),
      React.createElement(
        'button',
        {
          className: 'px-4 py-2 bg-purple-500 text-white rounded',
          onClick: newGame,
        },
        'New Game'
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
    ),
    React.createElement(
      'div',
      { className: 'relative bg-green-600' },
      React.createElement(
        'div',
        { className: 'absolute inset-0 grid grid-cols-12 -z-10' },
        React.createElement('div', { className: 'col-span-6 bg-green-600' }),
        React.createElement('div', { className: 'col-span-6 bg-gray-700' })
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-12 gap-1' },
        ...points.slice(0, 12).map((_, i) => {
          const idx = 11 - i;
          const p = points[idx];
          return React.createElement(Point, {
            key: idx,
            point: p,
            index: idx,
            selected: selected === idx,
            highlighted: possibleMoves.includes(idx),
            movedFrom: lastMove && lastMove.from === idx,
            movedTo: lastMove && lastMove.to === idx,
            onClick: () => handlePointClick(idx),
          });
        })
      )
    ),
    React.createElement(
      'div',
      { className: 'flex justify-center space-x-4' },
      React.createElement(Bar, { color: 'white', count: bar.white }),
      React.createElement(Bar, { color: 'black', count: bar.black })
    ),
      React.createElement(
        'div',
        { className: 'relative bg-green-600' },
        React.createElement(
          'div',
          { className: 'absolute inset-0 grid grid-cols-12 -z-10' },
          React.createElement('div', { className: 'col-span-6 bg-green-600' }),
          React.createElement('div', { className: 'col-span-6 bg-gray-300' })
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
              movedFrom: lastMove && lastMove.from === i + 12,
              movedTo: lastMove && lastMove.to === i + 12,
              onClick: () => handlePointClick(i + 12),
            })
          )
        )
      )
    ),
    React.createElement(
      'div',
      {
        className:
          'ml-2 w-32 flex flex-col space-y-2 md:ml-4 md:w-64 md:space-y-4 flex-shrink-0',
      },
      chatPlaceholder,
      videoPlaceholder
    )
  )
);
};

export default Board;
