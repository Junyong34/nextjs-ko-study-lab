'use client'

import { useEffect, useState } from 'react'

/** 브라우저가 308을 따라간 뒤 실제로 머문 주소를 읽는다. 서버 렌더링 시점에는 알 수 없어 마운트 후 읽는다. */
export function CurrentAddress() {
  const [address, setAddress] = useState<string | null>(null)
  useEffect(() => setAddress(window.location.pathname + window.location.search), [])

  return (
    <p className="text-xs">
      브라우저의 현재 주소:{' '}
      <code className="break-all rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">{address ?? '읽는 중'}</code>
      {address && (
        <strong className="ml-2">{address.split('?')[0].endsWith('/') ? '끝 슬래시 있음' : '끝 슬래시 없음'}</strong>
      )}
    </p>
  )
}
