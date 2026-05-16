/**
 * Connect Four AI
 * Uses Minimax with Alpha-Beta Pruning to find the best move
 */

export class ConnectFourAI {
  static ROWS = 6;
  static COLS = 7;
  static MAX_DEPTH = 5; // Difficulty level

  /**
   * Returns the best column to drop a piece in
   * @param {Array} board 7x6 array of columns
   * @param {string} player 'player1' or 'player2'
   * @returns {number} column index
   */
  static getBestMove(board, player) {
    const validMoves = this.getValidMoves(board);
    if (validMoves.length === 0) return null;

    // First, check if there's an immediate winning move
    for (const col of validMoves) {
      const tempBoard = this.cloneBoard(board);
      const row = this.dropPiece(tempBoard, col, player);
      if (this.checkWin(tempBoard, col, row, player)) {
        return col;
      }
    }

    // Second, check if opponent has an immediate winning move and block it
    const opponent = player === 'player1' ? 'player2' : 'player1';
    for (const col of validMoves) {
      const tempBoard = this.cloneBoard(board);
      const row = this.dropPiece(tempBoard, col, opponent);
      if (this.checkWin(tempBoard, col, row, opponent)) {
        return col;
      }
    }

    // Otherwise, use Minimax
    let bestScore = -Infinity;
    let bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];

    for (const col of validMoves) {
      const tempBoard = this.cloneBoard(board);
      this.dropPiece(tempBoard, col, player);
      const score = this.minimax(tempBoard, this.MAX_DEPTH - 1, -Infinity, Infinity, false, player);
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = col;
      }
    }

    return bestMove;
  }

  static minimax(board, depth, alpha, beta, isMaximizing, player) {
    const opponent = player === 'player1' ? 'player2' : 'player1';
    
    // Check terminal states
    if (depth === 0) return this.evaluateBoard(board, player);

    const validMoves = this.getValidMoves(board);
    if (validMoves.length === 0) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const col of validMoves) {
        const tempBoard = this.cloneBoard(board);
        this.dropPiece(tempBoard, col, player);
        const evaluation = this.minimax(tempBoard, depth - 1, alpha, beta, false, player);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const col of validMoves) {
        const tempBoard = this.cloneBoard(board);
        this.dropPiece(tempBoard, col, opponent);
        const evaluation = this.minimax(tempBoard, depth - 1, alpha, beta, true, player);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  static evaluateBoard(board, player) {
    let score = 0;

    // Prioritize center column
    const centerCol = Math.floor(this.COLS / 2);
    const centerCount = board[centerCol].filter(cell => cell === player).length;
    score += centerCount * 3;

    // Evaluate all 4-piece windows
    // Horizontal
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS - 3; c++) {
        const window = [board[c][r], board[c+1][r], board[c+2][r], board[c+3][r]];
        score += this.evaluateWindow(window, player);
      }
    }

    // Vertical
    for (let c = 0; c < this.COLS; c++) {
      for (let r = 0; r < this.ROWS - 3; r++) {
        const window = [board[c][r], board[c][r+1], board[c][r+2], board[c][r+3]];
        score += this.evaluateWindow(window, player);
      }
    }

    // Diagonal /
    for (let r = 0; r < this.ROWS - 3; r++) {
      for (let c = 0; c < this.COLS - 3; c++) {
        const window = [board[c][r], board[c+1][r+1], board[c+2][r+2], board[c+3][r+3]];
        score += this.evaluateWindow(window, player);
      }
    }

    // Diagonal \
    for (let r = 3; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS - 3; c++) {
        const window = [board[c][r], board[c+1][r-1], board[c+2][r-2], board[c+3][r-3]];
        score += this.evaluateWindow(window, player);
      }
    }

    return score;
  }

  static evaluateWindow(window, player) {
    let score = 0;
    const opponent = player === 'player1' ? 'player2' : 'player1';
    
    const playerCount = window.filter(c => c === player).length;
    const emptyCount = window.filter(c => c === null).length;
    const opponentCount = window.filter(c => c === opponent).length;

    if (playerCount === 4) score += 100;
    else if (playerCount === 3 && emptyCount === 1) score += 5;
    else if (playerCount === 2 && emptyCount === 2) score += 2;

    if (opponentCount === 3 && emptyCount === 1) score -= 4;

    return score;
  }

  static getValidMoves(board) {
    const valid = [];
    for (let c = 0; c < this.COLS; c++) {
      if (board[c][this.ROWS - 1] === null) {
        valid.push(c);
      }
    }
    return valid;
  }

  static dropPiece(board, col, player) {
    for (let r = 0; r < this.ROWS; r++) {
      if (board[col][r] === null) {
        board[col][r] = player;
        return r;
      }
    }
    return -1;
  }

  static cloneBoard(board) {
    return board.map(col => [...col]);
  }

  static checkWin(board, col, row, player) {
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
    for (const [dCol, dRow] of directions) {
      let count = 1;
      // One way
      let c = col + dCol;
      let r = row + dRow;
      while (c >= 0 && c < this.COLS && r >= 0 && r < this.ROWS && board[c][r] === player) {
        count++;
        c += dCol;
        r += dRow;
      }
      // Other way
      c = col - dCol;
      r = row - dRow;
      while (c >= 0 && c < this.COLS && r >= 0 && r < this.ROWS && board[c][r] === player) {
        count++;
        c -= dCol;
        r -= dRow;
      }
      if (count >= 4) return true;
    }
    return false;
  }
}

export default ConnectFourAI;
