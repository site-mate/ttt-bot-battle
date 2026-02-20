/**
 * Worker thread script for running bot moves with real timeout enforcement.
 * Receives bot file path, board state, and piece via workerData.
 * Posts the bot's move back to the parent thread.
 */

const { workerData, parentPort } = require('worker_threads');

const { botFile, board, piece } = workerData;

try {
  const botFn = require(botFile);
  const move = botFn(board, piece);
  parentPort.postMessage({ move, error: null });
} catch (err) {
  parentPort.postMessage({ move: null, error: err.message });
}
