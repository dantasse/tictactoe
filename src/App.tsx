import { useState } from 'react'
import './App.css'
import { checkWinner, makeOpponentMove } from './gameLogic'

function App() {
  const BOARD_SIZE = 10
  const [squares, setSquares] = useState<string[]>(Array(BOARD_SIZE * BOARD_SIZE).fill(''))
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

  const resetGame = () => {
    setSquares(Array(BOARD_SIZE * BOARD_SIZE).fill(''))
    setWinner(null)
    setWinningLine(null)
    setIsPlayerTurn(true)
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
        {Array.from({ length: BOARD_SIZE }, (_, row) => (
          <div className="board-row" key={row}>
            {Array.from({ length: BOARD_SIZE }, (_, col) => 
              renderSquare(row * BOARD_SIZE + col)
            )}
          </div>
        ))}
      </div>
    </div>
    {!isPlayerTurn && <h2>thinking...</h2>}
    {winner && (
      <div className="game-status">
        {winner === "nobody" && <h2>cat's game</h2>}
        {winner !== "nobody" && <h2>{winner} wins!</h2>}
        <button onClick={resetGame} className="reset-button">Play Again</button>
      </div>
    )}
    {!winner && (
      <button onClick={resetGame} className="reset-button">Reset Game</button>
    )}
    </>
  )
}

export default App
