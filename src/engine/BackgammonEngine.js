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
    this.board = Array.from({ length: 24 }, () => ({ color: null, count: 0 }));
    this.dice = [];
  }
}
