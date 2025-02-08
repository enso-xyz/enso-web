"use client"

import { useEffect, useRef } from "react"

export function useGlowEffect() {
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const overlay = overlayRef.current

    if (!container || !overlay) return

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      requestAnimationFrame(() => {
        overlay.style.setProperty("--glow-x", `${x}px`)
        overlay.style.setProperty("--glow-y", `${y}px`)
        overlay.style.setProperty("--glow-opacity", "1")
      })
    }

    const handleMouseLeave = () => {
      requestAnimationFrame(() => {
        overlay.style.setProperty("--glow-opacity", "0")
      })
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return { containerRef, overlayRef }
} 