import React from 'react'
import type { Metadata } from 'next'
import { readHoursProfileStamp } from '../../lib/targetStamp'
import { TargetFrame } from '../TargetFrame'

export const metadata: Metadata = { title: 'expireTime 측정 대상: hours 프로필', robots: { index: false } }

// 빌드 시점에 프리렌더되는 ISR 경로. revalidate 3600초, expire 86400초 → expireTime이 적용되지 않는다.
export default async function HoursProfileTarget() {
  const stamp = await readHoursProfileStamp()
  return <TargetFrame title="cacheLife('hours') 대상 라우트" stampLabel="캐시된 생성 시각" stamp={stamp} />
}
