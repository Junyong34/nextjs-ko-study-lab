'use client'
import React, { createContext, useContext, useState } from 'react'

interface DrawerContextType {
  isDrawerOpen: boolean
  toggleDrawer: () => void
  toggleCount: number
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined)

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const [toggleCount, setToggleCount] = useState(0)

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev)
    setToggleCount((c) => c + 1)
  }

  return (
    <DrawerContext.Provider value={{ isDrawerOpen, toggleDrawer, toggleCount }}>
      {children}
    </DrawerContext.Provider>
  )
}

export function useDrawer() {
  const ctx = useContext(DrawerContext)
  if (!ctx) {
    throw new Error('useDrawer must be used within DrawerProvider')
  }
  return ctx
}
