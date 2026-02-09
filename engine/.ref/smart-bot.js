// smart-bot.js — DO NOT give to candidates. For testing only.
// Strategy: win > block > center > corner > edge

const { checkWinner, cloneBoard, opponent } = require('../../utils');

module.exports = function SmartBot(board, myPiece) {
  const enemyPiece = opponent(myPiece);
  const emptyCells = [];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        emptyCells.push({ row, col });
      }
    }
  }

  // 1. Win if possible
  for (const cell of emptyCells) {
    const copy = cloneBoard(board);
    copy[cell.row][cell.col] = myPiece;
    if (checkWinner(copy) === myPiece) {
      return cell;
    }
  }

  // 2. Block opponent from winning
  for (const cell of emptyCells) {
    const copy = cloneBoard(board);
    copy[cell.row][cell.col] = enemyPiece;
    if (checkWinner(copy) === enemyPiece) {
      return cell;
    }
  }

  // 3. Take center
  if (board[1][1] === null) {
    return { row: 1, col: 1 };
  }

  // 4. Take a corner
  const corners = [
    { row: 0, col: 0 }, { row: 0, col: 2 },
    { row: 2, col: 0 }, { row: 2, col: 2 }
  ];
  const emptyCorners = corners.filter(c => board[c.row][c.col] === null);
  if (emptyCorners.length > 0) {
    return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
  }

  // 5. Take an edge
  const edges = [
    { row: 0, col: 1 }, { row: 1, col: 0 },
    { row: 1, col: 2 }, { row: 2, col: 1 }
  ];
  const emptyEdges = edges.filter(c => board[c.row][c.col] === null);
  if (emptyEdges.length > 0) {
    return emptyEdges[Math.floor(Math.random() * emptyEdges.length)];
  }

  return emptyCells[0];
};
