import { useState, useEffect } from 'react'
import './App.css'
import { checkWinner, makeOpponentMove } from './gameLogic'

function App() {
  const [squares, setSquares] = useState<string[]>(Array(9).fill(''))
  const [winner, setWinner] = useState<string | null>(null)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true)



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
    }, 200)
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
