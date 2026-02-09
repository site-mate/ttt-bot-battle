// starter-bot.js — Your starting point! Copy this file into the candidates/ folder and rename it.
// Then make it smarter!

// myPiece is the string that represents your X or O!
module.exports = function StarterBot(board, myPiece) {
  // String that denotes the enemy piece (X or O)
  const enemyPiece = opponent(myPiece);

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        return { row, col };
      }
    }
  }
};
