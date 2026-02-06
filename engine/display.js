/**
 * Terminal Display
 * Flashy terminal output for the tournament.
 */

const chalk = require('chalk');

const DELAY_MS = 500;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Render a board cell with color.
 */
function colorCell(cell) {
  if (cell === 'X') return chalk.bold.cyan('X');
  if (cell === 'O') return chalk.bold.magenta('O');
  return chalk.gray('.');
}

/**
 * Render the board as a string.
 */
function renderBoard(board) {
  const lines = [];
  lines.push('');
  for (let r = 0; r < 3; r++) {
    const row = board[r].map(cell => ` ${colorCell(cell)} `).join(chalk.gray('|'));
    lines.push(`    ${row}`);
    if (r < 2) {
      lines.push(chalk.gray('    -----------'));
    }
  }
  lines.push('');
  return lines.join('\n');
}

/**
 * Print board (static, no animation).
 */
function printBoard(board) {
  console.log(renderBoard(board));
}

/**
 * Display a match announcement banner.
 */
function printMatchBanner(nameA, nameB) {
  const inner = `  ${nameA}  vs  ${nameB}  `;
  const width = Math.max(inner.length + 4, 40);
  const padded = inner.padStart((width + inner.length) / 2).padEnd(width);
  const border = '='.repeat(width);

  console.log('');
  console.log(chalk.yellow(`  +${border}+`));
  console.log(chalk.yellow(`  |${padded}|`));
  console.log(chalk.yellow(`  +${border}+`));
  console.log('');
}

/**
 * Animate a single game move-by-move.
 */
async function animateGame(result, delayMs = DELAY_MS) {
  printMatchBanner(result.botA.name, result.botB.name);

  const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];

  console.log(chalk.gray(`  ${result.botA.name} plays as ${chalk.cyan('X')}  |  ${result.botB.name} plays as ${chalk.magenta('O')}`));

  for (const move of result.moves) {
    board[move.row][move.col] = move.player;
    const pieceColor = move.player === 'X' ? chalk.cyan : chalk.magenta;
    console.log(chalk.gray(`  ${move.botName} plays ${pieceColor(move.player)} at (${move.row}, ${move.col})`));
    printBoard(board);
    await sleep(delayMs);
  }

  printGameResult(result);
}

/**
 * Display the result of a single game.
 */
function printGameResult(result) {
  if (result.reason === 'win') {
    const winnerName = result.winner === 'botA' ? result.botA.name : result.botB.name;
    console.log(chalk.green.bold(`  WINNER: ${winnerName}!`));
  } else if (result.reason === 'draw') {
    console.log(chalk.yellow.bold(`  DRAW!`));
  } else {
    const reason = result.forfeitDetail || result.reason;
    console.log(chalk.red.bold(`  FORFEIT: ${reason}`));
  }
  console.log('');
}

/**
 * Display the final leaderboard.
 */
function printLeaderboard(leaderboard) {
  console.log('');
  console.log(chalk.yellow.bold('  ============================================'));
  console.log(chalk.yellow.bold('           FINAL LEADERBOARD'));
  console.log(chalk.yellow.bold('  ============================================'));
  console.log('');

  // Header
  console.log(
    chalk.gray('  ') +
    chalk.bold('#'.padEnd(4)) +
    chalk.bold('Bot'.padEnd(20)) +
    chalk.bold('W'.padStart(4)) +
    chalk.bold('L'.padStart(4)) +
    chalk.bold('D'.padStart(4)) +
    chalk.bold('F'.padStart(4)) +
    chalk.bold('Pts'.padStart(6))
  );
  console.log(chalk.gray('  ' + '-'.repeat(46)));

  for (let i = 0; i < leaderboard.length; i++) {
    const bot = leaderboard[i];
    let medal = '  ';
    if (i === 0) medal = chalk.yellow('1st');
    else if (i === 1) medal = chalk.white('2nd');
    else if (i === 2) medal = chalk.hex('#CD7F32')('3rd');
    else medal = chalk.gray(`${i + 1}`.padEnd(3));

    const nameColor = i === 0 ? chalk.yellow.bold : i < 3 ? chalk.white : chalk.gray;

    console.log(
      '  ' +
      medal.padEnd(4) +
      ' ' +
      nameColor(bot.name.padEnd(19)) +
      chalk.green(String(bot.wins).padStart(4)) +
      chalk.red(String(bot.losses).padStart(4)) +
      chalk.yellow(String(bot.draws).padStart(4)) +
      chalk.red(String(bot.forfeits).padStart(4)) +
      chalk.bold(String(bot.points).padStart(6))
    );
  }

  console.log('');
}

/**
 * Display tournament summary stats.
 */
function printTournamentSummary(stats) {
  console.log(chalk.yellow.bold('  ============================================'));
  console.log(chalk.yellow.bold('           TOURNAMENT STATS'));
  console.log(chalk.yellow.bold('  ============================================'));
  console.log('');
  console.log(`  Total bots:  ${chalk.bold(stats.totalBots)}`);
  console.log(`  Total games: ${chalk.bold(stats.totalGames)}`);

  if (stats.fastestWin) {
    const fw = stats.fastestWin;
    const winnerName = fw.winner === 'botA' ? fw.botA.name : fw.botB.name;
    console.log(`  Fastest win: ${chalk.green.bold(winnerName)} in ${chalk.bold(fw.moves.length)} moves`);
  }

  if (stats.mostDramatic) {
    const md = stats.mostDramatic;
    const winnerName = md.winner === 'botA' ? md.botA.name : md.botB.name;
    console.log(`  Longest win: ${chalk.magenta.bold(winnerName)} in ${chalk.bold(md.moves.length)} moves`);
  }

  console.log('');
}

/**
 * Display a quick game result (no animation).
 */
function printQuickResult(result) {
  const nameA = result.botA.name;
  const nameB = result.botB.name;

  if (result.reason === 'win') {
    const winnerName = result.winner === 'botA' ? nameA : nameB;
    const loserName = result.winner === 'botA' ? nameB : nameA;
    console.log(chalk.gray(`  ${chalk.green(winnerName)} beat ${loserName} in ${result.moves.length} moves`));
  } else if (result.reason === 'draw') {
    console.log(chalk.gray(`  ${nameA} vs ${nameB}: ${chalk.yellow('Draw')}`));
  } else {
    console.log(chalk.gray(`  ${nameA} vs ${nameB}: ${chalk.red(`Forfeit by ${result.forfeitBy}`)} (${result.reason})`));
  }
}

/**
 * Print the welcome banner.
 */
function printWelcome() {
  console.log('');
  console.log(chalk.cyan.bold('  ╔══════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('  ║                                              ║'));
  console.log(chalk.cyan.bold('  ║      TTT BOT BATTLE TOURNAMENT              ║'));
  console.log(chalk.cyan.bold('  ║      Tic-Tac-Toe AI Showdown!               ║'));
  console.log(chalk.cyan.bold('  ║                                              ║'));
  console.log(chalk.cyan.bold('  ╚══════════════════════════════════════════════╝'));
  console.log('');
}

module.exports = {
  printBoard,
  renderBoard,
  animateGame,
  printGameResult,
  printLeaderboard,
  printTournamentSummary,
  printQuickResult,
  printMatchBanner,
  printWelcome
};
