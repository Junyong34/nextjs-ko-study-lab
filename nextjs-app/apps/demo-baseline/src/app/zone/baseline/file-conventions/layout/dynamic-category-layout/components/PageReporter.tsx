'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useObservation } from './ObservationContext'

/** 하위 page.tsx가 서버에서 실제로 받은 params·searchParams를 기록 장치에 보고한다. */
export function PageReporter({ paramsJson, searchParamsJson }: { paramsJson: string; searchParamsJson: string }) {
  const pathname = usePathname()
  const { reportPage } = useObservation()

  useEffect(() => {
    reportPage({ pathname, paramsJson, searchParamsJson })
  }, [pathname, paramsJson, searchParamsJson, reportPage])

  return null
}
