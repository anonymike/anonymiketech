"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

// Suppress deprecation warning for THREE.Clock (using useFrame instead)
if (typeof window !== "undefined") {
  const originalWarn = console.warn
  console.warn = function (...args: any[]) {
    if (args[0]?.includes?.("Clock") && args[0]?.includes?.("deprecated")) {
      return
    }
    originalWarn.apply(console, args)
  }
}

function Globe() {
  const globeRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.0008
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.z += 0.0004
    }
  })

  // Generate particle positions
  const particlePositions = new Float32Array(800 * 3)
  for (let i = 0; i < 800; i++) {
    const radius = 2.5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI

    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    particlePositions[i * 3 + 2] = radius * Math.cos(phi)
  }

  return (
    <group ref={globeRef}>
      {/* Wireframe globe - main */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          color="#00d4ff"
          wireframe={true}
          emissive="#0080aa"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Solid globe base */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          color="#001a33"
          emissive="#003d66"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Glow effect layer 1 - Magenta */}
      <mesh>
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshPhongMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.3}
          transparent={true}
          opacity={0.15}
        />
      </mesh>

      {/* Glow effect layer 2 - Cyan */}
      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshPhongMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.2}
          transparent={true}
          opacity={0.08}
        />
      </mesh>

      {/* Glowing particles around globe */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={800}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#ff00ff" sizeAttenuation={true} />
      </points>

      {/* Orbital ring 1 - Equatorial */}
      <line>
        <bufferGeometry>
          {(() => {
            const points = []
            for (let i = 0; i <= 64; i++) {
              const angle = (i / 64) * Math.PI * 2
              points.push(Math.cos(angle) * 2.5, 0, Math.sin(angle) * 2.5)
            }
            return (
              <bufferAttribute
                attach="attributes-position"
                count={65}
                array={new Float32Array(points)}
                itemSize={3}
              />
            )
          })()}
        </bufferGeometry>
        <lineBasicMaterial color="#00d4ff" transparent opacity={0.4} linewidth={1} />
      </line>

      {/* Orbital ring 2 - Vertical */}
      <line>
        <bufferGeometry>
          {(() => {
            const points = []
            for (let i = 0; i <= 64; i++) {
              const angle = (i / 64) * Math.PI * 2
              points.push(Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0)
            }
            return (
              <bufferAttribute
                attach="attributes-position"
                count={65}
                array={new Float32Array(points)}
                itemSize={3}
              />
            )
          })()}
        </bufferGeometry>
        <lineBasicMaterial color="#ff00ff" transparent opacity={0.3} linewidth={1} />
      </line>

      {/* Connection nodes */}
      <mesh position={[2.5, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshPhongMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshPhongMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-1.8, -1.8, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhongMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

export default function GlobeAnimation() {
  return (
    <div className="w-full h-96 md:h-full">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
        style={{
          background: "transparent",
        }}
      >
        <ambientLight intensity={0.6} color="#00d4ff" />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />

        <Globe />
      </Canvas>
    </div>
  )
}
