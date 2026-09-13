'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { RenderLogEntry } from '../types'

export interface VerificationFooterProps {
  log: RenderLogEntry[]
}

export function VerificationFooter({ log }: VerificationFooterProps) {
  const [latest, previous] = log
  const hasBypassCookie = latest?.hasBypassCookie ?? false
  const hasEnoughSamples = Boolean(latest && previous)
  const isFrozen = hasEnoughSamples && latest.renderedAt === previous.renderedAt
  const isMatched = hasEnoughSamples ? !hasBypassCookie && isFrozen : undefined

  const expected =
    '- draftMode().disable() 이후: __prerender_bypass 쿠키 없음\n' +
    '- "다시 요청"을 연속 클릭해도 정적 캐시(unstable_cache) 값이 45초간 고정되어 같은 renderedAt을 반환'

  const actual = hasEnoughSamples
    ? `- __prerender_bypass 쿠키: ${hasBypassCookie ? '있음' : '없음'}\n` +
      `- 최근 renderedAt: ${latest.renderedAt}\n` +
      `- 직전 renderedAt: ${previous.renderedAt}\n` +
      `- 두 값이 같은가(캐시 고정): ${isFrozen ? '예' : '아니오'}`
    : '- "정적 캐시 렌더링 시각 다시 요청"을 최소 2번 클릭해야 렌더링 시각이 고정되는지 비교할 수 있습니다.'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="draftMode().disable() 정적 캐시 모드 복귀 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="disable() 실행 후 쿠키가 사라지고, 반복 요청 시 렌더링 시각이 고정되는지 실제 응답값으로 확인합니다."
      />
      <DemoDeepDiveCard title="draftMode().disable() 내부 동작과 캐시 복귀 원리">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙</h5>
            <p>
              <code>(await draftMode()).disable()</code>(<code>next/headers</code>)는 Route Handler
              안에서 <code>__prerender_bypass</code> 쿠키를 삭제한다. Next.js 내부 구현은{' '}
              <code>Max-Age: 0</code>이 아니라 <code>expires</code>를 1970-01-01(과거)로 설정해
              쿠키를 삭제한다 — <code>Max-Age: 0</code>은 RFC 6265 상 무시되는 값이기 때문이다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 실측 방법</h5>
            <p>
              상단 "0. 사전 준비" 버튼은 <code>enable/route.ts</code>를 호출해 쿠키를 발급하고,
              "disable() 실행" 버튼은 <code>disable/route.ts</code>를 호출해 실제로 쿠키를
              삭제한다. 개발자 도구 Network 탭에서 <code>disable</code> 요청의 Response Headers
              &gt; Set-Cookie 값을 열면 삭제 근거(과거 만료일)를 직접 볼 수 있다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 렌더링 시각이 고정되는 이유</h5>
            <p>
              <code>page.tsx</code>는 <code>unstable_cache</code>로 감싼 함수를 호출해
              <code>renderedAt</code>을 계산한다. Draft Mode 바이패스는 페이지 렌더링
              파이프라인에서만 적용되므로, "정적 캐시 렌더링 시각 다시 요청" 버튼은{' '}
              <code>router.refresh()</code>로 이 Server Component를 실제로 다시 렌더링한다.
              쿠키가 있으면 캐시 읽기/쓰기가 우회되어 매번 새 시각이 계산되고, 없으면
              revalidate(45초) 동안 같은 값을 반환한다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <code>__prerender_bypass</code>는 <code>httpOnly</code> 쿠키라 브라우저 JS(
                <code>document.cookie</code>)로는 읽을 수 없다 — Network 탭으로만 직접 확인 가능하다.
              </li>
              <li>
                disable 엔드포인트로 이동하는 <code>&lt;Link&gt;</code>는 prefetch가 쿠키를 조기
                삭제할 수 있어 반드시 <code>prefetch={'{false}'}</code>가 필요하다 (공식 문서 기준).
                이 데모는 그 위험을 피하려고 <code>fetch()</code> 버튼 클릭으로만 호출한다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
