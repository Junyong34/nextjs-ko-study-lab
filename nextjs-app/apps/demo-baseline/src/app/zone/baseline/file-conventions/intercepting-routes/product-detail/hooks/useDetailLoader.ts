'use client'

import { useEffect, useState } from 'react'
import { fetchProductDetail } from '../actions'
import type { ProductDetail } from '../types'

export interface DetailLoaderState {
  detail: ProductDetail | null
  /** 요약이 화면에 처음 그려진 시각(performance.now). 요약이 없으면 상세가 도착한 시각과 같다. */
  summaryAt: number | null
  /** 상세가 도착해 본문이 그려진 시각(performance.now) */
  detailAt: number | null
  failed: boolean
}

const INITIAL: DetailLoaderState = { detail: null, summaryAt: null, detailAt: null, failed: false }

/**
 * 모달이 열리면 상세만 Server Action으로 받아온다. 요약(seed)이 있으면 그 시각을 summaryAt으로
 * 기록해, 검증 패널이 "요약 → 상세" 순서와 간격을 실측값으로 계산하게 한다.
 */
export function useDetailLoader(id: string, hasSeed: boolean): DetailLoaderState {
  const [state, setState] = useState<DetailLoaderState>(INITIAL)

  useEffect(() => {
    let cancelled = false
    setState({ ...INITIAL, summaryAt: hasSeed ? performance.now() : null })

    fetchProductDetail(id)
      .then((detail) => {
        if (cancelled) return
        const at = performance.now()
        setState((prev) => ({
          detail,
          detailAt: at,
          summaryAt: prev.summaryAt ?? at,
          failed: detail === null,
        }))
      })
      .catch(() => {
        if (!cancelled) setState((prev) => ({ ...prev, failed: true }))
      })

    return () => {
      cancelled = true
    }
  }, [id, hasSeed])

  return state
}
