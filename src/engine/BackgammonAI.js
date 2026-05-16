/**
 * Backgammon AI
 * Simple heuristic-based AI to auto-play moves
 */

export class BackgammonAI {
  static getBestMove(gameState) {
    const { legalMoves, currentPlayer, board } = gameState;
    if (!legalMoves || legalMoves.length === 0) return null;

    const opponent = currentPlayer === 'player1' ? 'player2' : 'player1';

    // Map each move to a score
    const scoredMoves = legalMoves.map(move => {
      let score = 0;

      // 1. High Priority: Escape from Bar
      if (move.from === 'bar') {
        score += 20;
      }

      // 2. High Priority: Hitting an opponent blot
      if (move.to !== 'borne_off' && move.to !== 'bar') {
        if (board[move.to][opponent] === 1) {
          score += 15;
        }
      }

      // 3. High Priority: Bearing off
      if (move.to === 'borne_off') {
        score += 12;
      }

      // 4. STRATEGIC: Cover a blot (make a point)
      if (move.to !== 'borne_off' && move.to !== 'bar') {
        if (board[move.to][currentPlayer] === 1) {
          score += 10; // Making a point/covering a blot is very good
        }
        
        // Bonus for making points in your own home board (points 0-5 or 18-23)
        const isHomeBoard = currentPlayer === 'player1' 
          ? (move.to >= 18 && move.to <= 23)
          : (move.to >= 0 && move.to <= 5);
        
        if (isHomeBoard && board[move.to][currentPlayer] >= 1) {
          score += 5;
        }
      }

      // 5. PENALTY: Creating a new blot (unless it's hitting or bearing off)
      if (move.to !== 'borne_off' && move.to !== 'bar') {
        if (board[move.to][currentPlayer] === 0 && board[move.to][opponent] === 0) {
          // If we leave a blot behind
          score -= 3;
        }
      }

      // 6. PROGRESS: Move pieces that are further back
      if (move.from !== 'bar') {
        const progressBonus = currentPlayer === 'player1'
          ? (23 - move.from) * 0.1 // Further back pieces are at low indices
          : move.from * 0.1;       // Further back pieces are at high indices
        score += progressBonus;
      }

      return { move, score };
    });

    // Sort by score descending and pick the best
    scoredMoves.sort((a, b) => b.score - a.score);
    
    // If there are multiple moves with the same top score, pick a random one among them
    const topScore = scoredMoves[0].score;
    const bestMoves = scoredMoves.filter(m => m.score === topScore);
    
    return bestMoves[Math.floor(Math.random() * bestMoves.length)].move;
  }
}

export default BackgammonAI;
