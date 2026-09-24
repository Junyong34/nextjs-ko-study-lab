'use client'

import { useEffect } from 'react'
import { SNAPSHOT_MESSAGE } from '../paths'
import type { ProductSnapshot, SnapshotMessage } from '../types'

/** 상품 페이지가 iframe 안에서 열렸을 때, 서버가 렌더한 값을 그대로 부모(허브)에 전달한다. */
export function SnapshotReporter({ snapshot }: { snapshot: ProductSnapshot }) {
  useEffect(() => {
    if (window.parent === window) return
    const message: SnapshotMessage = { type: SNAPSHOT_MESSAGE, ...snapshot }
    window.parent.postMessage(message, window.location.origin)
  }, [snapshot])

  return null
}
