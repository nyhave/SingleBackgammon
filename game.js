// Game logic for SingleBackgammon

const rollDie = () => Math.floor(Math.random() * 6) + 1;

const rollDice = () => {
  const d1 = rollDie();
  const d2 = rollDie();
  return d1 === d2 ? [d1, d1, d1, d1] : [d1, d2];
};

const createInitialPoints = () => {
  const pts = Array(24)
    .fill(null)
    .map(() => ({ color: null, count: 0 }));

  // White checkers
  pts[0] = { color: 'white', count: 2 }; // point 24
  pts[11] = { color: 'white', count: 5 }; // point 13
  pts[16] = { color: 'white', count: 3 }; // point 8
  pts[18] = { color: 'white', count: 5 }; // point 6

  // Black checkers
  pts[23] = { color: 'black', count: 2 }; // point 1
  pts[12] = { color: 'black', count: 5 }; // point 12
  pts[7] = { color: 'black', count: 3 }; // point 17
  pts[5] = { color: 'black', count: 5 }; // point 19

  return pts;
};

export const moveChecker = (state, player, from, to) => {
  const color = player === '0' ? 'white' : 'black';
  const distance = Math.abs(to - from);
  if (!state.dice.includes(distance)) return null;

  const source = state.points[from];
  const target = state.points[to];
  if (source.color !== color || source.count === 0) return null;
  if (target.color && target.color !== color && target.count > 1) return null;

  const points = state.points.map((p) => ({ ...p }));
  const src = points[from];
  const tgt = points[to];

  src.count--;
  if (src.count === 0) src.color = null;

  if (tgt.color && tgt.color !== color) {
    tgt.color = color;
    tgt.count = 1;
  } else {
    tgt.color = color;
    tgt.count += 1;
  }

  const dice = [...state.dice];
  const dieIndex = dice.indexOf(distance);
  dice.splice(dieIndex, 1);

  return { points, dice };
};

const getWinner = (points) => {
  const whiteTotal = points
    .filter((p) => p.color === 'white')
    .reduce((sum, p) => sum + p.count, 0);
  const blackTotal = points
    .filter((p) => p.color === 'black')
    .reduce((sum, p) => sum + p.count, 0);
  const whiteHome =
    points[23].color === 'white' && points[23].count === whiteTotal;
  const blackHome =
    points[0].color === 'black' && points[0].count === blackTotal;
  if (whiteHome) return '0';
  if (blackHome) return '1';
  return null;
};

export { rollDie, rollDice, createInitialPoints, getWinner };
