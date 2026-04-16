"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface Step {
  id: string
  label: string
  skipped?: boolean
}

interface CheckoutStepperProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function CheckoutStepper({ steps, currentStep, className }: CheckoutStepperProps) {
  return (
    <nav aria-label="Checkout progress" className={cn("w-full", className)}>
      {/* Desktop stepper */}
      <ol className="hidden md:flex items-center justify-center gap-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <li key={step.id} className="flex items-center">
              <div className="flex items-center gap-3">
                {/* Step indicator */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isCompleted || isActive 
                        ? "hsl(var(--primary))" 
                        : "hsl(var(--muted))",
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      isCompleted && "bg-primary text-primary-foreground",
                      isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                      isUpcoming && "bg-muted text-muted-foreground",
                      step.skipped && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-4" />
                    ) : step.skipped ? (
                      <span className="text-xs">—</span>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </motion.div>
                </div>

                {/* Step label */}
                <span
                  className={cn(
                    "text-sm font-medium whitespace-nowrap",
                    isCompleted && "text-primary",
                    isActive && "text-foreground",
                    isUpcoming && "text-muted-foreground",
                    step.skipped && "text-muted-foreground line-through"
                  )}
                >
                  {step.label}
                  {step.skipped && (
                    <span className="ml-1 text-xs font-normal">(átugorva)</span>
                  )}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="mx-4 flex items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: index < currentStep 
                        ? "hsl(var(--primary))" 
                        : "hsl(var(--border))",
                    }}
                    className="h-0.5 w-12"
                  />
                  <span className="text-muted-foreground mx-2">→</span>
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: index < currentStep 
                        ? "hsl(var(--primary))" 
                        : "hsl(var(--border))",
                    }}
                    className="h-0.5 w-12"
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {/* Mobile stepper - collapsed view */}
      <div className="md:hidden flex items-center justify-center gap-3 py-2">
        <span className="text-sm font-medium text-foreground">
          {currentStep + 1}/{steps.length} lépés
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-sm text-muted-foreground">
          {steps[currentStep]?.label}
        </span>
      </div>
    </nav>
  )
}
