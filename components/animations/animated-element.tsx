"use client"

import type React from "react"
import { motion, type Variants } from "framer-motion"

interface AnimatedElementProps {
  children: React.ReactNode
  variants: Variants
  className?: string
  once?: boolean
  amount?: number
  as?: keyof React.JSX.IntrinsicElements
}

export function AnimatedElement({
  children,
  variants,
  className,
  once = true,
  amount = 0.3,
  as = "div",
}: AnimatedElementProps) {
  const MotionComponent = motion[as]

  return (
    <MotionComponent
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </MotionComponent>
  )
}
