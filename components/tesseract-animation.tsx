"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import gsap from "gsap"
import * as THREE from "three"

type Vec4 = [number, number, number, number]

interface TesseractAnimationProps {
  isAnimating: boolean
  playCount: number
}

const dimensionColors = ["#0081c8", "#fcb131", "#00a651", "#ee334e"]

function rotatePlane(a: number, b: number, angle: number) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  return [a * cos - b * sin, a * sin + b * cos]
}

function rotate4D(vertex: Vec4, angles: Record<string, number>): Vec4 {
  let [x, y, z, w] = vertex

  ;[x, y] = rotatePlane(x, y, angles.xy)
  ;[x, z] = rotatePlane(x, z, angles.xz)
  ;[x, w] = rotatePlane(x, w, angles.xw)
  ;[y, z] = rotatePlane(y, z, angles.yz)
  ;[y, w] = rotatePlane(y, w, angles.yw)
  ;[z, w] = rotatePlane(z, w, angles.zw)

  return [x, y, z, w]
}

function project4D(vertex: Vec4) {
  const [x, y, z, w] = vertex
  const perspective = 3.6
  const scale = perspective / (perspective - w * 0.72)

  return new THREE.Vector3(x * scale * 1.35, y * scale * 1.35, z * scale * 1.35)
}

function buildTesseract() {
  const vertices: Vec4[] = []

  for (const x of [-1, 1]) {
    for (const y of [-1, 1]) {
      for (const z of [-1, 1]) {
        for (const w of [-1, 1]) {
          vertices.push([x, y, z, w])
        }
      }
    }
  }

  const edges: Array<[number, number]> = []

  vertices.forEach((a, aIndex) => {
    vertices.forEach((b, bIndex) => {
      if (bIndex <= aIndex) return

      const differences = a.reduce((count, coord, index) => {
        return count + (coord !== b[index] ? 1 : 0)
      }, 0)

      if (differences === 1) {
        edges.push([aIndex, bIndex])
      }
    })
  })

  return { vertices, edges }
}

function AnimatedTesseract({ isAnimating, playCount }: TesseractAnimationProps) {
  const groupRef = useRef<THREE.Group>(null)
  const shellRef = useRef<THREE.Group>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null)
  const vertexRefs = useRef<Array<THREE.Mesh | null>>([])
  const rotations = useRef({
    xy: 0,
    xz: 0,
    xw: 0,
    yz: 0,
    yw: 0,
    zw: 0,
  })
  const { vertices, edges } = useMemo(buildTesseract, [])
  const positions = useMemo(() => new Float32Array(edges.length * 2 * 3), [edges.length])
  const [activeVertices, setActiveVertices] = useState<Set<number>>(new Set())
  const [selectedVertex, setSelectedVertex] = useState<number | null>(null)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.to(rotations.current, {
        xy: Math.PI * 2,
        xz: Math.PI * 1.5,
        yz: Math.PI * 1.25,
        duration: 24,
        ease: "none",
        repeat: -1,
      })

      gsap.to(rotations.current, {
        xw: Math.PI * 2,
        yw: Math.PI * 2,
        zw: Math.PI * 2,
        duration: 14,
        ease: "none",
        repeat: -1,
      })

      if (groupRef.current) {
        gsap.to(groupRef.current.rotation, {
          y: Math.PI * 2,
          duration: 34,
          ease: "none",
          repeat: -1,
        })

        gsap.to(groupRef.current.rotation, {
          x: 0.36,
          z: -0.18,
          duration: 5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      }
    }, groupRef)

    return () => context.revert()
  }, [])

  useEffect(() => {
    if (!shellRef.current) return

    gsap.to(shellRef.current.scale, {
      x: isAnimating ? 1.2 : 1,
      y: isAnimating ? 1.2 : 1,
      z: isAnimating ? 1.2 : 1,
      duration: 0.7,
      ease: "power3.out",
    })

    if (lineMaterialRef.current) {
      gsap.to(lineMaterialRef.current, {
        opacity: isAnimating ? 1 : 0.78,
        duration: 0.45,
        ease: "power2.out",
      })
    }
  }, [isAnimating])

  useEffect(() => {
    if (isAnimating) {
      setSelectedVertex(null)

      const interval = window.setInterval(() => {
        const next = new Set<number>()

        while (next.size < 5) {
          next.add(Math.floor(Math.random() * vertices.length))
        }

        setActiveVertices(next)
      }, 180)

      return () => window.clearInterval(interval)
    }

    setActiveVertices(new Set())
    setSelectedVertex(playCount === 0 ? null : Math.floor(Math.random() * vertices.length))
  }, [isAnimating, playCount, vertices.length])

  useFrame(() => {
    const projected = vertices.map((vertex) => project4D(rotate4D(vertex, rotations.current)))

    edges.forEach(([start, end], edgeIndex) => {
      const startPoint = projected[start]
      const endPoint = projected[end]
      const offset = edgeIndex * 6

      positions[offset] = startPoint.x
      positions[offset + 1] = startPoint.y
      positions[offset + 2] = startPoint.z
      positions[offset + 3] = endPoint.x
      positions[offset + 4] = endPoint.y
      positions[offset + 5] = endPoint.z
    })

    const positionAttribute = geometryRef.current?.getAttribute("position") as THREE.BufferAttribute | undefined

    if (positionAttribute) {
      positionAttribute.needsUpdate = true
    }

    projected.forEach((point, index) => {
      const vertex = vertexRefs.current[index]

      if (vertex) {
        vertex.position.copy(point)
      }
    })
  })

  return (
    <group ref={groupRef}>
      <group ref={shellRef}>
        <lineSegments>
          <bufferGeometry ref={geometryRef}>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            ref={lineMaterialRef}
            color="#e8d48b"
            transparent
            opacity={0.78}
            linewidth={2}
          />
        </lineSegments>

        {vertices.map((vertex, index) => {
          const isSelected = selectedVertex === index
          const isActive = activeVertices.has(index)
          const isNewPlayer = playCount === 0
          const color = isSelected ? "#ffffff" : dimensionColors[index % dimensionColors.length]
          const opacity = isNewPlayer || isAnimating || isActive || isSelected ? 1 : 0.38

          return (
            <mesh
              key={vertex.join(":")}
              ref={(mesh) => {
                vertexRefs.current[index] = mesh
              }}
              scale={isSelected ? 0.18 : isActive ? 0.15 : 0.1}
            >
              <sphereGeometry args={[1, 18, 18]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isSelected || isActive ? 1.65 : 0.72}
                transparent
                opacity={opacity}
                metalness={0.15}
                roughness={0.18}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

export function TesseractAnimation({ isAnimating, playCount }: TesseractAnimationProps) {
  return (
    <div className="relative h-[min(62vh,560px)] min-h-[360px] w-full overflow-hidden rounded-lg border border-white/10 bg-surface-0/70 shadow-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,162,39,0.16),transparent_42%)]" />

      <Canvas camera={{ position: [5.5, 4.8, 6.8], fov: 48 }} dpr={[1, 2]}>
        <ambientLight intensity={0.58} />
        <pointLight position={[6, 8, 8]} intensity={1.8} color="#e8d48b" />
        <pointLight position={[-7, -4, -6]} intensity={0.95} color="#3b6bf5" />
        <AnimatedTesseract isAnimating={isAnimating} playCount={playCount} />
        <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.55} />
      </Canvas>

      {isAnimating && (
        <div className="pointer-events-none absolute inset-x-5 bottom-5 rounded-lg border border-gold/20 bg-surface-0/75 px-5 py-4 text-center backdrop-blur-xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">Selecting 4D coordinates</p>
          <p className="mt-1 text-sm text-fg-muted">The tesseract is collapsing into your challenge.</p>
        </div>
      )}
    </div>
  )
}
