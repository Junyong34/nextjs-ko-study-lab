'use client'

import React, { useState } from 'react'
import Script from 'next/script'
import { readResponseStatus, recordEvent } from '../hooks/useSdkEventLog'
import { FAIL_STATUSES, SDK_PATH } from '../types'
import type { FailStatus } from '../types'

interface Attempt {
  status: FailStatus
  n: number
  src: string
}

/**
 * 버튼을 누를 때마다 실제로 HTTP 오류로 응답하는 SDK URL을 가진 <Script>를 새로 마운트한다.
 * attempt 번호를 쿼리에 붙여 매번 다른 src가 되게 한다 — next/script는 같은 src를 한 번만 요청하므로(ScriptCache),
 * 같은 URL을 재사용하면 두 번째부터는 네트워크 요청 없이 캐시된 결과만 재사용된다.
 */
export function SdkFailureScenario() {
  const [attempts, setAttempts] = useState<Attempt[]>([])

  const start = (status: FailStatus) => {
    setAttempts((prev) => {
      const n = prev.length + 1
      return [...prev, { status, n, src: `${SDK_PATH}?fail=${status}&attempt=${n}` }]
    })
  }

  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">SDK 장애 시나리오 (onError)</div>
      <p className="text-[11px] leading-relaxed text-zinc-500">
        같은 sdk 라우트가 실제 HTTP 오류 status로 응답합니다. 브라우저 &lt;script&gt;의 error 이벤트가 onError로 전달되는지,
        onLoad/onReady는 호출되지 않는지 아래 로그에서 확인하세요.
      </p>
      <div className="flex flex-wrap gap-2">
        {FAIL_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => start(status)}
            className="rounded-md border border-rose-300 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:bg-zinc-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
          >
            HTTP {status} SDK 로드 시도
          </button>
        ))}
      </div>
      {attempts.map((a) => (
        <Script
          key={a.src}
          id={`demopay-fail-${a.n}`}
          src={a.src}
          onLoad={() => recordEvent('onLoad', `fail-${a.status}`, `시도 #${a.n}: 실패 URL인데 onLoad 호출됨`)}
          onReady={() => recordEvent('onReady', `fail-${a.status}`, `시도 #${a.n}: 실패 URL인데 onReady 호출됨`)}
          onError={(e: Event) => {
            const status = readResponseStatus(a.src)
            recordEvent(
              'onError',
              `fail-${a.status}`,
              `시도 #${a.n}: event.type=${e.type} · 실제 응답 status=${status ?? '확인 불가(브라우저 미지원)'}`,
            )
          }}
        />
      ))}
    </div>
  )
}
