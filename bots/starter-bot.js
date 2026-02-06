// starter-bot.js — Your starting point! Copy this file into the candidates/ folder and rename it.
// Then make it smarter!

module.exports = function StarterBot(board, myPiece) {
  // Strategy: pick the first empty cell. Not great, but it works!
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        return { row, col };
      }
    }
  }
};
