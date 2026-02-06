/**
 * Utility Helpers for Tic-Tac-Toe Bot Development
 *
 * Import these in your bot to help with strategy:
 *   const { checkWinner, cloneBoard, wouldWin, opponent, printBoard, getEmptyCells } = require('../utils');
 */

/**
 * Check if there's a winner on the board.
 * @param {(string|null)[][]} board - 3x3 board
 * @returns {'X'|'O'|null} - the winner, or null if no winner yet
 */
function checkWinner(board) {
  // Rows
  for (let r = 0; r < 3; r++) {
    if (board[r][0] && board[r][0] === board[r][1] && board[r][1] === board[r][2]) {
      return board[r][0];
    }
  }
  // Columns
  for (let c = 0; c < 3; c++) {
    if (board[0][c] && board[0][c] === board[1][c] && board[1][c] === board[2][c]) {
      return board[0][c];
    }
  }
  // Diagonals
  if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return board[0][0];
  }
  if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return board[0][2];
  }
  return null;
}

/**
 * Returns a deep copy of the board (safe to mutate).
 * @param {(string|null)[][]} board
 * @returns {(string|null)[][]}
 */
function cloneBoard(board) {
  return board.map(row => [...row]);
}

/**
 * Returns true if placing `piece` at (row, col) would win.
 * Does NOT modify the board.
 * @param {(string|null)[][]} board
 * @param {number} row
 * @param {number} col
 * @param {'X'|'O'} piece
 * @returns {boolean}
 */
function wouldWin(board, row, col, piece) {
  if (board[row][col] !== null) return false;
  const copy = cloneBoard(board);
  copy[row][col] = piece;
  return checkWinner(copy) === piece;
}

/**
 * Returns the opponent's piece.
 * @param {'X'|'O'} piece
 * @returns {'X'|'O'}
 */
function opponent(piece) {
  return piece === 'X' ? 'O' : 'X';
}

/**
 * Returns all empty cells on the board.
 * @param {(string|null)[][]} board
 * @returns {{ row: number, col: number }[]}
 */
function getEmptyCells(board) {
  const cells = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        cells.push({ row, col });
      }
    }
  }
  return cells;
}

/**
 * Pretty-prints a board to the console (for debugging).
 * @param {(string|null)[][]} board
 */
function printBoard(board) {
  console.log('');
  for (let r = 0; r < 3; r++) {
    const row = board[r].map(cell => cell || ' ').join(' | ');
    console.log(`  ${row}`);
    if (r < 2) console.log('  ---------');
  }
  console.log('');
}

module.exports = { checkWinner, cloneBoard, wouldWin, opponent, getEmptyCells, printBoard };
