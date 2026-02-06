/**
 * Core Game Engine
 * Runs a single game between two bots.
 */

const { validateMove } = require('./validator');
const { checkWinner, cloneBoard } = require('../utils');

const MOVE_TIMEOUT_MS = 1000;

/**
 * Extract bot name from function name or file path.
 */
function getBotName(bot) {
  if (bot.fn.botName) return bot.fn.botName;
  if (bot.fn.name && bot.fn.name !== 'anonymous') return bot.fn.name;
  if (bot.file) {
    const base = require('path').basename(bot.file, '.js');
    return base;
  }
  return 'UnnamedBot';
}

/**
 * Execute a bot's move with a timeout.
 * Returns { move, error, timedOut }
 */
function executeBotMove(botFn, boardClone, piece) {
  const start = Date.now();
  try {
    const move = botFn(boardClone, piece);
    const elapsed = Date.now() - start;
    if (elapsed > MOVE_TIMEOUT_MS) {
      return { move: null, error: null, timedOut: true };
    }
    return { move, error: null, timedOut: false };
  } catch (err) {
    return { move: null, error: err, timedOut: false };
  }
}

/**
 * Play a single game between two bots.
 * @param {{ name?: string, fn: Function, file?: string }} botA - plays as X (goes first)
 * @param {{ name?: string, fn: Function, file?: string }} botB - plays as O
 * @returns {object} Game result
 */
function playGame(botA, botB) {
  const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];

  const nameA = botA.name || getBotName(botA);
  const nameB = botB.name || getBotName(botB);

  const moves = [];
  const players = [
    { piece: 'X', bot: botA, label: 'botA', name: nameA },
    { piece: 'O', bot: botB, label: 'botB', name: nameB }
  ];

  const result = {
    winner: null,
    reason: null,
    moves: [],
    finalBoard: null,
    botA: { name: nameA, file: botA.file || null },
    botB: { name: nameB, file: botB.file || null }
  };

  for (let turn = 0; turn < 9; turn++) {
    const current = players[turn % 2];
    const boardClone = cloneBoard(board);

    const { move, error, timedOut } = executeBotMove(current.bot.fn, boardClone, current.piece);

    // Timeout
    if (timedOut) {
      result.winner = current.label === 'botA' ? 'botB' : 'botA';
      result.reason = 'timeout';
      result.moves = moves;
      result.finalBoard = cloneBoard(board);
      result.forfeitBy = current.name;
      result.forfeitDetail = `${current.name} exceeded the 1-second time limit`;
      return result;
    }

    // Error/exception
    if (error) {
      result.winner = current.label === 'botA' ? 'botB' : 'botA';
      result.reason = 'error';
      result.moves = moves;
      result.finalBoard = cloneBoard(board);
      result.forfeitBy = current.name;
      result.forfeitDetail = `${current.name} threw an error: ${error.message}`;
      return result;
    }

    // Validate move
    const validation = validateMove(board, move);
    if (!validation.valid) {
      result.winner = current.label === 'botA' ? 'botB' : 'botA';
      result.reason = 'invalid_move';
      result.moves = moves;
      result.finalBoard = cloneBoard(board);
      result.forfeitBy = current.name;
      result.forfeitDetail = `${current.name}: ${validation.reason}`;
      return result;
    }

    // Apply move
    board[move.row][move.col] = current.piece;
    moves.push({ player: current.piece, row: move.row, col: move.col, botName: current.name });

    // Check for winner
    const winner = checkWinner(board);
    if (winner) {
      result.winner = winner === 'X' ? 'botA' : 'botB';
      result.reason = 'win';
      result.moves = moves;
      result.finalBoard = cloneBoard(board);
      return result;
    }
  }

  // Draw
  result.winner = 'draw';
  result.reason = 'draw';
  result.moves = moves;
  result.finalBoard = cloneBoard(board);
  return result;
}

module.exports = { playGame, getBotName };
