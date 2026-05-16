/**
 * Connect Four Engine
 * Handles board state, moves, and win detection for 4-på-stribe
 */

export class ConnectFourEngine {
  static ROWS = 6;
  static COLS = 7;

  constructor() {
    this.board = this.createEmptyBoard();
    this.currentPlayer = 'player1';
    this.isGameOver = false;
    this.winner = null;
    this.lastMove = null;
  }

  createEmptyBoard() {
    // 7 columns, each containing 6 rows (0 is bottom, 5 is top)
    return Array(7).fill(null).map(() => Array(6).fill(null));
  }

  getGameState() {
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      isGameOver: this.isGameOver,
      winner: this.winner,
      lastMove: this.lastMove,
      rows: ConnectFourEngine.ROWS,
      cols: ConnectFourEngine.COLS
    };
  }

  setGameState(state) {
    if (!state) return;
    if (state.board) this.board = state.board;
    if (state.currentPlayer) this.currentPlayer = state.currentPlayer;
    if (state.isGameOver !== undefined) this.isGameOver = state.isGameOver;
    if (state.winner !== undefined) this.winner = state.winner;
    if (state.lastMove !== undefined) this.lastMove = state.lastMove;
  }

  /**
   * Drops a piece into a column
   * @param {number} colIndex 0-6
   * @returns {boolean} true if move was valid
   */
  makeMove(colIndex) {
    if (this.isGameOver || colIndex < 0 || colIndex >= ConnectFourEngine.COLS) return false;

    // Find the first empty row in this column (from bottom 0 to top 5)
    const column = this.board[colIndex];
    const rowIndex = column.indexOf(null);

    if (rowIndex === -1) return false; // Column is full

    // Place the piece
    this.board[colIndex][rowIndex] = this.currentPlayer;
    this.lastMove = { col: colIndex, row: rowIndex };

    // Check for win
    if (this.checkWin(colIndex, rowIndex)) {
      this.isGameOver = true;
      this.winner = this.currentPlayer;
    } else if (this.checkDraw()) {
      this.isGameOver = true;
      this.winner = 'draw';
    } else {
      // Switch turn
      this.currentPlayer = this.currentPlayer === 'player1' ? 'player2' : 'player1';
    }

    return true;
  }

  checkWin(col, row) {
    const player = this.board[col][row];
    
    // Directions: [dCol, dRow]
    const directions = [
      [1, 0],  // horizontal
      [0, 1],  // vertical
      [1, 1],  // diagonal /
      [1, -1]  // diagonal \
    ];

    for (const [dCol, dRow] of directions) {
      let count = 1;

      // Check one way
      count += this.countInDirection(col, row, dCol, dRow, player);
      // Check opposite way
      count += this.countInDirection(col, row, -dCol, -dRow, player);

      if (count >= 4) return true;
    }

    return false;
  }

  countInDirection(col, row, dCol, dRow, player) {
    let count = 0;
    let currCol = col + dCol;
    let currRow = row + dRow;

    while (
      currCol >= 0 && currCol < ConnectFourEngine.COLS &&
      currRow >= 0 && currRow < ConnectFourEngine.ROWS &&
      this.board[currCol][currRow] === player
    ) {
      count++;
      currCol += dCol;
      currRow += dRow;
    }

    return count;
  }

  checkDraw() {
    return this.board.every(col => col.every(cell => cell !== null));
  }
}

export default ConnectFourEngine;
