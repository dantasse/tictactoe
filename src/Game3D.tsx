import { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { Mesh } from 'three'
import { checkWinner, makeOpponentMove, get3DCoords, createEmpty3DBoard } from './gameLogic3D'

interface CubeProps {
  position: [number, number, number]
  value: string
  onClick: () => void
  isWinningSquare: boolean
}

function GameCube({ position, value, onClick, isWinningSquare }: CubeProps) {
  const meshRef = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  const cubeColor = isWinningSquare ? '#ff6b6b' : (hovered ? '#4ecdc4' : '#cccccc')
  const wireframeColor = value ? '#2c3e50' : '#34495e'

  return (
    <group position={position}>
      {/* Main cube */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={cubeColor} transparent opacity={value ? 0.9 : 0.3} />
      </mesh>
      
      {/* Wireframe */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.82, 0.82, 0.82]} />
        <meshBasicMaterial color={wireframeColor} wireframe />
      </mesh>

      {/* Text for X or O */}
      {value && (
        <Text
          position={[0, 0, 0.5]}
          fontSize={0.4}
          color={value === 'X' ? '#e74c3c' : '#f39c12'}
          anchorX="center"
          anchorY="middle"
        >
          {value}
        </Text>
      )}
    </group>
  )
}

function Scene() {
  const [squares, setSquares] = useState<string[]>(createEmpty3DBoard())
  const [isXNext, setIsXNext] = useState(true)
  const [gameResult, setGameResult] = useState<{ winner: string | null, line: number[] | null }>({ winner: null, line: null })

  const handleClick = (index: number) => {
    if (squares[index] || gameResult.winner) return

    const newSquares = [...squares]
    newSquares[index] = 'X'
    setSquares(newSquares)
    setIsXNext(false)

    const result = checkWinner(newSquares)
    if (result.winner) {
      setGameResult(result)
      return
    }

    // Check for tie
    if (newSquares.every(square => square !== '')) {
      setGameResult({ winner: 'tie', line: null })
      return
    }

    // AI move
    setTimeout(() => {
      const aiSquares = makeOpponentMove(newSquares)
      setSquares(aiSquares)
      setIsXNext(true)

      const aiResult = checkWinner(aiSquares)
      if (aiResult.winner) {
        setGameResult(aiResult)
      } else if (aiSquares.every(square => square !== '')) {
        setGameResult({ winner: 'tie', line: null })
      }
    }, 500)
  }

  const resetGame = () => {
    setSquares(createEmpty3DBoard())
    setIsXNext(true)
    setGameResult({ winner: null, line: null })
  }

  return (
    <>
      {/* Game status */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 100, 
        color: 'white',
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif'
      }}>
        {gameResult.winner ? (
          <div>
            <div>{gameResult.winner === 'tie' ? "It's a tie!" : `${gameResult.winner} wins!`}</div>
            <button 
              onClick={resetGame}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#4ecdc4',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Play Again
            </button>
          </div>
        ) : (
          <div>Next player: {isXNext ? 'X' : 'O'}</div>
        )}
      </div>

      {/* Instructions */}
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        left: '20px', 
        zIndex: 100, 
        color: 'white',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>🖱️ Click cubes to place X</div>
        <div>🔄 Drag to rotate view</div>
        <div>🎯 Get 3 in a row to win!</div>
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [8, 8, 8], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        {/* Render all 27 cubes */}
        {squares.map((value, index) => {
          const [x, y, z] = get3DCoords(index)
          const position: [number, number, number] = [
            (x - 1) * 2, // Center the grid
            (y - 1) * 2,
            (z - 1) * 2
          ]
          const isWinningSquare = gameResult.line?.includes(index) || false

          return (
            <GameCube
              key={index}
              position={position}
              value={value}
              onClick={() => handleClick(index)}
              isWinningSquare={isWinningSquare}
            />
          )
        })}

        {/* Grid helper lines */}
        <gridHelper args={[6, 3]} position={[0, -3, 0]} />
      </Canvas>
    </>
  )
}

export default function Game3D() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#2c3e50' }}>
      <Scene />
    </div>
  )
}
