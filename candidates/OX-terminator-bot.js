// starter-bot.js — Your starting point! Copy this file into the candidates/ folder and rename it.
// Then make it smarter!

const { opponent, getEmptyCells, wouldWin } = require('../utils');

// myPiece is the string that represents your X or O!
module.exports = function StarterBot(board, myPiece) {
  // String that denotes the enemy piece (X or O)
  const enemyPiece = opponent(myPiece);
  const center = {row: 1, col: 1};
  const corners = [{row: 0, col: 0}, {row: 0, col: 2}, {row: 2, col: 0}, {row: 2, col: 2}]

  const emptyCells = getEmptyCells(board);

  const isMiddleEmpty = emptyCells.includes(center)
  if (isMiddleEmpty) {
    return center;
  }

  const winningOpportunities = emptyCells.filter(({row, col}) => wouldWin(board, row, col, myPiece))
  if(winningOpportunities.length > 0) {
    return winningOpportunities[0];
  }

  const blockOpponentOpportunities = emptyCells.filter(({row, col}) => wouldWin(board, row, col, enemyPiece))
  if(blockOpponentOpportunities.length > 0) {
    return blockOpponentOpportunities[0];
  }

  const emptyCorners = corners.filter(corner =>
  emptyCells.some(cell => cell.row === corner.row && cell.col === corner.col)
  );

  if (emptyCorners.length > 0) {
    return emptyCorners[0];
  }
  
  for (let row = 0; row < 3; row++) { 
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        return { row, col };
      }
    }
  }
};