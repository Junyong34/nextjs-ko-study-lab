import React from 'react'
import type { InjectionResult, NonceSample, PageSnapshot } from '../types'

const row = 'flex flex-wrap gap-x-2 font-mono text-[11px] leading-relaxed'
const label = 'text-zinc-500'

/** 서버가 발급한 값과 브라우저가 관찰한 값을 그대로 나열한다. 판정은 하지 않는다. */
export function NoncePanel({
  nonce,
  requestCsp,
  page,
  samples,
  injection,
}: {
  nonce: string | null
  requestCsp: string | null
  page: PageSnapshot
  samples: NonceSample[]
  injection: InjectionResult | null
}) {
  const d = page.demo
  if (!nonce) {
    return (
      <p className="rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
        요청 헤더에 x-nonce가 없습니다. 이 경로에서 proxy.ts의 CSP 분기가 실행되지 않았습니다.
      </p>
    )
  }
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className={row}><span className={label}>서버 x-nonce</span><span>{nonce}</span></div>
      <div className={row}><span className={label}>요청 CSP 헤더</span><span className="break-all">{requestCsp ?? '없음'}</span></div>
      <div className={row}>
        <span className={label}>브라우저 관찰</span>
        <span>
          {d
            ? `nonce 스크립트 실행=${d.nonceRan} · nonce 없는 스크립트 실행=${d.blockedRan} · next/script 실행=${d.nextScriptRan}`
            : '대기 중'}
        </span>
      </div>
      <div className={row}>
        <span className={label}>위반 이벤트</span>
        <span className="break-all">
          {d?.violations.length
            ? d.violations.map((v) => `${v.directive}(${v.sample || '-'})`).join(' · ')
            : '없음'}
        </span>
      </div>
      <div className={row}>
        <span className={label}>새 요청 nonce</span>
        <span>{samples.length ? samples.map((s) => s.headerNonce?.slice(0, 10) ?? '없음').join(' → ') : '아직 요청하지 않음'}</span>
      </div>
      <div className={row}>
        <span className={label}>주입 시도</span>
        <span>
          {injection
            ? `핸들러 실행=${injection.ran} · 위반=${injection.violations.map((v) => v.directive).join(', ') || '없음'}`
            : '아직 시도하지 않음'}
        </span>
      </div>
    </div>
  )
}
