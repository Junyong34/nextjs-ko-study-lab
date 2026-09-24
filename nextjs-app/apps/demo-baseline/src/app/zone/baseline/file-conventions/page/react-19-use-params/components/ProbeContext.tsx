'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readBrowserUrl } from '../inspect'
import type { ObservedProbe, ProbeKind, ProbeReport } from '../types'

type Observed = Partial<Record<ProbeKind, ObservedProbe>>

interface ProbeContextValue {
  observed: Observed
  report: (report: ProbeReport) => void
  clear: () => void
}

const ProbeContext = createContext<ProbeContextValue | null>(null)

/**
 * layout.tsx에 한 번 배치되어 예제 페이지들이 실제로 관측한 언래핑 결과를 모은다.
 * layout은 페이지 이동 시 리마운트되지 않으므로 server/client 페이지를 오가며 쌓인 관측 기록이 유지된다.
 */
export function ProbeProvider({ children }: { children: React.ReactNode }) {
  const [observed, setObserved] = useState<Observed>({})

  const report = useCallback((next: ProbeReport) => {
    // 관측 시점의 실제 브라우저 URL을 함께 기록해 두고, 검증 패널이 언래핑 값과 대조한다.
    const url = readBrowserUrl()
    setObserved((prev) => ({ ...prev, [next.kind]: { report: next, url } }))
  }, [])
  const clear = useCallback(() => setObserved({}), [])

  const value = useMemo(() => ({ observed, report, clear }), [observed, report, clear])
  return <ProbeContext.Provider value={value}>{children}</ProbeContext.Provider>
}

export function useProbes(): ProbeContextValue {
  const ctx = useContext(ProbeContext)
  if (!ctx) throw new Error('useProbes()는 <ProbeProvider> 안에서만 호출할 수 있습니다.')
  return ctx
}

/** 서버 페이지가 계산한 리포트를 브라우저 마운트 시점에 검증 패널로 전달한다. 화면에는 아무것도 그리지 않는다. */
export function ProbeReporter({ report }: { report: ProbeReport }) {
  const { report: send } = useProbes()
  useEffect(() => {
    send(report)
  }, [report, send])
  return null
}
