"use client"

import { useRef, useEffect } from "react"
import { useSpring, animated, to } from "@react-spring/web"
import { cn } from "@/lib/utils"

const calcX = (y: number, ly: number, containerCenterY: number, rotationFactor: number) =>
  -(y - ly - containerCenterY) / rotationFactor

const calcY = (x: number, lx: number, containerCenterX: number, rotationFactor: number) =>
  (x - lx - containerCenterX) / rotationFactor

interface FollowCursorProps {
  children: React.ReactNode
  className?: string
  animationConfig?: { mass: number; tension: number; friction: number }
  hoverScale?: number
  offsetX?: number
  cardWidth?: string
  rotationFactor?: number
  perspective?: string
  enableTilt?: boolean
}

export function FollowCursor({
  children,
  className,
  animationConfig = { mass: 5, tension: 350, friction: 40 },
  hoverScale = 1.1,
  offsetX = 0,
  cardWidth = "200px",
  rotationFactor = 20,
  perspective = "300px",
  enableTilt = true
}: FollowCursorProps) {
  const domTarget = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [{ x, y, rotateX, rotateY, scale }, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    x: 0,
    y: 0,
    config: animationConfig,
  }))

  useEffect(() => {
    if (enableTilt) {
      const handleMouseMove = (event: MouseEvent) => {
        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        const containerCenterX = rect.left + rect.width / 2
        const containerCenterY = rect.top + rect.height / 2

        const px = event.clientX
        const py = event.clientY

        const xPos = px - containerCenterX
        const yPos = py - containerCenterY

        api.start({
          x: xPos,
          y: yPos,
          rotateX: calcX(py, y.get(), containerCenterY, rotationFactor),
          rotateY: calcY(px, x.get(), containerCenterX, rotationFactor),
          scale: hoverScale,
        })
      }

      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [api, y, x, cardWidth, offsetX, hoverScale, enableTilt, rotationFactor])

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <animated.div
        ref={domTarget}
        style={{
          transform: to(
            [x, y, rotateX, rotateY, scale],
            (x, y, rx, ry, s) => `
              perspective(${perspective})
              translate3d(${x}px,${y}px,0)
              rotateX(${rx}deg)
              rotateY(${ry}deg)
              scale(${s})
            `
          ),
        }}
      >
        {children}
      </animated.div>
    </div>
  )
} 