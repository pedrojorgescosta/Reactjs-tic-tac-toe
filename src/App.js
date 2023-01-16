import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isSortAsc, setIsSortAsc] = useState(true);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    console.log(nextMove);
    setCurrentMove(nextMove);
  }

  const moves = history.map((_squares, move) => {
    let description;
    if (move > 0) {
      const moveIndex = _squares.findIndex(
        (e, i) => e !== history[move - 1][i]
      );
      const currXXCoord = (moveIndex % 3) + 1; //Add one so columns start at 1
      const currYYCoord = moveIndex < 3 ? 1 : moveIndex < 6 ? 2 : 3;
      if (move === currentMove) {
        description = `You are at move #${move}, last move (${currXXCoord}, ${currYYCoord})`;
      } else {
        description = `Go to move #${move} at (${currXXCoord}, ${currYYCoord})`;
      }
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          Ascending
          <input
            type="checkbox"
            checked={isSortAsc}
            onChange={(e) => setIsSortAsc(e.target.checked)}
          />
        </div>
        <ul className="no-bullets">
          {isSortAsc ? moves.sort() : moves.reverse()}
        </ul>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;
  if (winner === "Draw") status = winner;
  else if (winner) {
    status = "Winner: " + squares[winner[0]];
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array(3)
        .fill()
        .map((er, iR) => (
          <div className="board-row">
            {Array(3)
              .fill()
              .map((es, iS) => {
                const num = 3 * iR + iS;
                return (
                  <Square
                    key={"s" + num}
                    id={num}
                    value={squares[num]}
                    onSquareClick={() => handleClick(num)}
                    winnerSquares={winner}
                  />
                );
              })}
          </div>
        ))}
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  const emptySquares = squares.filter((e) => !e).length;
  if (!emptySquares) return "Draw";
  return null;
}

function Square({ id, value, onSquareClick, winnerSquares }) {
  return (
    <button
      className="square"
      alt={"Winners" + winnerSquares}
      style={{
        backgroundColor:
          winnerSquares && winnerSquares.includes(id) ? "green" : "",
        color: winnerSquares && winnerSquares.includes(id) ? "white" : "",
      }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
