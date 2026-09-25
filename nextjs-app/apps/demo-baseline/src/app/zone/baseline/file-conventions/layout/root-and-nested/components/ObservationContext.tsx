'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { toRel } from '../routes'
import type { RouteObservation } from '../types'

type PageReport = Omit<RouteObservation, 'title' | 'headTitleCount' | 'via'>

interface HeadSnapshot {
  title: string
  headTitleCount: number
}

interface ObservationContextValue {
  currentRel: string
  observations: Record<string, RouteObservation>
  reportPage: (report: PageReport) => void
  reset: () => void
}

const ObservationContext = createContext<ObservationContextValue | null>(null)

/**
 * 데모 layout에 놓인 기록 장치. 각 page의 PageProbe가 DOM에서 읽은 조상 체인을 경로별로 모은다.
 * title 요소는 Metadata API가 page 교체 뒤에 따로 넣고 바꾸므로(page 마운트 시점에는 0개일 수 있다)
 * head를 MutationObserver로 지켜보며 document.title과 title 요소 개수를 읽는다.
 */
export function ObservationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentRel = toRel(pathname)

  // 첫 진입 경로를 기억해 두고, 그 경로를 벗어난 적이 있으면 이후 관측은 Link 이동으로 본다.
  const [initialPathname] = useState(pathname)
  const [hasNavigated, setHasNavigated] = useState(false)
  if (!hasNavigated && pathname !== initialPathname) setHasNavigated(true)

  const [epoch, setEpoch] = useState(0)
  const [observations, setObservations] = useState<Record<string, RouteObservation>>({})
  const [head, setHead] = useState<HeadSnapshot>({ title: '', headTitleCount: 0 })

  useEffect(() => {
    const read = () =>
      setHead({ title: document.title, headTitleCount: document.head.getElementsByTagName('title').length })
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.head, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [])

  // 현재 경로의 기록에 최신 head 값을 붙인다.
  const { title, headTitleCount } = head
  useEffect(() => {
    setObservations((prev) => {
      const obs = prev[currentRel]
      if (!obs || (obs.title === title && obs.headTitleCount === headTitleCount)) return prev
      return { ...prev, [currentRel]: { ...obs, title, headTitleCount } }
    })
  }, [currentRel, title, headTitleCount])

  const reportPage = useCallback(
    (report: PageReport) => {
      const via = hasNavigated ? 'link' : 'initial'
      setObservations((prev) => {
        const before = prev[report.rel]
        return {
          ...prev,
          [report.rel]: {
            ...report,
            title: document.title,
            headTitleCount: document.head.getElementsByTagName('title').length,
            via: before?.via === 'link' ? 'link' : via,
          },
        }
      })
    },
    // epoch가 바뀌면(초기화) 함수 정체성이 바뀌어 현재 page가 다시 보고한다.
    [hasNavigated, epoch],
  )

  const reset = useCallback(() => {
    setObservations({})
    setEpoch((e) => e + 1)
  }, [])

  const value = useMemo(
    () => ({ currentRel, observations, reportPage, reset }),
    [currentRel, observations, reportPage, reset],
  )

  return <ObservationContext.Provider value={value}>{children}</ObservationContext.Provider>
}

export function useObservation() {
  const ctx = useContext(ObservationContext)
  if (!ctx) throw new Error('useObservation must be used within ObservationProvider')
  return ctx
}
