import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

export const Progress = ({
  value, 
  className,
  glowColor = 'rgba(255,255,255,0.2)'
}: {
  value: number
  className?: string
  glowColor?: string
}) => (
  <ProgressPrimitive.Root
    className={cn(
      "relative h-1 w-full overflow-hidden rounded-full bg-white/5",
      className
    )}
    style={{
      boxShadow: `0 0 8px ${glowColor}`
    }}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full bg-gradient-to-r from-[var(--blue-primary)] to-[var(--purple-primary)] transition-all duration-300"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
)
