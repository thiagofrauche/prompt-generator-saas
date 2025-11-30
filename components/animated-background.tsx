"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = "/amora-icon.png"
    imageRef.current = img

    let imageLoaded = false
    img.onload = () => {
      imageLoaded = true
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const logos: Array<{
      x: number
      y: number
      size: number
      speed: number
      opacity: number
      rotation: number
      rotationSpeed: number
    }> = []

    for (let i = 0; i < 50; i++) {
      logos.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 30 + 20, // Size between 20-50px
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.1 + 0.05, // Almost transparent (0.05-0.15)
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      })
    }

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (imageLoaded && imageRef.current) {
        logos.forEach((logo) => {
          // Move logo upward
          logo.y -= logo.speed
          if (logo.y < -logo.size) {
            logo.y = canvas.height + logo.size
            logo.x = Math.random() * canvas.width
          }

          // Rotate logo
          logo.rotation += logo.rotationSpeed

          // Pulse opacity slightly
          logo.opacity += Math.sin(Date.now() * 0.001 + logo.x) * 0.002
          logo.opacity = Math.max(0.05, Math.min(0.15, logo.opacity))

          // Save context state
          ctx.save()

          // Move to logo position and rotate
          ctx.translate(logo.x, logo.y)
          ctx.rotate(logo.rotation)
          ctx.globalAlpha = logo.opacity

          // Draw the logo centered
          ctx.drawImage(imageRef.current!, -logo.size / 2, -logo.size / 2, logo.size, logo.size)

          // Restore context state
          ctx.restore()
        })
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}
