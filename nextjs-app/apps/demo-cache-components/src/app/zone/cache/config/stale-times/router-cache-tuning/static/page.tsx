import React from 'react'
import { StampCard } from '../components/StampCard'
import { getStaticStamp } from '../lib/stamps'

/** 측정 대상 정적 page. 'use cache' 값만 쓰므로 Suspense 없이 await해도 정적 셸에 들어간다. */
export default async function StaleTimesStaticPage() {
  const stamp = await getStaticStamp()
  return <StampCard route="static" stamp={stamp} />
}
