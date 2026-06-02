import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right'
}

const directionVariants = {
  up: { opacity: 0, y: 24 },
  left: { opacity: 0, x: -24 },
  right: { opacity: 0, x: 24 },
}

const directionTarget = { opacity: 1, x: 0, y: 0 }

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      initial={directionVariants[direction]}
      whileInView={directionTarget}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
