#!/usr/bin/env node

/**
 * TTT Bot Battle - Main Tournament Runner
 *
 * Usage:
 *   node tournament.js            # Full animated tournament
 *   node tournament.js --quick    # Skip animation, just show results
 *   node tournament.js --dir ./other-folder
 */

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { runTournament } = require('./engine/tournament');
const {
  animateGame,
  printQuickResult,
  printLeaderboard,
  printTournamentSummary,
  printWelcome
} = require('./engine/display');

// Parse CLI args
const args = process.argv.slice(2);
const quickMode = args.includes('--quick');
const dirIndex = args.indexOf('--dir');
const candidatesDir = dirIndex !== -1 && args[dirIndex + 1]
  ? path.resolve(args[dirIndex + 1])
  : path.join(__dirname, 'candidates');

function loadBots(dir) {
  if (!fs.existsSync(dir)) {
    console.error(chalk.red(`\n  Error: Directory not found: ${dir}\n`));
    process.exit(1);
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== '.gitkeep');

  if (files.length === 0) {
    console.error(chalk.red(`\n  No bot files found in ${dir}`));
    console.error(chalk.gray(`  Drop your .js bot files into the candidates/ folder and try again.\n`));
    process.exit(1);
  }

  const bots = [];
  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      const fn = require(filePath);
      if (typeof fn !== 'function') {
        console.warn(chalk.yellow(`  Warning: ${file} does not export a function. Skipping.`));
        continue;
      }
      const name = fn.botName || fn.name || path.basename(file, '.js');
      bots.push({ name, fn, file: filePath });
      console.log(chalk.gray(`  Loaded: ${chalk.white(name)} (${file})`));
    } catch (err) {
      console.warn(chalk.yellow(`  Warning: Failed to load ${file}: ${err.message}. Skipping.`));
    }
  }

  return bots;
}

async function main() {
  printWelcome();

  console.log(chalk.gray(`  Loading bots from: ${candidatesDir}`));
  console.log('');

  const bots = loadBots(candidatesDir);

  if (bots.length < 2) {
    console.error(chalk.red(`\n  Need at least 2 bots to run a tournament. Found ${bots.length}.\n`));
    process.exit(1);
  }

  console.log(chalk.cyan(`\n  ${bots.length} bots loaded. Let the battle begin!\n`));

  const { leaderboard, matches, stats } = runTournament(bots);

  if (quickMode) {
    console.log(chalk.gray('  Quick mode: showing results only\n'));
    for (const result of matches) {
      printQuickResult(result);
    }
  } else {
    for (const result of matches) {
      await animateGame(result);
    }
  }

  printLeaderboard(leaderboard);
  printTournamentSummary(stats);
}

main().catch(err => {
  console.error(chalk.red(`\n  Tournament error: ${err.message}\n`));
  process.exit(1);
});
