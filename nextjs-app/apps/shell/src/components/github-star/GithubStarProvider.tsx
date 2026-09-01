'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  ENGAGEMENT_SAVE_INTERVAL_MS,
  ENGAGEMENT_TICK_INTERVAL_MS,
  GITHUB_STAR_CONFIG,
  GITHUB_STAR_SESSION_KEY,
} from '@/lib/github-star/constants'
import {
  addActiveDuration,
  incrementVisitCount,
  isEligibleForStarPrompt,
  recordDismiss,
  recordDismissForever,
  recordPromptShown,
  recordStarClickThrough,
} from '@/lib/github-star/engagement'
import {
  readStoredStarRecord,
  writeStoredStarRecord,
} from '@/lib/github-star/storage'
import type {
  GithubStarConfig,
  StarEngagementRecord,
} from '@/lib/github-star/types'

interface GithubStarContextValue {
  config: GithubStarConfig
  isPromptVisible: boolean
  dismiss: () => void
  dismissForever: () => void
  clickThrough: () => void
}

const GithubStarContext = createContext<GithubStarContextValue | null>(null)

export function GithubStarProvider({
  config = GITHUB_STAR_CONFIG,
  children,
}: {
  config?: GithubStarConfig
  children: React.ReactNode
}) {
  const [record, setRecord] = useState<StarEngagementRecord | null>(null)
  const [isPromptVisible, setIsPromptVisible] = useState(false)

  const recordRef = useRef<StarEngagementRecord | null>(null)
  recordRef.current = record

  const lastTickTimeRef = useRef<number>(0)
  const isWindowActiveRef = useRef<boolean>(true)

  // 1. 초기 마운트 시 스토리지 로드 및 새 세션 방문 카운트
  useEffect(() => {
    const now = new Date().toISOString()
    let current = readStoredStarRecord(window.localStorage, now).record

    try {
      if (!window.sessionStorage.getItem(GITHUB_STAR_SESSION_KEY)) {
        window.sessionStorage.setItem(GITHUB_STAR_SESSION_KEY, '1')
        current = incrementVisitCount(current, now)
        writeStoredStarRecord(window.localStorage, current)
      }
    } catch {
      // sessionStorage 제한 환경에서 안전 무시
    }

    recordRef.current = current
    setRecord(current)

    if (isEligibleForStarPrompt(current, config, now)) {
      setIsPromptVisible(true)
      const updated = recordPromptShown(current, now)
      recordRef.current = updated
      setRecord(updated)
      writeStoredStarRecord(window.localStorage, updated)
    }

    lastTickTimeRef.current = Date.now()
    isWindowActiveRef.current =
      document.visibilityState === 'visible' && document.hasFocus()
  }, [config])

  // 2. 활성 시간 추적 및 배치 저장
  useEffect(() => {
    if (!record || record.dismissedForever || record.clickedThroughAt !== null) {
      return
    }

    const flushRecord = () => {
      if (recordRef.current) {
        writeStoredStarRecord(window.localStorage, recordRef.current)
      }
    }

    const handleVisibilityOrFocus = () => {
      const isActive =
        document.visibilityState === 'visible' && document.hasFocus()
      isWindowActiveRef.current = isActive
      lastTickTimeRef.current = Date.now()

      if (!isActive) {
        flushRecord()
      }
    }

    window.addEventListener('visibilitychange', handleVisibilityOrFocus)
    window.addEventListener('focus', handleVisibilityOrFocus)
    window.addEventListener('blur', handleVisibilityOrFocus)

    const tickTimer = window.setInterval(() => {
      if (!isWindowActiveRef.current || !recordRef.current) return

      const nowMs = Date.now()
      const diffMs = nowMs - lastTickTimeRef.current
      lastTickTimeRef.current = nowMs

      // 최대 2배 주기까지만 합리적인 틱으로 누적 (시스템 절전/지연 방어)
      if (diffMs > 0 && diffMs <= ENGAGEMENT_TICK_INTERVAL_MS * 2) {
        const nowIso = new Date().toISOString()
        const next = addActiveDuration(recordRef.current, diffMs, nowIso)
        recordRef.current = next
        setRecord(next)

        if (!isPromptVisible && isEligibleForStarPrompt(next, config, nowIso)) {
          setIsPromptVisible(true)
          const updated = recordPromptShown(next, nowIso)
          recordRef.current = updated
          setRecord(updated)
          writeStoredStarRecord(window.localStorage, updated)
        }
      }
    }, ENGAGEMENT_TICK_INTERVAL_MS)

    const saveTimer = window.setInterval(flushRecord, ENGAGEMENT_SAVE_INTERVAL_MS)

    return () => {
      window.clearInterval(tickTimer)
      window.clearInterval(saveTimer)
      window.removeEventListener('visibilitychange', handleVisibilityOrFocus)
      window.removeEventListener('focus', handleVisibilityOrFocus)
      window.removeEventListener('blur', handleVisibilityOrFocus)
      flushRecord()
    }
  }, [
    record?.dismissedForever,
    record?.clickedThroughAt,
    isPromptVisible,
    config,
    record !== null,
  ])

  // 3. 액션 핸들러
  const dismiss = useCallback(() => {
    setIsPromptVisible(false)
    if (!recordRef.current) return
    const next = recordDismiss(recordRef.current, new Date().toISOString())
    recordRef.current = next
    setRecord(next)
    writeStoredStarRecord(window.localStorage, next)
  }, [])

  const dismissForever = useCallback(() => {
    setIsPromptVisible(false)
    if (!recordRef.current) return
    const next = recordDismissForever(recordRef.current, new Date().toISOString())
    recordRef.current = next
    setRecord(next)
    writeStoredStarRecord(window.localStorage, next)
  }, [])

  const clickThrough = useCallback(() => {
    setIsPromptVisible(false)
    if (!recordRef.current) return
    const next = recordStarClickThrough(
      recordRef.current,
      new Date().toISOString(),
    )
    recordRef.current = next
    setRecord(next)
    writeStoredStarRecord(window.localStorage, next)
  }, [])

  return (
    <GithubStarContext.Provider
      value={{
        config,
        isPromptVisible,
        dismiss,
        dismissForever,
        clickThrough,
      }}
    >
      {children}
    </GithubStarContext.Provider>
  )
}

export function useGithubStar(): GithubStarContextValue {
  const context = useContext(GithubStarContext)
  if (!context) {
    throw new Error('useGithubStar must be used within a GithubStarProvider')
  }
  return context
}
