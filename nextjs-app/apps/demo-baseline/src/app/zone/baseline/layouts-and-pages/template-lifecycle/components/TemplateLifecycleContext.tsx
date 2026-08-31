'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface TemplateLifecycleState {
  currentInstanceId: string
  prevInstanceId: string | null
  reviewLength: number
  rating: number
  registerInstance: (id: string, rating: number, reviewLength: number) => void
  updateFormState: (rating: number, reviewLength: number) => void
}

const TemplateLifecycleContext = createContext<TemplateLifecycleState | null>(null)

export function TemplateLifecycleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [currentInstanceId, setCurrentInstanceId] = useState<string>('')
  const [prevInstanceId, setPrevInstanceId] = useState<string | null>(null)
  const [reviewLength, setReviewLength] = useState<number>(0)
  const [rating, setRating] = useState<number>(5)

  const registerInstance = (id: string, initialRating: number, initialReviewLength: number) => {
    setCurrentInstanceId((prev) => {
      if (prev && prev !== id) {
        setPrevInstanceId(prev)
      }
      return id
    })
    setRating(initialRating)
    setReviewLength(initialReviewLength)
  }

  const updateFormState = (newRating: number, newLength: number) => {
    setRating(newRating)
    setReviewLength(newLength)
  }

  return (
    <TemplateLifecycleContext.Provider
      value={{
        currentInstanceId,
        prevInstanceId,
        reviewLength,
        rating,
        registerInstance,
        updateFormState,
      }}
    >
      {children}
    </TemplateLifecycleContext.Provider>
  )
}

export function useTemplateLifecycle() {
  const context = useContext(TemplateLifecycleContext)
  return context
}
