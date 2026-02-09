// starter-bot.js — Your starting point! Copy this file into the candidates/ folder and rename it.
// Then make it smarter!

module.exports = function StarterBot(board, myPiece) {
  // The board is a 3x3 grid. Each cell is one of:
  //   null       → empty (you can play here!)
  //   myPiece    → yours (e.g. 'X' if you're X)
  //   !== null && !== myPiece → opponent's
  //
  // Example board when you're playing as 'X':
  //
  //   board = [
  //     [ 'X',  null,  'O' ],   ← row 0: you at (0,0), empty at (0,1), opponent at (0,2)
  //     [ null, null,  null],   ← row 1: all empty
  //     [ null, 'O',   null]    ← row 2: opponent at (2,1)
  //   ]
  //
  // How to check a cell:
  //   board[row][col] === null       → it's empty
  //   board[row][col] === myPiece    → it's yours
  //   board[row][col] !== null
  //     && board[row][col] !== myPiece → it's your opponent's

  // Strategy: pick the first empty cell. Not great, but it works!
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        return { row, col };
      }
    }
  }
};
