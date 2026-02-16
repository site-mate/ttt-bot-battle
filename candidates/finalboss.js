const { checkWinner, getEmptyCells, opponent } = require('../utils');

const MOVE_ORDER = [
  [1, 1],
  [0, 0], [0, 2], [2, 0], [2, 2],
  [0, 1], [1, 0], [1, 2], [2, 1],
];

function minimax(isMaximizing, alpha, beta, depth) {
  const winner = checkWinner(board);
  if (winner === myPiece) return 10 + depth;
  if (winner === enemyPiece) return -10 - depth;

  const empty = getEmptyCells(board);
  if (empty.length === 0) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (const { row, col } of empty) {
      board[row][col] = myPiece;
      best = Math.max(best, minimax(false, alpha, beta, depth - 1));
      board[row][col] = null;
      if (best >= beta) return best;
      if (best > alpha) alpha = best;
    }
    return best;
  } else {
    let best = Infinity;
    for (const { row, col } of empty) {
      board[row][col] = enemyPiece;
      best = Math.min(best, minimax(true, alpha, beta, depth - 1));
      board[row][col] = null;
      if (best <= alpha) return best;
      if (best < beta) beta = best;
    }
    return best;
  }
}

module.exports = function FinalBossBot(board, myPiece) {
  const enemyPiece = opponent(myPiece);

  const emptyCells = [];
  for (const [r, c] of MOVE_ORDER) {
    if (board[r][c] === null) emptyCells.push(r * 3 + c);
  }
  if (emptyCells.length === 9) return { row: 1, col: 1 };

  for (const idx of emptyCells) {
    const r = (idx / 3) | 0, c = idx % 3;
    board[r][c] = myPiece;
    if (checkWinner(board) === myPiece) { board[r][c] = null; return { row: r, col: c }; }
    board[r][c] = null;
  }
  for (const idx of emptyCells) {
    const r = (idx / 3) | 0, c = idx % 3;
    board[r][c] = enemyPiece;
    if (checkWinner(board) === enemyPiece) { board[r][c] = null; return { row: r, col: c }; }
    board[r][c] = null;
  }

  let bestScore = -Infinity;
  let bestMove = null;
  const depth = emptyCells.length;

  for (const [r, c] of MOVE_ORDER) {
    if (board[r][c] !== null) continue;
    board[r][c] = myPiece;
    const score = minimax(false, bestScore, Infinity, depth - 1);
    board[r][c] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = { row: r, col: c };
    }
  }

  return bestMove;
};
