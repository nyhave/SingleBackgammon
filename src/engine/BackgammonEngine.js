export default class BackgammonEngine {
  constructor() {
    this.reset();
    this.score = 0;
  }

  rollDice() {
    this.dice = [this.#rollDie(), this.#rollDie()];
  }

  #rollDie() {
    return Math.floor(Math.random() * 6) + 1;
  }

  reset() {
    // Set up a standard backgammon starting position. The board is
    // represented as an array of 24 points, indexed from 0–23. For the
    // purposes of this demo engine the exact orientation isn't critical,
    // we simply mirror the traditional layout so the board doesn't appear
    // empty when a game starts.
    this.board = Array.from({ length: 24 }, () => ({ color: null, count: 0 }));

    // White pieces
    this.board[0] = { color: 'white', count: 2 };
    this.board[11] = { color: 'white', count: 5 };
    this.board[16] = { color: 'white', count: 3 };
    this.board[18] = { color: 'white', count: 5 };

    // Black pieces
    this.board[23] = { color: 'black', count: 2 };
    this.board[12] = { color: 'black', count: 5 };
    this.board[7] = { color: 'black', count: 3 };
    this.board[5] = { color: 'black', count: 5 };

    this.dice = [];
  }
}
