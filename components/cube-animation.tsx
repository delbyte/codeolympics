"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import type * as THREE from "three"

interface CubeProps {
  position: [number, number, number]
  isHighlighted: boolean
}

function CubeCell({ position, isHighlighted }: CubeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.15
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2) * 0.1
    }
  })

  // Brighter, more saturated colors
  const colors = ["#ff4444", "#00ff88", "#4488ff", "#ffaa00", "#ff66cc", "#66ffcc", "#8844ff", "#ff8844"]
  const color = colors[Math.floor(Math.random() * colors.length)]

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial
        color={isHighlighted ? "#ffffff" : color}
        emissive={isHighlighted ? color : "#000000"}
        emissiveIntensity={isHighlighted ? 1.2 : 0.3}
        metalness={0.2}
        roughness={0.1}
      />
    </mesh>
  )
}

function AnimatedCube({ isAnimating }: { isAnimating: boolean }) {
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set())
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  useEffect(() => {
    if (isAnimating) {
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
    } else {
      setHighlightedCells(new Set())
    }
  }, [isAnimating])

  const cubes = []
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        const position: [number, number, number] = [(x - 1) * 1.8, (y - 1) * 1.8, (z - 1) * 1.8]
        const key = `${x}-${y}-${z}`
        const isHighlighted = highlightedCells.has(key)

        cubes.push(<CubeCell key={key} position={position} isHighlighted={isHighlighted} />)
      }
    }
  }

  return <group ref={groupRef}>{cubes}</group>
}

interface CubeAnimationProps {
  isAnimating: boolean
}

export function CubeAnimation({ isAnimating }: CubeAnimationProps) {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl relative border border-white/10 shadow-2xl">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 60 }}
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl border border-white/10">
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-white font-nohemi">🎲</div>
              <div className="text-xl text-gray-200 font-nohemi">3D Cube Loading...</div>
            </div>
          </div>
        }
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <AnimatedCube isAnimating={isAnimating} />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate={!isAnimating} autoRotateSpeed={2} />
      </Canvas>

      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl z-10 border border-white/10">
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-white font-nohemi drop-shadow-2xl">Generating Your Challenge...</div>
            <div className="text-xl text-gray-200 font-nohemi drop-shadow-lg">The cube is selecting your unique combination!</div>
          </div>
        </div>
      )}
    </div>
  )
}
