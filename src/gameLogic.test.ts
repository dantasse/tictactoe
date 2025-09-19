import { describe, it, expect } from 'vitest'
import { makeOpponentMove, checkWinner } from './gameLogic'

describe('checkWinner - 10x10 board with 4-in-a-row', () => {
  const createEmptyBoard = () => Array(100).fill('')

  describe('Horizontal wins', () => {
    it('should detect horizontal win in first row', () => {
      const board = createEmptyBoard()
      board[0] = board[1] = board[2] = board[3] = 'X'
      const result = checkWinner(board)
      expect(result.winner).toBe('X')
      expect(result.line).toEqual([0, 1, 2, 3])
    })

    it('should detect horizontal win in middle row', () => {
      const board = createEmptyBoard()
      board[45] = board[46] = board[47] = board[48] = 'O'
      const result = checkWinner(board)
      expect(result.winner).toBe('O')
      expect(result.line).toEqual([45, 46, 47, 48])
    })

    it('should detect horizontal win at end of row', () => {
      const board = createEmptyBoard()
      board[16] = board[17] = board[18] = board[19] = 'X'
      const result = checkWinner(board)
      expect(result.winner).toBe('X')
      expect(result.line).toEqual([16, 17, 18, 19])
    })
  })

  describe('Vertical wins', () => {
    it('should detect vertical win in first column', () => {
      const board = createEmptyBoard()
      board[0] = board[10] = board[20] = board[30] = 'X'
      const result = checkWinner(board)
      expect(result.winner).toBe('X')
      expect(result.line).toEqual([0, 10, 20, 30])
    })

    it('should detect vertical win in middle column', () => {
      const board = createEmptyBoard()
      board[25] = board[35] = board[45] = board[55] = 'O'
      const result = checkWinner(board)
      expect(result.winner).toBe('O')
      expect(result.line).toEqual([25, 35, 45, 55])
    })
  })

  describe('Diagonal wins', () => {
    it('should detect diagonal win (top-left to bottom-right)', () => {
      const board = createEmptyBoard()
      board[0] = board[11] = board[22] = board[33] = 'X'
      const result = checkWinner(board)
      expect(result.winner).toBe('X')
      expect(result.line).toEqual([0, 11, 22, 33])
    })

    it('should detect diagonal win (top-right to bottom-left)', () => {
      const board = createEmptyBoard()
      board[6] = board[15] = board[24] = board[33] = 'O'
      const result = checkWinner(board)
      expect(result.winner).toBe('O')
      expect(result.line).toEqual([6, 15, 24, 33])
    })

    it('should detect diagonal win in middle of board', () => {
      const board = createEmptyBoard()
      board[44] = board[55] = board[66] = board[77] = 'X'
      const result = checkWinner(board)
      expect(result.winner).toBe('X')
      expect(result.line).toEqual([44, 55, 66, 77])
    })
  })

  describe('No winner scenarios', () => {
    it('should return null for empty board', () => {
      const board = createEmptyBoard()
      const result = checkWinner(board)
      expect(result.winner).toBeNull()
      expect(result.line).toBeNull()
    })

    it('should return null for 3-in-a-row (not enough)', () => {
      const board = createEmptyBoard()
      board[0] = board[1] = board[2] = 'X'
      const result = checkWinner(board)
      expect(result.winner).toBeNull()
    })

    it('should return null for interrupted sequence', () => {
      const board = createEmptyBoard()
      board[0] = board[1] = board[3] = board[4] = 'X'
      board[2] = 'O'
      const result = checkWinner(board)
      expect(result.winner).toBeNull()
    })
  })
})

describe('makeOpponentMove - Simplified AI (win/block/random)', () => {
  const createEmptyBoard = () => Array(100).fill('')

  describe('Winning move detection', () => {
    it('should take a winning move horizontally', () => {
      const board = createEmptyBoard()
      board[0] = board[1] = board[2] = 'O'
      const result = makeOpponentMove(board)
      expect(result[3]).toBe('O')
      expect(checkWinner(result).winner).toBe('O')
    })

    it('should take a winning move vertically', () => {
      const board = createEmptyBoard()
      board[0] = board[10] = board[20] = 'O'
      const result = makeOpponentMove(board)
      expect(result[30]).toBe('O')
      expect(checkWinner(result).winner).toBe('O')
    })

    it('should take a winning move diagonally', () => {
      const board = createEmptyBoard()
      board[0] = board[11] = board[22] = 'O'
      const result = makeOpponentMove(board)
      expect(result[33]).toBe('O')
      expect(checkWinner(result).winner).toBe('O')
    })
  })

  describe('Blocking player wins', () => {
    it('should block player horizontal win', () => {
      const board = createEmptyBoard()
      board[0] = board[1] = board[2] = 'X'
      const result = makeOpponentMove(board)
      expect(result[3]).toBe('O')
    })

    it('should block player vertical win', () => {
      const board = createEmptyBoard()
      board[0] = board[10] = board[20] = 'X'
      const result = makeOpponentMove(board)
      expect(result[30]).toBe('O')
    })

    it('should block player diagonal win', () => {
      const board = createEmptyBoard()
      board[0] = board[11] = board[22] = 'X'
      const result = makeOpponentMove(board)
      expect(result[33]).toBe('O')
    })
  })

  describe('Random move when no win/block needed', () => {
    it('should make a random move when no immediate threats', () => {
      const board = createEmptyBoard()
      board[0] = 'X'
      board[50] = 'O'
      const result = makeOpponentMove(board)
      
      // Should place O in some empty square
      const newOMoves = result.filter((square, index) => 
        square === 'O' && board[index] === ''
      )
      expect(newOMoves).toHaveLength(1)
    })

    it('should handle full board gracefully', () => {
      const board = Array(100).fill('X')
      const result = makeOpponentMove(board)
      expect(result).toEqual(board) // Should return unchanged
    })
  })

  describe('Priority order: win > block > random', () => {
    it('should prioritize winning over blocking', () => {
      const board = createEmptyBoard()
      // O can win
      board[0] = board[1] = board[2] = 'O'
      // X threatens to win elsewhere
      board[10] = board[11] = board[12] = 'X'
      
      const result = makeOpponentMove(board)
      expect(result[3]).toBe('O') // Should take the win
      expect(checkWinner(result).winner).toBe('O')
    })

    it('should block when no winning move available', () => {
      const board = createEmptyBoard()
      // X threatens to win
      board[0] = board[1] = board[2] = 'X'
      // O has no immediate win
      board[50] = 'O'
      
      const result = makeOpponentMove(board)
      expect(result[3]).toBe('O') // Should block X
    })
  })
})