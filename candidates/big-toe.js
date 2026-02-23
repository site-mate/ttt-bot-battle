// starter-bot.js — Your starting point! Copy this file into the candidates/ folder and rename it.
// Then make it smarter!

const { opponent, checkWinner, getEmptyCells } = require('../utils');

// myPiece is the string that represents your X or O!
module.exports = function BigToe(board, myPiece) {
  // return if there is a winner
  if(checkWinner(board) !== null) return
  
  // String that denotes the enemy piece (X or O)
  const enemyPiece = opponent(myPiece);

  // if the centre piece is free, place piece there
  if(board[1][1] === null) {
    return { row: 1, col: 1}
  }

  // take the first corner if free
  if(board[0][0] === null) {
    return { row: 0, col: 0}
  }

  // take the bottom right corner if free
  if(board[2][2] === null) {
    return { row: 2, col: 2}
  }

  // take the top right corner if free
  if(board[0][2] === null) {
    return { row: 0, col: 2}
  }

  // take the bottom left corner if free
  if(board[2][0] === null) {
    return { row: 2, col: 0}
  }

  // then start going through the squares to find the next piece
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        return { row, col };
      }
    }
  }
};
