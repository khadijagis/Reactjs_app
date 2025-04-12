import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


function Square({ value, onSquareClick }) {
  const colorClass = value === 'X' ? 'text-primary' : 'text-danger';
  return (
    <button
      className={`btn ${value ? 'btn-light' : 'btn-outline-light'} ${colorClass} fs-1 fw-bold w-100 h-100`}
      style={{ minHeight: '80px' }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? <div className="alert alert-success mb-3">🏆🏆 Gagnant : {winner} </div>
    : <div className="alert alert-info mb-3">Joueur suivant : {xIsNext ? 'X' : 'O'}</div>;

  return (
    <div className="bg-dark p-3 rounded-3">
      {status}
      <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {squares.map((square, i) => (
          <Square key={i} value={square} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => (
    <li key={move} className="list-group-item">
      <button
        className={`btn btn-sm ${move === currentMove ? 'btn-warning' : 'btn-outline-secondary'}`}
        onClick={() => jumpTo(move)}
      >
        {move > 0 ? `Aller au coup #${move}` : 'Début de partie'}
      </button>
    </li>
  ));

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">
  <span className="badge bg-primary p-3 fs-1">
    TIC-TAC-TOE <small className="fs-4">Morpion</small>
  </span>
</h1>
      <div className="row">
        <div className="col-lg-8 mb-4 mb-lg-0">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Historique</h5>
            </div>
            <ul className="list-group list-group-flush">{moves}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}