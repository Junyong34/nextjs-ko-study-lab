'use client'

import { createContext, useContext } from 'react'
import type { StyleRuleRegistry } from './Registry'

export const StyleRegistryReactContext = createContext<StyleRuleRegistry | null>(null)

export function useStyleRegistry(): StyleRuleRegistry {
  const registry = useContext(StyleRegistryReactContext)
  if (!registry) {
    throw new Error('useStyleRegistry는 HookEnabledProvider/HookDisabledProvider 내부에서만 사용할 수 있습니다.')
  }
  return registry
}
