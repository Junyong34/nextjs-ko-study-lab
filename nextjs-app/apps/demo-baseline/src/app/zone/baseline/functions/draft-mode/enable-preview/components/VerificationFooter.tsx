'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { DraftPreviewSnapshot } from '../types'

export interface VerificationFooterProps {
  isEnabled: boolean
  snapshot: DraftPreviewSnapshot
}

interface DiffResult {
  changed: boolean
  previousRenderedAt: string
}

export function VerificationFooter({ isEnabled, snapshot }: VerificationFooterProps) {
  const previousRef = useRef<DraftPreviewSnapshot | null>(null)
  const [diff, setDiff] = useState<DiffResult | null>(null)

  useEffect(() => {
    const previous = previousRef.current
    if (previous) {
      setDiff({
        changed: previous.renderedAt !== snapshot.renderedAt,
        previousRenderedAt: previous.renderedAt,
      })
    }
    previousRef.current = snapshot
  }, [snapshot.renderedAt, snapshot.requestId])

  const expected = isEnabled
    ? '__prerender_bypass 쿠키가 있으므로 재요청마다 renderedAt/requestId가 매번 달라져야 한다 (정적 캐시 우회 — unstable_cache가 매 요청 재실행됨).'
    : '쿠키가 없으므로 재요청해도 renderedAt/requestId가 그대로 유지되어야 한다 (unstable_cache 캐시 HIT).'

  const actual = !diff
    ? `- draftMode().isEnabled: ${isEnabled}\n- renderedAt: ${snapshot.renderedAt}\n- requestId: ${snapshot.requestId}\n- [실습 화면]에서 [다시 요청]을 한 번 더 눌러야 이전 값과 비교를 시작합니다.`
    : `- draftMode().isEnabled: ${isEnabled}\n- 이전 renderedAt: ${diff.previousRenderedAt}\n- 현재 renderedAt: ${snapshot.renderedAt}\n- 변경 여부: ${diff.changed ? '변경됨' : '동일 유지'}`

  const isMatched = !diff ? undefined : isEnabled ? diff.changed === true : diff.changed === false

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="draftMode().enable() 캐시 우회 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="draftMode 활성화 전/후 같은 데이터 소스(getPreviewSnapshot)를 재요청했을 때 renderedAt이 유지되는지 매번 바뀌는지를 실제 값으로 비교합니다."
      />

      <DemoDeepDiveCard title="draftMode().enable()이 정적 캐시를 우회하는 원리">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>(await draftMode()).enable()</code>(<code>next/headers</code>)은 Route Handler에서 호출하면
              바이패스 쿠키(<code>__prerender_bypass</code>)를 <strong>Set-Cookie 응답 헤더</strong>로 실제로 발급한다.
              이 쿠키가 있는 요청은 <code>fetch()</code> 캐시, <code>unstable_cache</code>, ISR 응답 캐시를 모두 우회해
              매 요청마다 새로 렌더링된다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 실제 동작 구조</h5>
            <p>
              이 실습 화면의 <code>enable/route.ts</code>는 공식 문서 예제와 동일하게 GET 요청에서{' '}
              <code>draft.enable()</code>을 호출한 뒤 <code>redirect()</code>로 돌아온다. 상단 카드의 renderedAt은{' '}
              <code>unstable_cache</code>로 감싼 함수가 반환한 값이다 — draftMode가 꺼져 있으면 캐시된 값을 그대로
              돌려주고, 켜져 있으면 매번 새로 실행되어 값이 바뀐다. 이 페이지는 CMS 데이터를 흉내 낸 것이 아니라
              실제로 Next.js 캐시 계층이 우회되는 것을 renderedAt 값 자체로 증명한다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                실제 서비스에서는 <code>enable</code> 라우트에 CMS 시크릿 토큰 검증을 반드시 추가해야 한다 — 이 데모는
                학습 목적상 검증 없이 누구나 호출 가능하다.
              </li>
              <li>
                <code>__prerender_bypass</code> 쿠키는 브라우저를 닫을 때까지 유지된다. 이 브라우저로 다른
                draft-mode 데모를 열어도 Draft Mode가 켜진 상태로 보이는 이유다 — 끄는 방법은 형제 데모인{' '}
                <code>disable-preview</code>에서 다룬다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
