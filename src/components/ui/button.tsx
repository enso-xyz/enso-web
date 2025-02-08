import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost"
  size?: "default" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-light transition-colors",
          "focus:outline-none focus:ring-0 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-zinc-900/50 border border-white/5 text-white/80 hover:bg-zinc-900/70":
              variant === "default",
            "text-white/60 hover:text-white/80 hover:bg-white/5": variant === "ghost",
            "h-10 px-4 py-2": size === "default",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }