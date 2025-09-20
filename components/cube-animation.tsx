"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { EdgesGeometry, LineBasicMaterial, LineSegments } from "three"

interface CubeProps {
  position: [number, number, number]
  isHighlighted: boolean
  isSelected: boolean
  cellKey: string
  isNewPlayer: boolean
}

function CubeCell({ position, isHighlighted, isSelected, cellKey, isNewPlayer }: CubeProps) {
  // Ultra vibrant, glowing colors
  const colors = ["#ff0040", "#00ff80", "#0080ff", "#ffff00", "#ff0080", "#00ffff", "#ff8000", "#8000ff"]
  const color = colors[Math.floor(Math.random() * colors.length)]

  const isVisible = isNewPlayer || isSelected || isHighlighted

  return (
    <group position={position}>
      {/* Main cube with color/transparent material */}
      <mesh>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color={isHighlighted ? "#ffffff" : color}
          emissive={isHighlighted ? color : isSelected ? color : "#000000"}
          emissiveIntensity={isHighlighted ? 4.0 : isSelected ? 2.0 : 0}
          metalness={0.1}
          roughness={0.05}
          transparent={true}
          opacity={isVisible ? 1 : 0}
        />
      </mesh>

      {/* Black edge outline - only the 12 edges, no diagonals */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.2, 1.2, 1.2)]} />
        <lineBasicMaterial color="#000000" transparent={true} opacity={0.7} />
      </lineSegments>
    </group>
  )
}

function AnimatedCube({ isAnimating, playCount }: { isAnimating: boolean, playCount: number }) {
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set())
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  useEffect(() => {
    if (isAnimating) {
      setSelectedCell(null) // Reset selected cell when animation starts

      // Determine behavior based on play count
      const isNewPlayer = playCount === 0

      if (isNewPlayer) {
        // NEW PLAYER: All cells filled during animation, no final selection
        setHighlightedCells(new Set()) // No highlighting needed
        setSelectedCell(null) // No single selection
      } else {
        // RETURNING PLAYER: Random highlighting during animation, single selection at end
        const interval = setInterval(() => {
          // Randomly highlight cells during animation
          const randomCells = new Set<string>()
          for (let i = 0; i < 5; i++) {
            const x = Math.floor(Math.random() * 3)
            const y = Math.floor(Math.random() * 3)
            const z = Math.floor(Math.random() * 3)
            randomCells.add(`${x}-${y}-${z}`)
          }
          setHighlightedCells(randomCells)
        }, 200)

        return () => clearInterval(interval)
      }
    } else {
      // Animation finished
      const isNewPlayer = playCount === 0 // || true (uncomment to test new player behavior)

      if (isNewPlayer) {
        // NEW PLAYER: Keep all cells visible (no selection behavior)
        setHighlightedCells(new Set())
        setSelectedCell(null)
      } else {
        // RETURNING PLAYER: Randomly select one cell, others become transparent
        setHighlightedCells(new Set())
        const allCells = []
        for (let x = 0; x < 3; x++) {
          for (let y = 0; y < 3; y++) {
            for (let z = 0; z < 3; z++) {
              allCells.push(`${x}-${y}-${z}`)
            }
          }
        }
        const randomIndex = Math.floor(Math.random() * allCells.length)
        setSelectedCell(allCells[randomIndex])
      }
    }
  }, [isAnimating, playCount])

  const cubes = []
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        const position: [number, number, number] = [(x - 1) * 1.8, (y - 1) * 1.8, (z - 1) * 1.8]
        const key = `${x}-${y}-${z}`
        const isHighlighted = highlightedCells.has(key)
        const isSelected = selectedCell === key

        const isNewPlayer = playCount === 0 // || true (uncomment to test new player behavior)

        cubes.push(<CubeCell key={key} position={position} isHighlighted={isHighlighted} isSelected={isSelected} cellKey={key} isNewPlayer={isNewPlayer} />)
      }
    }
  }

  return <group ref={groupRef}>{cubes}</group>
}

interface CubeAnimationProps {
  isAnimating: boolean
  playCount: number
}

export function CubeAnimation({ isAnimating, playCount }: CubeAnimationProps) {
  return (
    <div className="w-full h-[500px] bg-white rounded-2xl relative">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 60 }}
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-white rounded-2xl">
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-black font-nohemi">🎲</div>
              <div className="text-xl text-gray-600 font-nohemi">3D Cube Loading...</div>
            </div>
          </div>
        }
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.8} />

        <AnimatedCube isAnimating={isAnimating} playCount={playCount} />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate={!isAnimating} autoRotateSpeed={2} />
      </Canvas>

      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl z-10">
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-black font-nohemi drop-shadow-2xl">Generating Your Challenge...</div>
            <div className="text-xl text-gray-600 font-nohemi drop-shadow-lg">The cube is selecting your unique combination!</div>
          </div>
        </div>
      )}
    </div>
  )
}
