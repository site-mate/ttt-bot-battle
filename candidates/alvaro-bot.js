// starter-bot.js — Your starting point! Copy this file into the candidates/ folder and rename it.
// Then make it smarter!

const { opponent, wouldWin, getEmptyCells} = require('../utils');

const isFirstOrSecondMove = (board) => getEmptyCells(board).length > 7

const canWinInNextMove = (board, piece) => {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if(wouldWin(board, row, col, piece)) {
        return { row, col }
      }
    }
  }

  return null;
}

const coverCornersIfAvailable = (board) => {
  if(!board[0][0]) return {row: 0, col: 0};
  if(!board[0][2]) return {row:0, col: 2};
  if(!board[2][0]) return {row:2, col: 0};
  if(board[2][2] === null) return {row:2, col: 2};
  
  return null;
}

// myPiece is the string that represents your X or O!
module.exports = function AlvaroBot(board, myPiece) {
  // String that denotes the enemy piece (X or O)
  if(isFirstOrSecondMove(board)) {
    return board[1][1] === null ? { row: 1, col: 1 } : { row: 0, col: 0 };
  }

  const canWin = canWinInNextMove(board, myPiece);
  if(canWin) return canWin;

  const opponentCanWin = canWinInNextMove(board, opponent(myPiece));
  if(opponentCanWin) return opponentCanWin;


  const canAddInCorner = coverCornersIfAvailable(board);
  if(canAddInCorner) return canAddInCorner;
 
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) { 
        return { row, col };
      }
    }
  }
};



