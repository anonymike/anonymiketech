"use client"

import { useEffect, useRef } from "react"

export default function DigitalDataStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create vertical data streams with particles
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      color: string
    }> = []

    const createStream = (x: number) => {
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: x + Math.random() * 20,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: Math.random() * 2 + 1,
          life: 0,
          maxLife: 100 + Math.random() * 150,
          color: Math.random() > 0.7 ? "#00d9ff" : "#0099ff",
        })
      }
    }

    // Create initial streams
    for (let i = 0; i < canvas.width; i += 30) {
      createStream(i)
    }

    const draw = () => {
      // Clear with slight trail effect
      ctx.fillStyle = "rgba(10, 20, 40, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Calculate opacity based on life
        const opacity = 1 - p.life / p.maxLife
        const brightness = Math.sin((p.life / p.maxLife) * Math.PI)

        // Draw particle as small vertical line
        ctx.strokeStyle = p.color.replace(")", `, ${opacity * brightness})`).replace("rgb", "rgba")
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x, p.y + 10)
        ctx.stroke()

        // Draw glow effect
        const gradient = ctx.createLinearGradient(p.x, p.y, p.x, p.y + 20)
        gradient.addColorStop(0, p.color.replace(")", `, ${opacity * 0.5})`).replace("rgb", "rgba"))
        gradient.addColorStop(1, p.color.replace(")", `, 0)`).replace("rgb", "rgba"))

        // Remove dead particles
        if (p.life > p.maxLife) {
          particles.splice(i, 1)
        }
      }

      // Occasionally create new streams
      if (Math.random() > 0.95) {
        createStream(Math.random() * canvas.width)
      }

      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at center, rgba(0, 50, 100, 0.4) 0%, rgba(10, 20, 40, 0.8) 100%)",
      }}
    />
  )
}
