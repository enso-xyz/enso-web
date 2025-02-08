import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-white/[0.02] bg-white/[0.01] text-white/90 backdrop-blur-[2px]",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export { Card } 