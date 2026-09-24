'use client'

import React, { useEffect, useState } from 'react'
import { AGREED_COOKIE, BASE_PATH } from '../terms'

function readCookie(): string | null {
  const hit = document.cookie.split('; ').find((c) => c.startsWith(`${AGREED_COOKIE}=`))
  return hit ? decodeURIComponent(hit.split('=')[1]) : null
}

/**
 * 사용자별로 달라지는 "동의 여부"를 브라우저에서만 읽는 컴포넌트.
 * 서버(빌드)에서는 쿠키를 읽지 않으므로 page는 ●(SSG)로 남는다 — with-cookies/ 라우트와 대조한다.
 */
export function AgreementBadge({ version }: { version: string }) {
  const [agreed, setAgreed] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    setAgreed(readCookie())
  }, [])

  const write = (value: string | null) => {
    const maxAge = value ? 60 * 60 : 0
    document.cookie = `${AGREED_COOKIE}=${encodeURIComponent(value ?? '')}; path=${BASE_PATH}; max-age=${maxAge}; samesite=lax`
    setAgreed(readCookie())
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-dashed border-zinc-300 px-3 py-2 text-[11px] dark:border-zinc-700">
      <span className="text-zinc-600 dark:text-zinc-400">
        브라우저에서 읽은 동의 상태:{' '}
        <strong className="font-mono text-zinc-900 dark:text-zinc-100">
          {agreed === undefined ? '확인 중…' : agreed ? `v${agreed}에 동의함` : '동의 기록 없음'}
        </strong>
      </span>
      <span className="flex gap-1.5">
        <button
          type="button"
          onClick={() => write(version)}
          className="rounded bg-zinc-900 px-2 py-1 font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
        >
          v{version}에 동의
        </button>
        <button
          type="button"
          onClick={() => write(null)}
          className="rounded border border-zinc-300 px-2 py-1 text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300"
        >
          쿠키 삭제
        </button>
      </span>
    </div>
  )
}
