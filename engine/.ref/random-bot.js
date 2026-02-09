// random-bot.js — Picks a random empty cell. Simple but unpredictable!

module.exports = function RandomBot(board, myPiece) {
  const emptyCells = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        emptyCells.push({ row, col });
      }
    }
  }
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};
