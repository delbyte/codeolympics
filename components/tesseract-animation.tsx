"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import gsap from "gsap"
import * as THREE from "three"

type Vec4 = [number, number, number, number]

interface TesseractAnimationProps {
  isAnimating: boolean
  playCount: number
}

interface TesseractSceneState {
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  scene: THREE.Scene
  dragGroup: THREE.Group
  shell: THREE.Group
  lineGeometry: THREE.BufferGeometry
  lineMaterial: THREE.LineBasicMaterial
  pointMeshes: THREE.Mesh[]
  pointMaterials: THREE.MeshBasicMaterial[]
  positions: Float32Array
  resizeObserver: ResizeObserver
  cleanupDrag: () => void
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

      const differences = a.reduce((count, coord, index) => count + (coord !== b[index] ? 1 : 0), 0)

      if (differences === 1) {
        edges.push([aIndex, bIndex])
      }
    })
  })

  return { vertices, edges }
}

export function TesseractAnimation({ isAnimating, playCount }: TesseractAnimationProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneStateRef = useRef<TesseractSceneState | null>(null)
  const activeVerticesRef = useRef<Set<number>>(new Set())
  const selectedVertexRef = useRef<number | null>(null)
  const isAnimatingRef = useRef(isAnimating)
  const playCountRef = useRef(playCount)
  const rotations = useRef({
    xy: 0,
    xz: 0,
    xw: 0,
    yz: 0,
    yw: 0,
    zw: 0,
  })
  const { vertices, edges } = useMemo(buildTesseract, [])
  const [activeVertices, setActiveVertices] = useState<Set<number>>(new Set())
  const [selectedVertex, setSelectedVertex] = useState<number | null>(null)

  const applyPointStyles = () => {
    const state = sceneStateRef.current
    if (!state) return

    const isNewPlayer = playCountRef.current === 0
    const active = activeVerticesRef.current
    const selected = selectedVertexRef.current

    state.pointMeshes.forEach((mesh, index) => {
      const material = state.pointMaterials[index]
      const isSelected = selected === index
      const isActive = active.has(index)
      const visible = isNewPlayer || isAnimatingRef.current || isActive || isSelected
      const color = isSelected ? "#ffffff" : dimensionColors[index % dimensionColors.length]

      material.color.set(color)
      material.opacity = visible ? 1 : 0.38
      mesh.scale.setScalar(isSelected ? 0.18 : isActive ? 0.15 : 0.1)
    })
  }

  useLayoutEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current

    if (!stage || !canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    })
    canvas.dataset.tesseractReady = "true"
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100)
    camera.position.set(0, 0, 7.2)
    camera.lookAt(0, 0, 0)

    const dragGroup = new THREE.Group()
    const shell = new THREE.Group()
    dragGroup.add(shell)
    scene.add(dragGroup)

    const positions = new Float32Array(edges.length * 2 * 3)
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#e8d48b",
      transparent: true,
      opacity: 0.78,
    })
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    shell.add(lines)

    const pointMeshes = vertices.map((_, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: dimensionColors[index % dimensionColors.length],
        transparent: true,
        opacity: 1,
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 18), material)
      mesh.scale.setScalar(0.1)
      shell.add(mesh)
      return mesh
    })
    const pointMaterials = pointMeshes.map((mesh) => mesh.material as THREE.MeshBasicMaterial)

    const resize = () => {
      const rect = stage.getBoundingClientRect()
      const width = Math.max(1, Math.floor(rect.width))
      const height = Math.max(1, Math.floor(rect.height))

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(width, height, false)
      canvas.style.width = "100%"
      canvas.style.height = "100%"
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(stage)
    resize()
    window.setTimeout(resize, 100)

    const pointer = {
      active: false,
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
    }

    const onPointerDown = (event: PointerEvent) => {
      pointer.active = true
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.rotationX = dragGroup.rotation.x
      pointer.rotationY = dragGroup.rotation.y
      stage.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!pointer.active) return

      dragGroup.rotation.y = pointer.rotationY + (event.clientX - pointer.x) * 0.006
      dragGroup.rotation.x = pointer.rotationX + (event.clientY - pointer.y) * 0.006
    }

    const onPointerUp = (event: PointerEvent) => {
      pointer.active = false
      if (stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId)
      }
    }

    stage.addEventListener("pointerdown", onPointerDown)
    stage.addEventListener("pointermove", onPointerMove)
    stage.addEventListener("pointerup", onPointerUp)
    stage.addEventListener("pointercancel", onPointerUp)

    const cleanupDrag = () => {
      stage.removeEventListener("pointerdown", onPointerDown)
      stage.removeEventListener("pointermove", onPointerMove)
      stage.removeEventListener("pointerup", onPointerUp)
      stage.removeEventListener("pointercancel", onPointerUp)
    }

    sceneStateRef.current = {
      renderer,
      camera,
      scene,
      dragGroup,
      shell,
      lineGeometry,
      lineMaterial,
      pointMeshes,
      pointMaterials,
      positions,
      resizeObserver,
      cleanupDrag,
    }

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

      gsap.to(shell.rotation, {
        y: Math.PI * 2,
        duration: 34,
        ease: "none",
        repeat: -1,
      })

      gsap.to(shell.rotation, {
        x: 0.36,
        z: -0.18,
        duration: 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })
    }, stage)

    const render = () => {
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

      const positionAttribute = lineGeometry.getAttribute("position") as THREE.BufferAttribute
      positionAttribute.needsUpdate = true

      projected.forEach((point, index) => {
        pointMeshes[index].position.copy(point)
      })

      renderer.render(scene, camera)
    }

    applyPointStyles()
    gsap.ticker.add(render)

    return () => {
      gsap.ticker.remove(render)
      context.revert()
      resizeObserver.disconnect()
      cleanupDrag()
      lineGeometry.dispose()
      lineMaterial.dispose()
      pointMeshes.forEach((mesh) => {
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
      })
      renderer.dispose()
      sceneStateRef.current = null
    }
  }, [edges, vertices])

  useEffect(() => {
    isAnimatingRef.current = isAnimating

    const state = sceneStateRef.current
    if (state) {
      gsap.to(state.shell.scale, {
        x: isAnimating ? 1.2 : 1,
        y: isAnimating ? 1.2 : 1,
        z: isAnimating ? 1.2 : 1,
        duration: 0.7,
        ease: "power3.out",
      })

      gsap.to(state.lineMaterial, {
        opacity: isAnimating ? 1 : 0.78,
        duration: 0.45,
        ease: "power2.out",
      })
    }

    applyPointStyles()
  }, [isAnimating])

  useEffect(() => {
    playCountRef.current = playCount
    applyPointStyles()
  }, [playCount])

  useEffect(() => {
    activeVerticesRef.current = activeVertices
    applyPointStyles()
  }, [activeVertices])

  useEffect(() => {
    selectedVertexRef.current = selectedVertex
    applyPointStyles()
  }, [selectedVertex])

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

  return (
    <div
      ref={stageRef}
      className="relative h-[min(62vh,560px)] min-h-[360px] w-full cursor-grab overflow-hidden rounded-lg border border-white/10 bg-surface-0/70 shadow-2xl active:cursor-grabbing"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,162,39,0.16),transparent_42%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {isAnimating && (
        <div className="pointer-events-none absolute inset-x-5 bottom-5 rounded-lg border border-gold/20 bg-surface-0/75 px-5 py-4 text-center backdrop-blur-xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">Selecting 4D coordinates</p>
          <p className="mt-1 text-sm text-fg-muted">The tesseract is collapsing into your challenge.</p>
        </div>
      )}
    </div>
  )
}
