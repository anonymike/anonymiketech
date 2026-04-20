"use client"

import { Canvas } from "@react-three/fiber"
import { Sphere, PerspectiveCamera } from "@react-three/drei"
import { useRef, useEffect } from "react"
import * as THREE from "three"

interface GlobeProps {
  rotation?: { x: number; y: number; z: number }
}

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    const canvas = document.querySelector("canvas")
    if (!canvas) return

    // Create globe texture
    const canvas2D = document.createElement("canvas")
    canvas2D.width = 2048
    canvas2D.height = 1024

    const ctx = canvas2D.getContext("2d")
    if (!ctx) return

    // Create blue gradient for Earth
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas2D.height)
    gradient.addColorStop(0, "#1e40af")
    gradient.addColorStop(0.5, "#0369a1")
    gradient.addColorStop(1, "#0c4a6e")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas2D.width, canvas2D.height)

    // Add continents (simplified landmasses)
    ctx.fillStyle = "#1e3a8a"
    // North America
    ctx.fillRect(200, 300, 300, 200)
    // South America
    ctx.fillRect(300, 500, 150, 150)
    // Europe
    ctx.fillRect(700, 200, 200, 150)
    // Africa
    ctx.fillRect(800, 400, 250, 250)
    // Asia
    ctx.fillRect(1100, 250, 600, 300)
    // Australia
    ctx.fillRect(1400, 650, 150, 100)

    // Add glow effect with lighter blue
    ctx.fillStyle = "rgba(59, 130, 246, 0.3)"
    ctx.beginPath()
    ctx.arc(1024, 512, 100, 0, Math.PI * 2)
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas2D)
    const geometry = new THREE.SphereGeometry(1, 64, 64)
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      emissive: 0x1e40af,
      emissiveIntensity: 0.2,
      shininess: 5,
    })

    if (meshRef.current) {
      meshRef.current.geometry = geometry
      meshRef.current.material = material
    }
  }, [])

  useEffect(() => {
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.0001
      }
      requestAnimationFrame(animate)
    }
    const id = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <group ref={groupRef}>
      {/* Main globe */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial color={0x0369a1} emissive={0x1e40af} emissiveIntensity={0.2} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial color={0x3b82f6} transparent opacity={0.15} />
      </mesh>

      {/* Outer glow ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI * 0.2, 0, 0]}>
        <torusGeometry args={[1.2, 0.05, 16, 100]} />
        <meshBasicMaterial color={0x60a5fa} wireframe={false} transparent opacity={0.4} />
      </mesh>

      {/* Connection network points */}
      {[
        { pos: [0.6, 0.5, 0.3], color: 0x93c5fd },
        { pos: [-0.5, 0.4, 0.6], color: 0x60a5fa },
        { pos: [0.3, -0.6, 0.4], color: 0x3b82f6 },
        { pos: [-0.7, -0.3, 0.5], color: 0x1d4ed8 },
      ].map((point, i) => (
        <mesh key={i} position={point.pos as [number, number, number]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={point.color} />
        </mesh>
      ))}

      {/* Connection lines */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0.6, 0.5, 0.3, -0.5, 0.4, 0.6])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={0x60a5fa} transparent opacity={0.5} linewidth={2} />
      </line>
    </group>
  )
}

export default function Globe3D({ rotation }: GlobeProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }} style={{ background: "transparent" }}>
        <PerspectiveCamera makeDefault position={[0, 0, 2.5]} fov={45} />
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color={0x60a5fa} />
        <pointLight position={[-10, -10, 5]} intensity={0.4} color={0x3b82f6} />
        <GlobeMesh />
      </Canvas>
    </div>
  )
}
