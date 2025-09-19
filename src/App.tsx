import { useState } from 'react'
import './App.css'

function App() {
  const [squares, setSquares] = useState<string[]>(Array(9).fill(''))

  const handleSquareClick = (index: number) => {
    const newSquares = [...squares]
    if (newSquares[index] === '') {
      newSquares[index] = 'X'
      setSquares(newSquares)
    }
  }

  const renderSquare = (index: number) => {
    return (
      <button 
        className="square" 
        onClick={() => handleSquareClick(index)}
        key={index}
      >
        {squares[index]}
      </button>
    )
  }

  return (
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
  )
}

export default App
