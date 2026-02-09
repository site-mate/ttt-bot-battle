#!/usr/bin/env node

/**
 * Bot Test Runner
 *
 * Usage:
 *   node test.js ./candidates/my-bot.js
 *   node test.js ./candidates/my-bot.js --watch
 *   node test.js ./candidates/my-bot.js ./bots/starter-bot.js
 *   node test.js ./candidates/my-bot.js ./bots/starter-bot.js --watch
 */

const path = require('path');
const chalk = require('chalk');
const { playGame } = require('./engine/game');
const { animateGame, printMatchBanner, printGameResult } = require('./engine/display');

const REF_DIR = path.join(__dirname, 'engine', '.ref');

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

function tallyResult(results, result, myBotLabel) {
  const otherLabel = myBotLabel === 'botA' ? 'botB' : 'botA';
  if (result.winner === myBotLabel) {
    results.wins++;
  } else if (result.winner === otherLabel) {
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

function runMatchup(botA, botB, gamesPerSide) {
  const results = { wins: 0, losses: 0, draws: 0, forfeits: 0, errors: [], games: [] };

  for (let i = 0; i < gamesPerSide; i++) {
    const result = playGame(botA, botB);
    results.games.push(result);
    tallyResult(results, result, 'botA');
  }

  for (let i = 0; i < gamesPerSide; i++) {
    const result = playGame(botB, botA);
    results.games.push(result);
    tallyResult(results, result, 'botB');
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
    const uniqueErrors = [...new Set(results.errors)];
    for (const err of uniqueErrors) {
      console.log(chalk.red(`      - ${err}`));
    }
  }
}

async function animateMatchupGames(games) {
  for (const game of games) {
    await animateGame(game, 800);
  }
}

// --- Main ---

const rawArgs = process.argv.slice(2);
const watchMode = rawArgs.includes('--watch');
const args = rawArgs.filter(a => a !== '--watch');

if (args.length === 0) {
  console.log(chalk.cyan('\n  TTT Bot Battle - Test Runner'));
  console.log(chalk.gray('\n  Usage:'));
  console.log(chalk.gray('    node test.js ./candidates/my-bot.js'));
  console.log(chalk.gray('    node test.js ./candidates/my-bot.js --watch'));
  console.log(chalk.gray('    node test.js ./candidates/my-bot.js ./bots/starter-bot.js'));
  console.log('');
  process.exit(0);
}

async function main() {
  const myBot = loadBot(args[0]);
  console.log(chalk.cyan(`\n  Testing: ${chalk.bold(myBot.name)}`));
  console.log(chalk.gray('  ─'.repeat(20)));

  const GAMES_PER_SIDE = 5;

  if (args.length >= 2) {
    // Test against a specific bot
    const opponent = loadBot(args[1]);
    const results = runMatchup(myBot, opponent, GAMES_PER_SIDE);
    if (watchMode) await animateMatchupGames(results.games);
    printMatchupResult(myBot.name, opponent.name, results, GAMES_PER_SIDE * 2);
  } else {
    // Test against all reference bots
    const starterBot = loadBot(path.join(__dirname, 'bots', 'starter-bot.js'));
    const randomBot = loadBot(path.join(REF_DIR, 'random-bot.js'));
    const blockerBot = loadBot(path.join(REF_DIR, 'blocker-bot.js'));
    const smartBot = loadBot(path.join(REF_DIR, 'smart-bot.js'));

    const opponents = [starterBot, randomBot, blockerBot, smartBot];

    for (const opponent of opponents) {
      const results = runMatchup(myBot, opponent, GAMES_PER_SIDE);
      if (watchMode) await animateMatchupGames(results.games);
      printMatchupResult(myBot.name, opponent.name, results, GAMES_PER_SIDE * 2);
    }
  }

  console.log(chalk.gray('\n  ─'.repeat(20)));
  console.log(chalk.green('  Done!\n'));
}

main().catch(err => {
  console.error(chalk.red(`\n  Error: ${err.message}\n`));
  process.exit(1);
});
