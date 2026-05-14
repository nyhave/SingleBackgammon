/**
 * Backgammon Game Engine
 * Implements standard backgammon rules with dice consumption and bar logic
 */

const BOARD_SIZE = 24
const POINTS_PER_PLAYER = 15

export class BackgammonGame {
  constructor() {
    this.board = this.initializeBoard()
    this.bar = { player1: 0, player2: 0 }
    this.borne_off = { player1: 0, player2: 0 }
    this.currentPlayer = 'player1'
    this.dice = [0, 0]
    this.availableDice = [] // Used to track remaining moves
    this.gameState = 'rolling' // rolling, moving, finished
  }

  initializeBoard() {
    const board = Array(BOARD_SIZE).fill(null).map(() => ({ player1: 0, player2: 0 }))
    
    // Player 1 pieces (White) - moves from 0 to 23
    board[0].player1 = 2
    board[11].player1 = 5
    board[16].player1 = 3
    board[18].player1 = 5
    
    // Player 2 pieces (Black) - moves from 23 to 0
    board[23].player2 = 2
    board[12].player2 = 5
    board[7].player2 = 3
    board[5].player2 = 5
    
    return board
  }

  rollDice() {
    this.dice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ]
    
    if (this.dice[0] === this.dice[1]) {
      this.availableDice = [this.dice[0], this.dice[0], this.dice[0], this.dice[0]]
    } else {
      this.availableDice = [...this.dice]
    }
    
    this.gameState = 'moving'
    return this.dice
  }

  // Get all legal moves for the current player
  getLegalMoves() {
    const moves = []
    const player = this.currentPlayer
    const opponent = player === 'player1' ? 'player2' : 'player1'
    const uniqueDice = [...new Set(this.availableDice)]

    if (uniqueDice.length === 0) return []

    // If player has pieces on bar, they MUST move them first
    if (this.bar[player] > 0) {
      for (const die of uniqueDice) {
        const targetPoint = player === 'player1' ? die - 1 : 24 - die
        if (this.board[targetPoint][opponent] <= 1) {
          moves.push({ from: 'bar', to: targetPoint, die })
        }
      }
      return moves // Must clear bar before moving other pieces
    }

    // Regular moves
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (this.board[i][player] > 0) {
        for (const die of uniqueDice) {
          const targetPoint = player === 'player1' ? i + die : i - die
          
          // Check for normal move on board
          if (targetPoint >= 0 && targetPoint < BOARD_SIZE) {
            if (this.board[targetPoint][opponent] <= 1) {
              moves.push({ from: i, to: targetPoint, die })
            }
          } 
          // Check for bearing off
          else if (this.canBearOff()) {
            const isOffExactly = player === 'player1' ? targetPoint === 24 : targetPoint === -1
            const isOverShoot = player === 'player1' ? targetPoint > 24 : targetPoint < -1
            
            if (isOffExactly) {
              moves.push({ from: i, to: 'borne_off', die })
            } else if (isOverShoot) {
              // Can only overshoot if no pieces are further back
              const piecesFurtherBack = this.hasPiecesFurtherBack(i)
              if (!piecesFurtherBack) {
                moves.push({ from: i, to: 'borne_off', die })
              }
            }
          }
        }
      }
    }

    return moves
  }

  hasPiecesFurtherBack(pointIndex) {
    const player = this.currentPlayer
    if (player === 'player1') {
      for (let i = 18; i < pointIndex; i++) {
        if (this.board[i][player] > 0) return true
      }
    } else {
      for (let i = 5; i > pointIndex; i--) {
        if (this.board[i][player] > 0) return true
      }
    }
    return false
  }

  canBearOff() {
    const player = this.currentPlayer
    if (this.bar[player] > 0) return false
    
    if (player === 'player1') {
      for (let i = 0; i < 18; i++) {
        if (this.board[i].player1 > 0) return false
      }
    } else {
      for (let i = 6; i < 24; i++) {
        if (this.board[i].player2 > 0) return false
      }
    }
    return true
  }

  makeMove(from, to, die) {
    const player = this.currentPlayer
    const opponent = player === 'player1' ? 'player2' : 'player1'

    // Validate if the move is legal
    const legalMoves = this.getLegalMoves()
    const isLegal = legalMoves.some(m => m.from === from && m.to === to && m.die === die)
    
    if (!isLegal) return false

    // Execute move
    if (from === 'bar') {
      this.bar[player]--
    } else {
      this.board[from][player]--
    }

    if (to === 'borne_off') {
      this.borne_off[player]++
    } else {
      if (this.board[to][opponent] === 1) {
        this.board[to][opponent] = 0
        this.bar[opponent]++
      }
      this.board[to][player]++
    }

    // Consume die
    const dieIndex = this.availableDice.indexOf(die)
    if (dieIndex > -1) {
      this.availableDice.splice(dieIndex, 1)
    }

    if (this.isGameOver()) {
      this.gameState = 'finished'
    }

    return true
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'player1' ? 'player2' : 'player1'
    this.dice = [0, 0]
    this.availableDice = []
    this.gameState = 'rolling'
  }

  isGameOver() {
    return this.borne_off.player1 === POINTS_PER_PLAYER || 
           this.borne_off.player2 === POINTS_PER_PLAYER
  }

  getWinner() {
    if (this.borne_off.player1 === POINTS_PER_PLAYER) return 'player1'
    if (this.borne_off.player2 === POINTS_PER_PLAYER) return 'player2'
    return null
  }

  getGameState() {
    return {
      board: this.board,
      bar: this.bar,
      borne_off: this.borne_off,
      currentPlayer: this.currentPlayer,
      dice: this.dice,
      availableDice: this.availableDice,
      gameState: this.gameState,
      legalMoves: this.getLegalMoves()
    }
  }
}

export default BackgammonGame
