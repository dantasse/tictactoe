export const checkWinner = (squares: string[]): { winner: string | null, line: number[] | null } => {
  const BOARD_SIZE = 10
  const WIN_LENGTH = 4

  // Check all possible 4-in-a-row combinations
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const index = row * BOARD_SIZE + col
      const player = squares[index]
      
      if (!player) continue

      // Check horizontal (right)
      if (col <= BOARD_SIZE - WIN_LENGTH) {
        const line = []
        let isWin = true
        for (let i = 0; i < WIN_LENGTH; i++) {
          const checkIndex = row * BOARD_SIZE + col + i
          line.push(checkIndex)
          if (squares[checkIndex] !== player) {
            isWin = false
            break
          }
        }
        if (isWin) return { winner: player, line }
      }

      // Check vertical (down)
      if (row <= BOARD_SIZE - WIN_LENGTH) {
        const line = []
        let isWin = true
        for (let i = 0; i < WIN_LENGTH; i++) {
          const checkIndex = (row + i) * BOARD_SIZE + col
          line.push(checkIndex)
          if (squares[checkIndex] !== player) {
            isWin = false
            break
          }
        }
        if (isWin) return { winner: player, line }
      }

      // Check diagonal (down-right)
      if (row <= BOARD_SIZE - WIN_LENGTH && col <= BOARD_SIZE - WIN_LENGTH) {
        const line = []
        let isWin = true
        for (let i = 0; i < WIN_LENGTH; i++) {
          const checkIndex = (row + i) * BOARD_SIZE + col + i
          line.push(checkIndex)
          if (squares[checkIndex] !== player) {
            isWin = false
            break
          }
        }
        if (isWin) return { winner: player, line }
      }

      // Check diagonal (down-left)
      if (row <= BOARD_SIZE - WIN_LENGTH && col >= WIN_LENGTH - 1) {
        const line = []
        let isWin = true
        for (let i = 0; i < WIN_LENGTH; i++) {
          const checkIndex = (row + i) * BOARD_SIZE + col - i
          line.push(checkIndex)
          if (squares[checkIndex] !== player) {
            isWin = false
            break
          }
        }
        if (isWin) return { winner: player, line }
      }
    }
  }
  
  return { winner: null, line: null }
}

export const makeOpponentMove = (currentSquares: string[]) => {
  const emptySquares = currentSquares
    .map((square, index) => square === '' ? index : null)
    .filter(index => index !== null) as number[]
  
  if (emptySquares.length === 0) return currentSquares

  // 1. Check if opponent can win
  for (const index of emptySquares) {
    const testSquares = [...currentSquares]
    testSquares[index] = 'O'
    if (checkWinner(testSquares).winner === 'O') {
      const newSquares = [...currentSquares]
      newSquares[index] = 'O'
      return newSquares
    }
  }

  // 2. Check if need to block player from winning
  for (const index of emptySquares) {
    const testSquares = [...currentSquares]
    testSquares[index] = 'X'
    if (checkWinner(testSquares).winner === 'X') {
      const newSquares = [...currentSquares]
      newSquares[index] = 'O'
      return newSquares
    }
  }

  // 3. Move randomly to any available square
  const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)]
  const newSquares = [...currentSquares]
  newSquares[randomIndex] = 'O'
  
  return newSquares
}