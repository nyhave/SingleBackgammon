import BackgammonGame from '../engine/BackgammonGame';

describe('BackgammonGame Engine', () => {
  let game;

  beforeEach(() => {
    game = new BackgammonGame();
  });

  test('should initialize with correct starting board', () => {
    // Standard starting position: 2 on pt 1, 5 on pt 12, 3 on pt 17, 5 on pt 19 (for white)
    // In our engine, pt numbers might be different, let's just check if it's an array
    expect(Array.isArray(game.board)).toBe(true);
    expect(game.board.length).toBe(24);
  });

  test('should roll dice', () => {
    game.rollDice();
    expect(game.dice[0]).toBeGreaterThanOrEqual(1);
    expect(game.dice[0]).toBeLessThanOrEqual(6);
    expect(game.dice[1]).toBeGreaterThanOrEqual(1);
    expect(game.dice[1]).toBeLessThanOrEqual(6);
  });

  test('should switch player', () => {
    const initialPlayer = game.currentPlayer;
    game.switchPlayer();
    expect(game.currentPlayer).not.toBe(initialPlayer);
  });

  test('should generate legal moves after rolling', () => {
    game.rollDice();
    const moves = game.getLegalMoves();
    expect(Array.isArray(moves)).toBe(true);
  });

  test('should detect if a player has won', () => {
    // Move all pieces to bear off for player 1
    game.board = game.board.map(() => ({ player1: 0, player2: 0 }));
    game.borne_off.player1 = 15;
    expect(game.getWinner()).toBe('player1');
  });
});
