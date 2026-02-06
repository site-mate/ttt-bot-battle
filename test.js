#!/usr/bin/env node

/**
 * Bot Test Runner
 *
 * Usage:
 *   node test.js ./candidates/my-bot.js
 *   node test.js ./candidates/my-bot.js ./bots/blocker-bot.js
 */

const path = require('path');
const chalk = require('chalk');
const { playGame, getBotName } = require('./engine/game');

function loadBot(filePath) {
  const resolved = path.resolve(filePath);
  try {
    const fn = require(resolved);
    if (typeof fn !== 'function') {
      console.error(chalk.red(`\n  Error: ${filePath} does not export a function.`));
      console.error(chalk.gray(`  Make sure your file has: module.exports = function myBot(board, myPiece) { ... }\n`));
      process.exit(1);
    }
    const name = fn.botName || fn.name || path.basename(filePath, '.js');
    return { name, fn, file: resolved };
  } catch (err) {
    console.error(chalk.red(`\n  Error loading ${filePath}: ${err.message}`));
    if (err.code === 'MODULE_NOT_FOUND') {
      console.error(chalk.gray(`  Make sure the file path is correct.\n`));
    } else {
      console.error(chalk.gray(`  There might be a syntax error in your bot file.\n`));
      console.error(chalk.gray(`  ${err.stack}\n`));
    }
    process.exit(1);
  }
}

function runMatchup(botA, botB, gamesPerSide) {
  const results = { wins: 0, losses: 0, draws: 0, forfeits: 0, errors: [] };

  // Bot plays as X
  for (let i = 0; i < gamesPerSide; i++) {
    const result = playGame(botA, botB);
    if (result.winner === 'botA') {
      results.wins++;
    } else if (result.winner === 'botB') {
      if (result.reason === 'invalid_move' || result.reason === 'timeout' || result.reason === 'error') {
        results.forfeits++;
        results.errors.push(result.forfeitDetail);
      } else {
        results.losses++;
      }
    } else {
      results.draws++;
    }
  }

  // Bot plays as O
  for (let i = 0; i < gamesPerSide; i++) {
    const result = playGame(botB, botA);
    if (result.winner === 'botB') {
      results.wins++;
    } else if (result.winner === 'botA') {
      if (result.reason === 'invalid_move' || result.reason === 'timeout' || result.reason === 'error') {
        results.forfeits++;
        results.errors.push(result.forfeitDetail);
      } else {
        results.losses++;
      }
    } else {
      results.draws++;
    }
  }

  return results;
}

function printMatchupResult(yourName, opponentName, results, totalGames) {
  console.log(`\n  ${chalk.bold(yourName)} vs ${chalk.bold(opponentName)} (${totalGames} games):`);
  console.log(
    `    ${chalk.green(`Wins: ${results.wins}`)}  |  ` +
    `${chalk.red(`Losses: ${results.losses}`)}  |  ` +
    `${chalk.yellow(`Draws: ${results.draws}`)}`
  );

  if (results.forfeits > 0) {
    console.log(chalk.red(`    Forfeits: ${results.forfeits}`));
    // Show unique errors
    const uniqueErrors = [...new Set(results.errors)];
    for (const err of uniqueErrors) {
      console.log(chalk.red(`      - ${err}`));
    }
  }
}

// --- Main ---

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(chalk.cyan('\n  TTT Bot Battle - Test Runner'));
  console.log(chalk.gray('\n  Usage:'));
  console.log(chalk.gray('    node test.js ./candidates/my-bot.js'));
  console.log(chalk.gray('    node test.js ./candidates/my-bot.js ./bots/blocker-bot.js'));
  console.log('');
  process.exit(0);
}

const myBot = loadBot(args[0]);
console.log(chalk.cyan(`\n  Testing: ${chalk.bold(myBot.name)}`));
console.log(chalk.gray('  ─'.repeat(20)));

const GAMES_PER_SIDE = 5;

if (args.length >= 2) {
  // Test against a specific bot
  const opponent = loadBot(args[1]);
  const results = runMatchup(myBot, opponent, GAMES_PER_SIDE);
  printMatchupResult(myBot.name, opponent.name, results, GAMES_PER_SIDE * 2);
} else {
  // Test against starter-bot and random-bot
  const starterBot = loadBot(path.join(__dirname, 'bots', 'starter-bot.js'));
  const randomBot = loadBot(path.join(__dirname, 'bots', 'random-bot.js'));

  const starterResults = runMatchup(myBot, starterBot, GAMES_PER_SIDE);
  printMatchupResult(myBot.name, starterBot.name, starterResults, GAMES_PER_SIDE * 2);

  const randomResults = runMatchup(myBot, randomBot, GAMES_PER_SIDE);
  printMatchupResult(myBot.name, randomBot.name, randomResults, GAMES_PER_SIDE * 2);
}

console.log(chalk.gray('\n  ─'.repeat(20)));
console.log(chalk.green('  Done!\n'));
