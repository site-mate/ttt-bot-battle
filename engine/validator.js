/**
 * Move Validator
 * Validates bot moves for correctness.
 */

function validateMove(board, move) {
  if (move === null || move === undefined || typeof move !== 'object') {
    return { valid: false, reason: `Invalid move format: expected an object with { row, col } but got ${JSON.stringify(move)}` };
  }

  if (typeof move.row !== 'number' || typeof move.col !== 'number') {
    return { valid: false, reason: `Row and col must be numbers. Got row=${JSON.stringify(move.row)}, col=${JSON.stringify(move.col)}` };
  }

  if (!Number.isInteger(move.row) || !Number.isInteger(move.col)) {
    return { valid: false, reason: `Row and col must be integers. Got row=${move.row}, col=${move.col}` };
  }

  if (move.row < 0 || move.row > 2 || move.col < 0 || move.col > 2) {
    return { valid: false, reason: `Move out of bounds: { row: ${move.row}, col: ${move.col} }. Row and col must be 0-2` };
  }

  if (board[move.row][move.col] !== null) {
    return { valid: false, reason: `Cell (${move.row}, ${move.col}) is already occupied by '${board[move.row][move.col]}'` };
  }

  return { valid: true };
}

module.exports = { validateMove };
