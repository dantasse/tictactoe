import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [squares, setSquares] = useState<string[]>(Array(9).fill(''))
  const [winner, setWinner] = useState<string | null>(null)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true)

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

  const makeOpponentMove = (currentSquares: string[]) => {
    const emptySquares = currentSquares
      .map((square, index) => square === '' ? index : null)
      .filter(index => index !== null) as number[]
    
    if (emptySquares.length === 0) return currentSquares
    
    const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)]
    const newSquares = [...currentSquares]
    newSquares[randomIndex] = 'O'
    
    return newSquares
  }

  const handleSquareClick = (index: number) => {
    if (winner || squares[index] !== '' || !isPlayerTurn) {
      return
    }

    // Player move
    const newSquares = [...squares]
    newSquares[index] = 'X'
    
    const playerResult = checkWinner(newSquares)
    if (playerResult.winner) {
      setSquares(newSquares)
      setWinner(playerResult.winner)
      setWinningLine(playerResult.line)
      return
    }

    setSquares(newSquares)

    // Check if board is full after player move
    if (newSquares.every(square => square !== '')) {
      setWinner("nobody");
      return
    }

    setIsPlayerTurn(false)

    // Opponent move after a delay
    setTimeout(() => {
      const opponentSquares = makeOpponentMove(newSquares)
      const opponentResult = checkWinner(opponentSquares)
      
      setSquares(opponentSquares)
      setWinner(opponentResult.winner)
      setWinningLine(opponentResult.line)
      setIsPlayerTurn(true)
    }, 500)
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
    {!isPlayerTurn && <h2>thinking...</h2>}
    {winner && (
      <div className="game-status">
        {winner === "nobody" && <h2>cat's game</h2>}
        {winner !== "nobody" && <h2>{winner} wins!</h2>}
      </div>
    )}
    </>
  )
}

export default App
