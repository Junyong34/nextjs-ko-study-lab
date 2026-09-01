'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { LEARNING_PROGRESS_STORAGE_KEY } from '@/lib/learning-progress/constants'
import { isLearningItemCompleted, resetProgress, toggleProgress } from '@/lib/learning-progress/state'
import { parseStoredProgress, readStoredProgress, writeStoredProgress } from '@/lib/learning-progress/storage'
import type {
  LearningInventory,
  LearningItemKind,
  LearningProgress,
  LearningStorageStatus,
} from '@/lib/learning-progress/types'

const INITIAL_TIME = '1970-01-01T00:00:00.000Z'

interface LearningProgressContextValue {
  inventory: LearningInventory
  progress: LearningProgress
  storageStatus: LearningStorageStatus
  isCompleted: (kind: LearningItemKind, key: string) => boolean
  isTrackable: (kind: LearningItemKind, key: string) => boolean
  toggle: (kind: LearningItemKind, key: string) => void
  reset: () => void
}

const LearningProgressContext = createContext<LearningProgressContextValue | null>(null)

function emptyInitialProgress(): LearningProgress {
  return {
    version: 1,
    documents: {},
    demos: {},
    updatedAt: INITIAL_TIME,
  }
}

export function LearningProgressProvider({
  inventory,
  children,
}: {
  inventory: LearningInventory
  children: React.ReactNode
}) {
  const [progress, setProgress] = useState<LearningProgress>(emptyInitialProgress)
  const [storageStatus, setStorageStatus] = useState<LearningStorageStatus>('empty')

  useEffect(() => {
    const now = new Date().toISOString()
    try {
      const result = readStoredProgress(window.localStorage, now)
      setProgress(result.progress)
      setStorageStatus(result.status)
    } catch {
      setStorageStatus('unavailable')
    }
  }, [])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== LEARNING_PROGRESS_STORAGE_KEY) return
      const result = parseStoredProgress(event.newValue, new Date().toISOString())
      setProgress(result.progress)
      setStorageStatus(result.status)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const persist = useCallback((next: LearningProgress) => {
    try {
      const saved = writeStoredProgress(window.localStorage, next)
      setStorageStatus(saved ? 'ok' : 'unavailable')
    } catch {
      setStorageStatus('unavailable')
    }
  }, [])

  const toggle = useCallback(
    (kind: LearningItemKind, key: string) => {
      const wasCompleted = isLearningItemCompleted(progress, kind, key)
      const next = toggleProgress(progress, kind, key, new Date().toISOString())
      setProgress(next)
      persist(next)
      trackEvent({
        name: 'learning_progress_toggle',
        params: { kind, item_key: key, completed: !wasCompleted },
      })
    },
    [persist, progress],
  )

  const reset = useCallback(() => {
    const next = resetProgress(progress, new Date().toISOString())
    setProgress(next)
    persist(next)
  }, [persist, progress])

  const isTrackable = useCallback(
    (kind: LearningItemKind, key: string) => {
      const items = kind === 'document' ? inventory.documents : inventory.demos
      return items.some((item) => item.key === key)
    },
    [inventory],
  )

  const isCompleted = useCallback(
    (kind: LearningItemKind, key: string) => isLearningItemCompleted(progress, kind, key),
    [progress],
  )

  return (
    <LearningProgressContext.Provider
      value={{ inventory, progress, storageStatus, isCompleted, isTrackable, toggle, reset }}
    >
      {children}
    </LearningProgressContext.Provider>
  )
}

export function useLearningProgress(): LearningProgressContextValue {
  const value = useContext(LearningProgressContext)
  if (!value) throw new Error('LearningProgressProvider 안에서 사용해야 합니다.')
  return value
}
