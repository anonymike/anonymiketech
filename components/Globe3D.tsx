"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import { useRef, useEffect, useMemo } from "react"
import * as THREE from "three"

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (!meshRef.current) return

    // Create a detailed Earth texture
    const canvas = document.createElement("canvas")
    canvas.width = 2048
    canvas.height = 1024

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ocean base color
    ctx.fillStyle = "#0369a1"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Create gradient for depth
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#0ea5e9")
    gradient.addColorStop(0.5, "#0284c7")
    gradient.addColorStop(1, "#0369a1")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Continents with more detail
    ctx.fillStyle = "#0f766e"
    
    // North America
    ctx.beginPath()
    ctx.ellipse(250, 280, 120, 140, 0.2, 0, Math.PI * 2)
    ctx.fill()

    // South America
    ctx.beginPath()
    ctx.ellipse(300, 520, 70, 100, 0.1, 0, Math.PI * 2)
    ctx.fill()

    // Europe
    ctx.beginPath()
    ctx.ellipse(750, 200, 100, 80, 0, 0, Math.PI * 2)
    ctx.fill()

    // Africa
    ctx.beginPath()
    ctx.ellipse(850, 450, 120, 140, 0.1, 0, Math.PI * 2)
    ctx.fill()

    // Asia
    ctx.beginPath()
    ctx.ellipse(1200, 300, 300, 200, 0, 0, Math.PI * 2)
    ctx.fill()

    // Australia
    ctx.beginPath()
    ctx.ellipse(1450, 680, 80, 70, 0, 0, Math.PI * 2)
    ctx.fill()

    // Add lighter highlights for mountains
    ctx.fillStyle = "rgba(45, 212, 191, 0.4)"
    ctx.beginPath()
    ctx.ellipse(250, 280, 40, 50, 0.2, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.ellipse(1200, 250, 100, 80, 0, 0, Math.PI * 2)
    ctx.fill()

    // Add atmospheric glow
    const glowGradient = ctx.createRadialGradient(1024, 512, 0, 1024, 512, 700)
    glowGradient.addColorStop(0, "rgba(34, 211, 238, 0.2)")
    glowGradient.addColorStop(1, "rgba(34, 211, 238, 0)")

    ctx.fillStyle = glowGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Create texture
    const texture = new THREE.CanvasTexture(canvas)
    texture.anisotropy = 16

    if (meshRef.current) {
      meshRef.current.material.map = texture
      meshRef.current.material.needsUpdate = true
    }
  }, [])

  return (
    <Sphere ref={meshRef} args={[1.5, 128, 128]}>
      <meshPhongMaterial
        color="#ffffff"
        emissive="#1e3a8a"
        emissiveIntensity={0.2}
        shininess={5}
      />
    </Sphere>
  )
}

function GlobeScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-10, -10, 5]} intensity={0.5} color="#0ea5e9" />

      {/* Globe */}
      <GlobeMesh />

      {/* Camera controls */}
      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={2}
        enablePan={false}
        enableRotate={true}
        rotateSpeed={0.5}
      />
    </>
  )
}

export default function Globe3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 50 }}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
      }}
    >
      <GlobeScene />
    </Canvas>
  )
}
