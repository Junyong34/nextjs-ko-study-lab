import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { SESSION_LABELS, type PrivateSessionId, type SwitchableSessionId } from '../types'

export interface VerificationFooterProps {
  currentSessionId: PrivateSessionId
  cacheInstanceId: string
  generatedAt: string
  pendingTarget: SwitchableSessionId | null
  isPending: boolean
  isMatched: boolean | undefined
  reloadNote: string | null
}

export function VerificationFooter({
  currentSessionId,
  cacheInstanceId,
  generatedAt,
  pendingTarget,
  isPending,
  isMatched,
  reloadNote,
}: VerificationFooterProps) {
  const actual = pendingTarget
    ? isPending
      ? `세션 전환 중... (목표: ${SESSION_LABELS[pendingTarget]})`
      : `sessionId: ${currentSessionId} (목표 ${pendingTarget}와(과) ${isMatched ? '일치' : '불일치'}) · cacheInstanceId: #${cacheInstanceId} · 조회 시각: ${generatedAt}`
    : `아직 세션을 전환하지 않았습니다. 현재 세션: ${SESSION_LABELS[currentSessionId]} · cacheInstanceId: #${cacheInstanceId}`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="'use cache: private' 세션 전환 격리 검증"
        expected={"다른 사용자 버튼을 클릭하면 Server Action이 세션 쿠키를 바꾸고, 'use cache: private' 함수가 새 쿠키 값으로 다시 계산되어 선택한 사용자의 주문 내역과 sessionId가 즉시 반영되어야 한다."}
        actual={actual}
        isMatched={isMatched}
        description="쿠키를 바꾸는 것은 실제 Server Action이고, 그 결과를 읽는 것은 실제 'use cache: private' 함수다 — 흉내 낸 상태 전환이 아니다."
      />

      {reloadNote && (
        <div className="rounded border border-amber-300 bg-amber-50/60 px-3.5 py-2.5 text-[11px] leading-relaxed text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/20 dark:text-amber-300">
          <span className="font-semibold">재조회 관찰:</span> {reloadNote}
        </div>
      )}

      <DemoDeepDiveCard title="'use cache: private'로 개인화 주문 내역을 캐시하는 원리">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 일반 'use cache'와의 결정적 차이</h5>
            <p>
              일반 <code>'use cache'</code> 함수 안에서는 <code>cookies()</code>·<code>headers()</code>·<code>searchParams</code>를
              호출할 수 없다. <code>'use cache: private'</code>는 이 세 API를 캐시 스코프 안에서 그대로 호출하도록
              허용하는 대신, 그 결과를 서버에 저장하지 않는다. 이 데모의 <code>getPrivateOrderHistory()</code>가
              스코프 내부에서 <code>cookies()</code>를 직접 읽는 것이 바로 이 허용 규칙 때문에 가능하다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 동작 원리</h5>
            <p>
              [다른 사용자로 전환] 버튼 → <code>switchPrivateSessionAction</code>(Server Action)이 실제
              Set-Cookie 응답 헤더를 보냄 → 라우트가 다시 렌더링되며 <code>getPrivateOrderHistory()</code>가
              바뀐 쿠키를 읽어 <code>cacheTag(`directives-use-cache-private-profile-cache:${'{sessionId}'}`)</code>로 사용자별 캐시를 분리하고
              해당 사용자의 주문 내역만 반환한다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              3. 서버에 저장되지 않는다 — 브라우저 메모리 전용 캐시
            </h5>
            <p>
              공식 문서(<code>use-cache-private.md</code>)는 이 캐시가 <strong>서버에 절대 저장되지 않으며 브라우저
              메모리에만 캐시</strong>된다고 명시한다. 그래서 페이지를 새로고침하거나 같은 세션으로 다시 전환해도
              <code>cacheInstanceId</code>와 조회 시각이 매번 새로 발급된다 — 위 재조회 관찰 메모가 그 증거다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 이점 및 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>규정 준수상 개인화 데이터를 서버에 임시로라도 남길 수 없을 때 적합하다.</li>
              <li><code>cacheLife</code> 설정이 필요하다 — 생략하면 암묵적인 <code>default</code> 프로파일이 적용되어 동작을 예측하기 어렵다.</li>
              <li><code>connection()</code>은 두 지시어 모두에서 금지된다 — 안전하게 캐시될 수 없는 연결별 정보이기 때문이다.</li>
              <li>이 지시어는 Route Handler에서는 사용할 수 없다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
