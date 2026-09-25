'use client'

import { useEffect, useRef, useState } from 'react'
import { probeAndRecordBoot } from '../lib/boot-id'
import type { BootProbeResult, GroupId } from '../types'

/**
 * 이 페이지가 실제로 "새 문서 로드"였는지 "소프트 내비게이션"이었는지 측정한다.
 *
 * effect 안의 기록 로직은 마운트당 정확히 한 번만 실행돼야 한다. 기록을 두 번 실행하면
 * 첫 실행이 직전 그룹을 자신의 그룹으로 덮어써 버려서, 두 번째 실행이 "이동 없음"으로
 * 잘못 관측한다. React Strict Mode(dev)는 같은 마운트에서 effect를 두 번 호출하므로,
 * hasRecordedRef로 두 번째 호출을 걸러낸다 — ref는 실제 컴포넌트 리마운트(=실제 라우트 이동)
 * 에서만 초기화되고, Strict Mode의 합성 이중 호출에서는 유지된다.
 */
export function useBootProbe(currentGroup: GroupId): BootProbeResult | null {
  const [probe, setProbe] = useState<BootProbeResult | null>(null)
  const hasRecordedRef = useRef(false)

  useEffect(() => {
    if (hasRecordedRef.current) return
    hasRecordedRef.current = true
    setProbe(probeAndRecordBoot(currentGroup))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return probe
}
