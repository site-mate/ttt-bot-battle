// starter-bot.js — Your starting point! Copy this file into the candidates/ folder and rename it.
// Then make it smarter!

const { opponent, wouldWin, getEmptyCells, cloneBoard } = require("../utils");

const center = { row: 1, col: 1 };
const corner = [
  { row: 0, col: 0 },
  { row: 0, col: 2 },
  { row: 2, col: 2 },
  { row: 2, col: 0 },
];
const edge = [
  { row: 0, col: 1 },
  { row: 1, col: 2 },
  { row: 2, col: 1 },
  { row: 1, col: 0 },
];

// myPiece is the string that represents your X or O!
module.exports = function StarterBot(board, myPiece) {
  // String that denotes the enemy piece (X or O)
  const enemyPiece = opponent(myPiece);

  const emptyCells = getEmptyCells(board);

  for (let { row, col } of emptyCells) {
    if (wouldWin(board, row, col, myPiece)) {
      return { row, col };
    }
  }

  for (let { row, col } of emptyCells) {
    if (wouldWin(board, row, col, enemyPiece)) {
      return { row, col };
    }
  }

  if (emptyCells.length === 9) return center;

  if (emptyCells.length === 8) {
    return board[1][1] ? corner[0] : center;
  }

  const findCellIndex = (collection, piece) => {
    return collection.findIndex(({ row, col }) => board[row][col] === piece);
  };

  if (emptyCells.length === 7) {
    const findCorner = findCellIndex(corner, enemyPiece);
    if (findCorner !== -1) {
      return corner[(findCorner + 2) % 4];
    }

    const findEdge = findCellIndex(edge, enemyPiece);
    return corner[findEdge];
  }

  if (emptyCells.length === 6) {
    const findCorner = findCellIndex(corner, enemyPiece);
    let findEdge;

    if (findCorner !== -1) {
      if (board[1][1] === enemyPiece) {
        return corner.find(({ row, col }) => !board[row][col]);
      }

      findEdge = findCellIndex(edge, enemyPiece);
      if (findEdge === -1) {
        return edge[0];
      }

      for (const { row, col } of edge) {
        if (
          (row === corner[findCorner].row || col === corner[findCorner].col) &&
          row !== edge[findEdge].row &&
          col !== edge[findEdge].col
        ) {
          return { row, col };
        }
      }
    }

    const secondEdge = edge.findLastIndex(
      ({ row, col }) => board[row][col] === enemyPiece,
    );
    if (secondEdge !== -1 && findEdge === (secondEdge + 2) % 4) {
      return corner[0];
    } else if (secondEdge !== -1) {
      if (findEdge === 0) {
        return corner[secondEdge % 3];
      }
      return corner[secondEdge];
    }
  }

  if (emptyCells.length === 5) {
    return (
      corner.find(({ row, col }) => {
        return !board[row][1] && !board[1][col] && !board[row][col];
      }) || edge.find(({ row, col }) => !board[row][col])
    );
  }

  const createMoreThanOnePath = (piece) =>
    emptyCells.find(({ row, col }, index) => {
      let count = 0;
      const newBoard = cloneBoard(board);
      newBoard[row][col] = piece;
      emptyCells.forEach((nextCell, nextIndex) => {
        if (
          index !== nextIndex &&
          wouldWin(newBoard, nextCell.row, nextCell.col, piece)
        ) {
          count += 1;
        }
      });
      return count > 1;
    });

  const myNextMove = createMoreThanOnePath(myPiece);
  if(myNextMove) {
    return myNextMove;
  }

  const enemyNextMove = createMoreThanOnePath(enemyPiece);
  if(enemyNextMove) {
    return enemyNextMove;
  }

  return emptyCells[0];
};
