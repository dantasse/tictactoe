// 3D Tic-tac-toe: 3x3x3 cube (27 positions)
// Position mapping: index = x + y*3 + z*9
// where x, y, z are each 0, 1, or 2

export const get3DIndex = (x: number, y: number, z: number): number => {
  return x + y * 3 + z * 9
}

export const get3DCoords = (index: number): [number, number, number] => {
  const z = Math.floor(index / 9)
  const y = Math.floor((index % 9) / 3)
  const x = index % 3
  return [x, y, z]
}

export const checkWinner = (squares: string[]): { winner: string | null, line: number[] | null } => {
  const lines: number[][] = []
  
  // Generate all possible winning lines in 3D
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Lines parallel to X axis
      lines.push([get3DIndex(0, i, j), get3DIndex(1, i, j), get3DIndex(2, i, j)])
      // Lines parallel to Y axis
      lines.push([get3DIndex(i, 0, j), get3DIndex(i, 1, j), get3DIndex(i, 2, j)])
      // Lines parallel to Z axis
      lines.push([get3DIndex(i, j, 0), get3DIndex(i, j, 1), get3DIndex(i, j, 2)])
    }
  }
  
  // Face diagonals (12 total - 4 diagonals on each of 3 pairs of opposite faces)
  for (let i = 0; i < 3; i++) {
    // XY plane diagonals (at each Z level)
    lines.push([get3DIndex(0, 0, i), get3DIndex(1, 1, i), get3DIndex(2, 2, i)])
    lines.push([get3DIndex(2, 0, i), get3DIndex(1, 1, i), get3DIndex(0, 2, i)])
    
    // XZ plane diagonals (at each Y level)
    lines.push([get3DIndex(0, i, 0), get3DIndex(1, i, 1), get3DIndex(2, i, 2)])
    lines.push([get3DIndex(2, i, 0), get3DIndex(1, i, 1), get3DIndex(0, i, 2)])
    
    // YZ plane diagonals (at each X level)
    lines.push([get3DIndex(i, 0, 0), get3DIndex(i, 1, 1), get3DIndex(i, 2, 2)])
    lines.push([get3DIndex(i, 2, 0), get3DIndex(i, 1, 1), get3DIndex(i, 0, 2)])
  }
  
  // Space diagonals (4 total - corner to corner through center)
  lines.push([get3DIndex(0, 0, 0), get3DIndex(1, 1, 1), get3DIndex(2, 2, 2)])
  lines.push([get3DIndex(2, 0, 0), get3DIndex(1, 1, 1), get3DIndex(0, 2, 2)])
  lines.push([get3DIndex(0, 2, 0), get3DIndex(1, 1, 1), get3DIndex(2, 0, 2)])
  lines.push([get3DIndex(0, 0, 2), get3DIndex(1, 1, 1), get3DIndex(2, 2, 0)])

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

  // Take center if available (position 13: center of the cube)
  const centerIndex = get3DIndex(1, 1, 1)
  if (currentSquares[centerIndex] === '') {
    const newSquares = [...currentSquares]
    newSquares[centerIndex] = 'O'
    return newSquares
  }

  // Take corners if available (8 corner positions)
  const corners = [
    get3DIndex(0, 0, 0), get3DIndex(2, 0, 0), get3DIndex(0, 2, 0), get3DIndex(2, 2, 0),
    get3DIndex(0, 0, 2), get3DIndex(2, 0, 2), get3DIndex(0, 2, 2), get3DIndex(2, 2, 2)
  ]
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

export const createEmpty3DBoard = (): string[] => {
  return Array(27).fill('')
}