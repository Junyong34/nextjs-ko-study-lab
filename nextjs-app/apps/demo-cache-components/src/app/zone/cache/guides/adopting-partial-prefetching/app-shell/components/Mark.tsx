'use client'

import { useEffect } from 'react'
import type { Area } from '../types'
import { useProbe } from './ProbeContext'

/** 이 영역이 화면에 마운트된 순간을 기록한다. 클릭 기록이 없으면(직접 진입 등) 아무것도 하지 않는다. */
export function Mark({ area }: { area: Area }) {
  const { markArrival } = useProbe()
  useEffect(() => {
    markArrival(area)
  }, [area, markArrival])
  return null
}
