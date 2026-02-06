/**
 * Tournament Runner
 * Round-robin tournament: every bot plays every other bot twice (once as X, once as O).
 */

const { playGame } = require('./game');

/**
 * Run a full round-robin tournament.
 * @param {{ name: string, fn: Function, file: string }[]} bots
 * @returns {{ leaderboard: object[], matches: object[], stats: object }}
 */
function runTournament(bots) {
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

  // Every bot plays every other bot twice
  for (let i = 0; i < bots.length; i++) {
    for (let j = 0; j < bots.length; j++) {
      if (i === j) continue;

      const botA = bots[i]; // plays as X
      const botB = bots[j]; // plays as O

      const result = playGame(botA, botB);
      matches.push(result);

      stats[botA.name].gamesPlayed++;
      stats[botB.name].gamesPlayed++;

      if (result.winner === 'botA') {
        stats[botA.name].wins++;
        stats[botA.name].points += 3;
        if (result.reason === 'win') {
          stats[botB.name].losses++;
        } else {
          stats[botB.name].forfeits++;
        }
      } else if (result.winner === 'botB') {
        stats[botB.name].wins++;
        stats[botB.name].points += 3;
        if (result.reason === 'win') {
          stats[botA.name].losses++;
        } else {
          stats[botA.name].forfeits++;
        }
      } else {
        // Draw
        stats[botA.name].draws++;
        stats[botB.name].draws++;
        stats[botA.name].points += 1;
        stats[botB.name].points += 1;
      }

      // Track fastest win
      if (result.reason === 'win') {
        if (!fastestWin || result.moves.length < fastestWin.moves.length) {
          fastestWin = result;
        }
      }

      // Track most dramatic (longest game that ended in a win, not draw)
      if (result.reason === 'win') {
        if (!mostDramatic || result.moves.length > mostDramatic.moves.length) {
          mostDramatic = result;
        }
      }
    }
  }

  // Sort leaderboard by points (desc), then wins (desc), then name (asc)
  const leaderboard = Object.values(stats).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.name.localeCompare(b.name);
  });

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
