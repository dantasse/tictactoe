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

const BOARD_SIZE = 10
const WIN_LENGTH = 4
const MAX_DEPTH = 2

// Evaluate board position for minimax
const evaluateBoard = (squares: string[], player: string): number => {
  const { winner } = checkWinner(squares)
  
  // Terminal states
  if (winner === player) return 1000
  if (winner && winner !== player) return -1000
  
  let score = 0
  
  // Evaluate potential winning lines
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      // Check all directions for potential lines
      const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal down-right
        [1, -1]   // diagonal down-left
      ]
      
      for (const [dRow, dCol] of directions) {
        if (row + (WIN_LENGTH - 1) * dRow >= 0 && 
            row + (WIN_LENGTH - 1) * dRow < BOARD_SIZE &&
            col + (WIN_LENGTH - 1) * dCol >= 0 && 
            col + (WIN_LENGTH - 1) * dCol < BOARD_SIZE) {
          
          let playerCount = 0
          let opponentCount = 0
          let emptyCount = 0
          
          for (let i = 0; i < WIN_LENGTH; i++) {
            const checkRow = row + i * dRow
            const checkCol = col + i * dCol
            const checkIndex = checkRow * BOARD_SIZE + checkCol
            const cell = squares[checkIndex]
            
            if (cell === player) playerCount++
            else if (cell && cell !== player) opponentCount++
            else emptyCount++
          }
          
          // Only score lines that aren't blocked by opponent
          if (opponentCount === 0) {
            if (playerCount === 3) score += 50
            else if (playerCount === 2) score += 10
            else if (playerCount === 1) score += 1
          }
          
          // Penalize opponent's potential lines
          if (playerCount === 0) {
            if (opponentCount === 3) score -= 50
            else if (opponentCount === 2) score -= 10
            else if (opponentCount === 1) score -= 1
          }
        }
      }
    }
  }
  
  return score
}

// Minimax with alpha-beta pruning
const minimax = (
  squares: string[], 
  depth: number, 
  isMaximizing: boolean, 
  alpha: number, 
  beta: number,
  aiPlayer: string,
  humanPlayer: string
): number => {
  const { winner } = checkWinner(squares)
  
  // Terminal conditions
  if (winner === aiPlayer) return 1000 - depth
  if (winner === humanPlayer) return -1000 + depth
  if (depth >= MAX_DEPTH) return evaluateBoard(squares, aiPlayer)
  
  const emptySquares = squares
    .map((square, index) => square === '' ? index : null)
    .filter(index => index !== null) as number[]
  
  if (emptySquares.length === 0) return 0
  
  if (isMaximizing) {
    let maxEval = -Infinity
    for (const index of emptySquares) {
      const newSquares = [...squares]
      newSquares[index] = aiPlayer
      const eval_ = minimax(newSquares, depth + 1, false, alpha, beta, aiPlayer, humanPlayer)
      maxEval = Math.max(maxEval, eval_)
      alpha = Math.max(alpha, eval_)
      if (beta <= alpha) break // Alpha-beta pruning
    }
    return maxEval
  } else {
    let minEval = Infinity
    for (const index of emptySquares) {
      const newSquares = [...squares]
      newSquares[index] = humanPlayer
      const eval_ = minimax(newSquares, depth + 1, true, alpha, beta, aiPlayer, humanPlayer)
      minEval = Math.min(minEval, eval_)
      beta = Math.min(beta, eval_)
      if (beta <= alpha) break // Alpha-beta pruning
    }
    return minEval
  }
}

export const makeOpponentMove = (currentSquares: string[]) => {
  const emptySquares = currentSquares
    .map((square, index) => square === '' ? index : null)
    .filter(index => index !== null) as number[]
  
  if (emptySquares.length === 0) return currentSquares

  const aiPlayer = 'O'
  const humanPlayer = 'X'
  
  // Quick win/block check first (optimization)
  for (const index of emptySquares) {
    const testSquares = [...currentSquares]
    testSquares[index] = aiPlayer
    if (checkWinner(testSquares).winner === aiPlayer) {
      const newSquares = [...currentSquares]
      newSquares[index] = aiPlayer
      return newSquares
    }
  }
  
  for (const index of emptySquares) {
    const testSquares = [...currentSquares]
    testSquares[index] = humanPlayer
    if (checkWinner(testSquares).winner === humanPlayer) {
      const newSquares = [...currentSquares]
      newSquares[index] = aiPlayer
      return newSquares
    }
  }
  
  // Limit search space for performance - only consider moves near existing pieces
  let candidateMoves = emptySquares
  if (emptySquares.length > 20) {
    candidateMoves = emptySquares.filter(index => {
      const row = Math.floor(index / BOARD_SIZE)
      const col = index % BOARD_SIZE
      
      // Check if there's a piece within 2 squares
      for (let r = Math.max(0, row - 2); r <= Math.min(BOARD_SIZE - 1, row + 2); r++) {
        for (let c = Math.max(0, col - 2); c <= Math.min(BOARD_SIZE - 1, col + 2); c++) {
          const checkIndex = r * BOARD_SIZE + c
          if (currentSquares[checkIndex] !== '') {
            return true
          }
        }
      }
      return false
    })
    
    // If no moves near existing pieces, take center area
    if (candidateMoves.length === 0) {
      candidateMoves = emptySquares.filter(index => {
        const row = Math.floor(index / BOARD_SIZE)
        const col = index % BOARD_SIZE
        return row >= 3 && row <= 6 && col >= 3 && col <= 6
      })
    }
    
    // Fallback to all moves if still empty
    if (candidateMoves.length === 0) {
      candidateMoves = emptySquares.slice(0, 10) // Just take first 10
    }
  }
  
  let bestMove = candidateMoves[0]
  let bestScore = -Infinity
  
  // Evaluate each candidate move using minimax
  for (const index of candidateMoves) {
    const newSquares = [...currentSquares]
    newSquares[index] = aiPlayer
    
    const score = minimax(newSquares, 0, false, -Infinity, Infinity, aiPlayer, humanPlayer)
    
    if (score > bestScore) {
      bestScore = score
      bestMove = index
    }
  }
  
  const newSquares = [...currentSquares]
  newSquares[bestMove] = aiPlayer
  return newSquares
}
