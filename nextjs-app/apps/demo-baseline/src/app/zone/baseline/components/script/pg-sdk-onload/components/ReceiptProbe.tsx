'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { recordEvent, useSdkEventLog } from '../hooks/useSdkEventLog'
import { DEMO_BASE_PATH, MAIN_SDK_ID, SDK_HOST_ATTR } from '../types'
import { CallbackTimeline } from './CallbackTimeline'

/** 하위 라우트 진입 시점에 SDK 호스트가 DOM에서 사라졌는지와 <script> 태그 잔존 여부를 실측한다. */
export function ReceiptProbe() {
  const events = useSdkEventLog()
  const recorded = useRef(false)

  useEffect(() => {
    if (recorded.current) return
    recorded.current = true
    const hostInDom = document.querySelector(`[${SDK_HOST_ATTR}]`) !== null
    const scriptTags = document.querySelectorAll(`script#${MAIN_SDK_ID}`).length
    recordEvent('away', 'main', `SDK 호스트 DOM 존재=${hostInDom} · <script id="${MAIN_SDK_ID}"> 태그 ${scriptTags}개 남아 있음`)
  }, [])

  return (
    <div className="space-y-4 text-sm">
      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
        결제 페이지의 SDK 컴포넌트가 언마운트된 상태입니다. <code>window.DemoPay</code>와 next/script 캐시는 모듈·전역 스코프라서
        그대로 남아 있습니다. 돌아가면 컴포넌트가 새로 마운트되며 onReady만 다시 호출됩니다.
      </p>
      <Link
        href={DEMO_BASE_PATH}
        className="inline-block rounded-md bg-zinc-900 px-3 py-2 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
      >
        결제 페이지로 돌아가기 (Link)
      </Link>
      <CallbackTimeline events={events} />
    </div>
  )
}
