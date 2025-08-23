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

const Backgammon = {
  setup: () => ({ points: createInitialPoints(), dice: rollDice() }),
  turn: {
    onBegin(G) {
      G.dice = rollDice();
    },
  },
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
  endIf: (G) => {
    const whiteTotal = G.points
      .filter((p) => p.color === 'white')
      .reduce((sum, p) => sum + p.count, 0);
    const blackTotal = G.points
      .filter((p) => p.color === 'black')
      .reduce((sum, p) => sum + p.count, 0);
    const whiteHome =
      G.points[23].color === 'white' && G.points[23].count === whiteTotal;
    const blackHome =
      G.points[0].color === 'black' && G.points[0].count === blackTotal;
    if (whiteHome) return { winner: '0' };
    if (blackHome) return { winner: '1' };
  },
};

export { rollDie, createInitialPoints, Backgammon };
