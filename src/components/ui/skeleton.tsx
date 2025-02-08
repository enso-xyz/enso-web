import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 1.2, repeat: Infinity }}
      className={cn(
        "rounded-md bg-white/5",
        className
      )}
    />
  )
}
