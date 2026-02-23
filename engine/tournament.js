/**
 * Tournament Runner
 * Round-robin tournament: every bot plays every other bot twice (once as X, once as O).
 * Only one game per pair is displayed; the reverse is simulated silently.
 */

const { playGame } = require('./game');

function updateStats(stats, result) {
  stats[result.botA.name].gamesPlayed++;
  stats[result.botB.name].gamesPlayed++;

  if (result.winner === 'botA') {
    stats[result.botA.name].wins++;
    stats[result.botA.name].points += 3;
    if (result.reason === 'win') {
      stats[result.botB.name].losses++;
    } else {
      stats[result.botB.name].forfeits++;
    }
  } else if (result.winner === 'botB') {
    stats[result.botB.name].wins++;
    stats[result.botB.name].points += 3;
    if (result.reason === 'win') {
      stats[result.botA.name].losses++;
    } else {
      stats[result.botA.name].forfeits++;
    }
  } else {
    stats[result.botA.name].draws++;
    stats[result.botB.name].draws++;
    stats[result.botA.name].points += 1;
    stats[result.botB.name].points += 1;
  }
}

function getSortedLeaderboard(stats) {
  return Object.values(stats).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Run a full round-robin tournament.
 * @param {{ name: string, fn: Function, file: string }[]} bots
 * @returns {{ leaderboard: object[], matches: object[], stats: object }}
 */
async function runTournament(bots, { onGameStart, onGameComplete, onReverseGameComplete } = {}) {
  const stats = {};

  // Initialize stats for each bot
  for (const bot of bots) {
    stats[bot.name] = {
      name: bot.name,
      file: bot.file,
      wins: 0,
      losses: 0,
      draws: 0,
      forfeits: 0,
      points: 0,
      gamesPlayed: 0
    };
  }

  const matches = [];
  let fastestWin = null;
  let mostDramatic = null;

  // Each pair plays twice (once each side), but only the first game is displayed
  for (let i = 0; i < bots.length; i++) {
    for (let j = i + 1; j < bots.length; j++) {
      const botA = bots[i];
      const botB = bots[j];

      // Game 1: displayed (A as X, B as O)
      if (onGameStart) {
        await onGameStart(getSortedLeaderboard(stats));
      }

      const result1 = await playGame(botA, botB);
      matches.push(result1);
      updateStats(stats, result1);

      if (onGameComplete) {
        await onGameComplete(result1);
      }

      // Game 2: reverse matchup (B as X, A as O)
      const result2 = await playGame(botB, botA);
      matches.push(result2);
      updateStats(stats, result2);

      if (onReverseGameComplete) {
        await onReverseGameComplete(result2);
      }

      // Track fastest win and most dramatic across both games
      for (const result of [result1, result2]) {
        if (result.reason === 'win') {
          if (!fastestWin || result.moves.length < fastestWin.moves.length) {
            fastestWin = result;
          }
          if (!mostDramatic || result.moves.length > mostDramatic.moves.length) {
            mostDramatic = result;
          }
        }
      }
    }
  }

  const leaderboard = getSortedLeaderboard(stats);

  return {
    leaderboard,
    matches,
    stats: {
      totalGames: matches.length,
      totalBots: bots.length,
      fastestWin,
      mostDramatic
    }
  };
}

module.exports = { runTournament };
