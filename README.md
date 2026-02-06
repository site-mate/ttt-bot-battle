# TTT Bot Battle

Welcome to the Tic-Tac-Toe Bot Battle Tournament! You're going to build a bot that plays tic-tac-toe, and at the end of the session we'll pit all the bots against each other in a round-robin tournament on the big screen.

**Don't worry about writing perfect code** -- have fun, be creative, and name your bot something fun!

## Getting Started

1. Copy the starter bot into the `candidates/` folder and give it your own name:

```bash
cp bots/starter-bot.js candidates/my-awesome-bot.js
```

2. Open your file and start making it smarter!

3. Test your bot:

```bash
node test.js ./candidates/my-awesome-bot.js
```

## Your Bot

Your bot is a single function. It receives the board and which piece you're playing as, and returns the cell you want to place your piece in.

```js
module.exports = function MyBotName(board, myPiece) {
  // board is a 3x3 array:
  // [
  //   ['X',  null, 'O' ],
  //   [null, 'X',  null],
  //   [null, null, null ]
  // ]
  //
  // myPiece is either 'X' or 'O'
  //
  // Return the cell you want to play:
  return { row: 0, col: 1 };
};
```

### Board Layout

```
         col 0  |  col 1  |  col 2
        --------+---------+--------
row 0   (0,0)   |  (0,1)  |  (0,2)
        --------+---------+--------
row 1   (1,0)   |  (1,1)  |  (1,2)
        --------+---------+--------
row 2   (2,0)   |  (2,1)  |  (2,2)
```

- `null` means the cell is empty
- `'X'` or `'O'` means that piece is in the cell
- Rows and columns are numbered 0-2

## Utility Helpers

We've provided some helpful functions you can import:

```js
const { checkWinner, cloneBoard, wouldWin, opponent, getEmptyCells, printBoard } = require('../utils');
```

| Function | What it does |
|---|---|
| `checkWinner(board)` | Returns `'X'`, `'O'`, or `null` |
| `cloneBoard(board)` | Returns a deep copy of the board (safe to mutate) |
| `wouldWin(board, row, col, piece)` | Returns `true` if placing `piece` at (row, col) would win |
| `opponent(piece)` | Returns the other piece (`'X'` -> `'O'`, `'O'` -> `'X'`) |
| `getEmptyCells(board)` | Returns array of `{ row, col }` for all empty cells |
| `printBoard(board)` | Pretty-prints the board to console (for debugging) |

## Testing Your Bot

```bash
# Test against the starter bot and random bot
node test.js ./candidates/my-bot.js

# Test against a specific bot
node test.js ./candidates/my-bot.js ./bots/blocker-bot.js
```

Your bot plays 10 games per opponent (5 as X, 5 as O) and you'll see your win/loss/draw record.

## Strategy Hints

Think about these questions as you improve your bot:

- Can you check if you're about to win and take that move?
- What if your opponent is about to win -- can you block them?
- Are some cells more valuable than others?
- What if you could simulate a move before making it to see what happens?

## Rules

- Your bot must be **synchronous** (no `async`, no `setTimeout`, no network calls)
- No external npm packages -- just use the provided utils
- Don't modify any files outside your own bot file
- Your bot has a **1-second time limit** per move -- if it takes longer, it forfeits
- If your bot returns an invalid move or throws an error, it forfeits that game
- Have fun!

## Tournament Scoring

| Result | Points |
|---|---|
| Win | 3 |
| Draw | 1 |
| Loss | 0 |
| Forfeit | 0 |

Every bot plays every other bot twice -- once as X (going first) and once as O.
