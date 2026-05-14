/**
 * Backgammon AI
 * Simple heuristic-based AI to auto-play moves
 */

export class BackgammonAI {
  static getBestMove(gameState) {
    const { legalMoves, currentPlayer } = gameState;
    if (!legalMoves || legalMoves.length === 0) return null;

    // 1. Heuristic: Prioritize hitting an opponent piece
    const hittingMoves = legalMoves.filter(move => {
      if (move.to === 'borne_off') return false;
      if (move.from === 'bar') return false; // Handled by engine but good to be explicit
      const opponent = currentPlayer === 'player1' ? 'player2' : 'player1';
      return gameState.board[move.to][opponent] === 1;
    });

    if (hittingMoves.length > 0) {
      return hittingMoves[Math.floor(Math.random() * hittingMoves.length)];
    }

    // 2. Heuristic: Prioritize bearing off
    const bearingOffMoves = legalMoves.filter(move => move.to === 'borne_off');
    if (bearingOffMoves.length > 0) {
      return bearingOffMoves[0];
    }

    // 3. Heuristic: Move pieces that are furthest back
    // Sort moves by 'from' point (furthest back depends on player)
    const sortedMoves = [...legalMoves].sort((a, b) => {
      if (a.from === 'bar') return -1;
      if (b.from === 'bar') return 1;
      
      if (currentPlayer === 'player1') {
        return a.from - b.from; // Lower index is further back
      } else {
        return b.from - a.from; // Higher index is further back
      }
    });

    return sortedMoves[0];
  }
}

export default BackgammonAI;
