const { opponent, getEmptyCells, checkWinner, cloneBoard } = require('../utils');

class Node {
  constructor(state, parent, move, turn) {
    this.state = state;
    this.parent = parent;
    this.move = move;
    this.turn = turn;
    this.children = [];
    this.wins = 0;
    this.simulations = 0;
  }

  ucb(totalSimulations) {
    if (this.simulations === 0) return Infinity;
    return (this.wins / this.simulations)
      + Math.SQRT2 * Math.sqrt(Math.log(totalSimulations) / this.simulations);
  }
}

module.exports = function JohnAnBot(board, myPiece) {
  const enemyPiece = opponent(myPiece);
  const start = Date.now();

  const root = new Node(board, null, null, enemyPiece);

  while (Date.now() - start < 1000) {

    // SELECTION
    let node = root;
    while (true) {
      const empty = getEmptyCells(node.state);
      if (empty.length === 0 || checkWinner(node.state)) break;

      const expandedMoves = node.children.map(c => c.move);

      const unexpanded = empty.filter(
        sq => !expandedMoves.some(m => m.row === sq.row && m.col === sq.col)
      );

      if (unexpanded.length > 0) break;

      node = node.children.reduce((best, child) =>
        child.ucb(root.simulations) > best.ucb(root.simulations) ? child : best
      );
    }

    // EXPANSION
    const empty = getEmptyCells(node.state);
    if (empty.length > 0 && !checkWinner(node.state)) {
      const expandedMoves = node.children.map(c => c.move);
      const unexpanded = empty.filter(
        sq => !expandedMoves.some(m => m.row === sq.row && m.col === sq.col)
      );

      if (unexpanded.length > 0) {
        const move = unexpanded[Math.floor(Math.random() * unexpanded.length)];
        const newState = cloneBoard(node.state);
        const piece = node.turn === myPiece ? enemyPiece : myPiece;
        newState[move.row][move.col] = piece;

        const child = new Node(newState, node, move, piece);
        node.children.push(child);
        node = child;
      }
    }

    // SIMULATION
    const simState = cloneBoard(node.state);
    let simTurn = node.turn;
    while (!checkWinner(simState) && getEmptyCells(simState).length > 0) {
      simTurn = simTurn === myPiece ? enemyPiece : myPiece;
      const simEmpty = getEmptyCells(simState);

      let pick = simEmpty.find(c => {
        simState[c.row][c.col] = simTurn;
        const w = checkWinner(simState);
        simState[c.row][c.col] = null;
        return w === simTurn;
      });

      if (!pick) {
        const opp = simTurn === myPiece ? enemyPiece : myPiece;
        pick = simEmpty.find(c => {
          simState[c.row][c.col] = opp;
          const w = checkWinner(simState);
          simState[c.row][c.col] = null;
          return w === opp;
        });
      }

      if (!pick) pick = simEmpty[Math.floor(Math.random() * simEmpty.length)];

      simState[pick.row][pick.col] = simTurn;
    }
    const winner = checkWinner(simState);

    // BACKPROPAGATION
    let current = node;
    while (current !== null) {
      current.simulations++;
      if (winner === current.turn) {
        current.wins++;
      }
      current = current.parent;
    }
  }

  let bestChild = root.children[0];
  for (const child of root.children) {
    if (child.simulations > bestChild.simulations) {
      bestChild = child;
    }
  }

  return bestChild.move;
};
