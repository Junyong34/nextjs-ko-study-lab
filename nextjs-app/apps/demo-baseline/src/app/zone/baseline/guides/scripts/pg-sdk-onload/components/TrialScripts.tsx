'use client'

import React from 'react'
import Script from 'next/script'
import { SDK_DELAY_MS, SDK_ROUTE, type ActiveTrial, type EventKind } from '../types'

interface TrialScriptsProps {
  trial: ActiveTrial
  /** 이 시도의 SDK onLoad가 끝났는가 (chained에서 플러그인 마운트 조건) */
  sdkLoaded: boolean
  onEvent: (runId: number, kind: EventKind, detail: string) => void
  onSdkLoad: (runId: number, src: string) => void
  onPluginLoad: (runId: number, src: string) => void
}

/**
 * 실제 next/script 두 개. runId가 바뀔 때마다 key·id·src가 모두 새로워져 매 시도가 진짜 로드가 된다.
 * - parallel: SDK(1200ms 지연)와 플러그인(지연 없음)을 같은 렌더에서 마운트
 * - chained : 플러그인 <Script>를 SDK의 onLoad 이후에야 마운트
 * - error   : SDK 응답이 HTTP 500
 */
export function TrialScripts({ trial, sdkLoaded, onEvent, onSdkLoad, onPluginLoad }: TrialScriptsProps) {
  const { runId, order } = trial

  const sdkSrc = `${SDK_ROUTE}?name=sdk&delay=${SDK_DELAY_MS}&run=${runId}${order === 'error' ? '&fail=500' : ''}`
  const pluginSrc = `${SDK_ROUTE}?name=plugin&run=${runId}`
  const showPlugin = order === 'parallel' || (order === 'chained' && sdkLoaded)

  return (
    <>
      <Script
        id={`pg-run-${runId}-sdk`}
        src={sdkSrc}
        onLoad={() => onSdkLoad(runId, sdkSrc)}
        onReady={() => onEvent(runId, 'sdk-onReady', `SDK onReady (typeof window.PgSdk = ${typeof window.PgSdk})`)}
        onError={() => onEvent(runId, 'sdk-onError', 'SDK 로드 실패 (HTTP 500) — onLoad는 호출되지 않는다')}
      />
      {showPlugin && (
        <Script
          id={`pg-run-${runId}-plugin`}
          src={pluginSrc}
          onLoad={() => onPluginLoad(runId, pluginSrc)}
          onReady={() => onEvent(runId, 'plugin-onReady', '플러그인 onReady')}
        />
      )}
    </>
  )
}
