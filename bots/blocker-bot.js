// blocker-bot.js — Checks if opponent is about to win and blocks. Otherwise picks randomly.

const { checkWinner, cloneBoard, opponent } = require('../utils');

module.exports = function BlockerBot(board, myPiece) {
  const enemyPiece = opponent(myPiece);
  const emptyCells = [];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        emptyCells.push({ row, col });
      }
    }
  }

  // Check if we can win first
  for (const cell of emptyCells) {
    const copy = cloneBoard(board);
    copy[cell.row][cell.col] = myPiece;
    if (checkWinner(copy) === myPiece) {
      return cell;
    }
  }

  // Block opponent from winning
  for (const cell of emptyCells) {
    const copy = cloneBoard(board);
    copy[cell.row][cell.col] = enemyPiece;
    if (checkWinner(copy) === enemyPiece) {
      return cell;
    }
  }

  // Otherwise pick randomly
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};
