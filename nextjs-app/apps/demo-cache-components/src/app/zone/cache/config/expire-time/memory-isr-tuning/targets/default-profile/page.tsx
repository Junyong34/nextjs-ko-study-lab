import React from 'react'
import type { Metadata } from 'next'
import { readDefaultProfileStamp } from '../../lib/targetStamp'
import { TargetFrame } from '../TargetFrame'

export const metadata: Metadata = { title: 'expireTime 측정 대상: default 프로필', robots: { index: false } }

// 빌드 시점에 프리렌더되는 ISR 경로. revalidate 900초, expire 미지정 → expireTime이 적용된다.
export default async function DefaultProfileTarget() {
  const stamp = await readDefaultProfileStamp()
  return <TargetFrame title="cacheLife('default') 대상 라우트" stampLabel="캐시된 생성 시각" stamp={stamp} />
}
