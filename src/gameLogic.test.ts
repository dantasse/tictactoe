import { describe, it, expect, beforeEach } from 'vitest'
import { makeOpponentMove, checkWinner } from './gameLogic3D'

describe('makeOpponentMove', () => {
  beforeEach(() => {
  })

  describe('Winning move detection', () => {
   it('should take a winning move', () => {
      const board = ['', '', '', 'O', 'O', '', '', '', '']
      const result = makeOpponentMove(board)
      expect(result[5]).toBe('O')
      expect(checkWinner(result).winner).toBe('O')
    })

    it('should take a winning move in the main diagonal', () => {
      const board = ['O', '', '', '', 'O', '', '', '', '']
      const result = makeOpponentMove(board)
      expect(result[8]).toBe('O')
      expect(checkWinner(result).winner).toBe('O')
    })
  })

  describe('Blocking player wins', () => {
    it('should block player win', () => {
      const board = ['', '', '', '', '', '', 'X', '', 'X']
      const result = makeOpponentMove(board)
      expect(result[7]).toBe('O')
    })
  })

  describe('Center square preference', () => {
    it('should take center square when available and no immediate threats', () => {
      const board = ['X', '', '', '', '', '', '', '', '']
      const result = makeOpponentMove(board)
      expect(result[4]).toBe('O')
    })

    it('should not take center if already occupied', () => {
      const board = ['X', '', '', '', 'X', '', '', '', '']
      const result = makeOpponentMove(board)
      expect(result[4]).toBe('X') // Should remain X
      // Should take a corner instead
      const corners = [0, 2, 6, 8]
      const takenCorner = corners.find(i => result[i] === 'O')
      expect(takenCorner).toBeDefined()
    })
  })

  describe('Corner preference', () => {
    it('should take a corner when center is occupied and no threats', () => {
      const board = ['', '', '', '', 'X', '', '', '', '']
      const result = makeOpponentMove(board)
      const corners = [0, 2, 6, 8]
      const takenCorner = corners.find(i => result[i] === 'O')
      expect(takenCorner).toBeDefined()
    })

  })

  describe('Fallback to any square', () => {
    it('should take any available square when no strategic moves available', () => {
      const board = ['X', 'O', 'X', 'O', 'X', '', 'O', 'X', 'O']
      const result = makeOpponentMove(board)
      expect(result[5]).toBe('O') // Only available square
    })
  })

  describe('Priority order', () => {
    it('should prioritize winning over blocking', () => {
      // O can win and X can win - O should win
      const board = ['O', 'O', '', 'X', 'X', '', '', '', '']
      const result = makeOpponentMove(board)
      expect(result[2]).toBe('O') // O wins instead of blocking X
      expect(checkWinner(result).winner).toBe('O')
    })

    it('should prioritize blocking over center', () => {
      // X can win and center is available - should block X
      const board = ['X', 'X', '', '', '', '', '', '', '']
      const result = makeOpponentMove(board)
      expect(result[2]).toBe('O') // Block X instead of taking center
    })

    it('should prioritize center over corners', () => {
      // No threats, center and corners available - should take center
      const board = ['X', '', '', '', '', '', '', '', '']
      const result = makeOpponentMove(board)
      expect(result[4]).toBe('O') // Take center instead of corner
    })
  })

  describe('Edge cases', () => {
    it('should return unchanged board when no moves available', () => {
      const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']
      const result = makeOpponentMove(board)
      expect(result).toEqual(board)
    })

    it('should not modify the original board', () => {
      const board = ['X', '', '', '', '', '', '', '', '']
      const originalBoard = [...board]
      makeOpponentMove(board)
      expect(board).toEqual(originalBoard)
    })
  })
})
