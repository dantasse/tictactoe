import { useState } from 'react'
import './App.css'

function App() {
  const [squares, setSquares] = useState<string[]>(Array(9).fill(''))
  const [winner, setWinner] = useState<string | null>(null)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)

  const checkWinner = (squares: string[]): { winner: string | null, line: number[] | null } => {
    const lines = [
      [0, 1, 2], // top row
      [3, 4, 5], // middle row
      [6, 7, 8], // bottom row
      [0, 3, 6], // left column
      [1, 4, 7], // middle column
      [2, 5, 8], // right column
      [0, 4, 8], // diagonal top-left to bottom-right
      [2, 4, 6], // diagonal top-right to bottom-left
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] }
      }
    }
    return { winner: null, line: null }
  }

  const handleSquareClick = (index: number) => {
    if (winner || squares[index] !== '') {
      return
    }

    const newSquares = [...squares]
    newSquares[index] = 'X'
    
    const result = checkWinner(newSquares)
    setSquares(newSquares)
    setWinner(result.winner)
    setWinningLine(result.line)
  }

  const renderSquare = (index: number) => {
    const isWinningSquare = winningLine && winningLine.includes(index)
    return (
      <button 
        className={`square ${isWinningSquare ? 'winning-square' : ''}`}
        onClick={() => handleSquareClick(index)}
        key={index}
      >
        {squares[index]}
      </button>
    )
  }

  return (
    <>
    <div className="game">
      <div className="game-board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
    </div>
    {winner && (
      <div className="game-status">
        <h2>{winner} wins!</h2>
      </div>
    )}
    </>
  )
}

export default App
