'use client'

import { createContext, useContext } from 'react'
import type { StyleRegistry } from '../lib/registry'

export const RegistryContext = createContext<StyleRegistry | null>(null)

export function useStyleRegistry(): StyleRegistry {
  const registry = useContext(RegistryContext)
  if (!registry) throw new Error('useStyleRegistry는 RegistryProvider/PlainProvider 안에서만 사용할 수 있습니다.')
  return registry
}
