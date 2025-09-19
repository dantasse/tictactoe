export const checkWinner = (squares: string[]): { winner: string | null, line: number[] | null } => {
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

export const makeOpponentMove = (currentSquares: string[]) => {
  const emptySquares = currentSquares
    .map((square, index) => square === '' ? index : null)
    .filter(index => index !== null) as number[]
  
  if (emptySquares.length === 0) return currentSquares

  // Check if opponent can win
  for (const index of emptySquares) {
    const testSquares = [...currentSquares]
    testSquares[index] = 'O'
    if (checkWinner(testSquares).winner === 'O') {
      const newSquares = [...currentSquares]
      newSquares[index] = 'O'
      return newSquares
    }
  }

  // Check if need to block player from winning
  for (const index of emptySquares) {
    const testSquares = [...currentSquares]
    testSquares[index] = 'X'
    if (checkWinner(testSquares).winner === 'X') {
      const newSquares = [...currentSquares]
      newSquares[index] = 'O'
      return newSquares
    }
  }

  // Take center if available
  if (currentSquares[4] === '') {
    const newSquares = [...currentSquares]
    newSquares[4] = 'O'
    return newSquares
  }

  // Take corners if available
  const corners = [0, 2, 6, 8]
  const availableCorners = corners.filter(index => currentSquares[index] === '')
  if (availableCorners.length > 0) {
    const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)]
    const newSquares = [...currentSquares]
    newSquares[randomCorner] = 'O'
    return newSquares
  }

  // Take any remaining square
  const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)]
  const newSquares = [...currentSquares]
  newSquares[randomIndex] = 'O'
  
  return newSquares
}