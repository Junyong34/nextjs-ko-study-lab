'use client'

import React from 'react'
import { DemoDeepDiveCard, ExpectedActualPanel } from '@study/demo-kit'
import { summarizeEvents } from '../hooks/summarizeEvents'
import type { SdkEvent } from '../types'

function mark(pass: boolean | undefined) {
  return pass === undefined ? '[대기]' : pass ? '[일치]' : '[불일치]'
}

export function VerificationFooter({ events }: { events: SdkEvent[] }) {
  const { checks, isMatched } = summarizeEvents(events)

  // ExpectedActualPanel은 isMatched가 undefined이고 expected/actual이 둘 다 string이면 문자열을 비교해
  // "불일치"로 오판정한다(공유 컴포넌트 로직). 대기 상태를 올바르게 보이도록 프래그먼트로 감싼다.
  const expected = <>{checks.map((c, i) => `${i + 1}. ${c.label}`).join('\n')}</>
  const actual = <>{checks.map((c, i) => `${i + 1}. ${mark(c.pass)} ${c.actual}`).join('\n')}</>

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="onLoad / onReady / onError 호출 시점·횟수 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="SDK 로드 → 주문 내역 페이지 왕복(Link) → 장애 시나리오 실행까지 마치면 6개 항목이 모두 판정됩니다. 판정 근거는 위 로그의 실측값(콜백 호출 횟수, performance.now(), 콜백 시점의 window.DemoPay 존재 여부)뿐입니다."
      />
      <DemoDeepDiveCard title="next/script 이벤트 콜백 수명주기">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 세 콜백의 호출 시점</h5>
            <ul className="list-inside list-disc space-y-1 pl-1">
              <li><code>onLoad</code>: 스크립트의 <code>load</code> 이벤트 때 <strong>최초 1회</strong>. 같은 id/src가 이미 로드됐으면 다시 마운트돼도 호출되지 않습니다.</li>
              <li><code>onReady</code>: 최초 로드 직후 1회 + 이후 컴포넌트가 <strong>다시 마운트될 때마다</strong>. 지도·결제 위젯처럼 DOM에 다시 그려야 하는 초기화에 씁니다.</li>
              <li><code>onError</code>: 스크립트 요청이 실패(HTTP 오류, 네트워크 오류)해 <code>error</code> 이벤트가 나면 호출됩니다. 이때 onLoad/onReady는 호출되지 않습니다.</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 내부 동작 (node_modules/next/dist/client/script.js)</h5>
            <pre className="overflow-x-auto rounded bg-zinc-100 p-2 font-mono text-[11px] dark:bg-zinc-900">{`모듈 스코프: ScriptCache(src→Promise), LoadCache(id|src)
첫 마운트  : useEffect(onReady) → LoadCache에 없음 → 건너뜀
            useEffect(load)    → <script> 생성·append
            load 이벤트        → onLoad() → onReady() → LoadCache.add
재마운트   : useEffect(onReady) → LoadCache에 있음 → onReady()
            useEffect(load)    → LoadCache에 있음 → return (onLoad 없음)
error 이벤트: onError(e), LoadCache에 추가되지 않음`}</pre>
            <p className="mt-1">
              캐시가 모듈 스코프이므로 <code>&lt;Link&gt;</code> 소프트 내비게이션 동안 유지되고, 새로고침하면 초기화됩니다.
              이 데모의 로그 저장소도 같은 수명을 갖도록 모듈 스코프에 두었습니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 이 데모의 SDK는 실제 스크립트입니다</h5>
            <p>
              외부 PG사 CDN 대신 이 데모 폴더의 <code>sdk/route.ts</code> Route Handler가 실제 JavaScript를 응답합니다.
              <code>?delay=</code>는 서버가 실제로 응답을 늦추고, <code>?fail=500|404</code>는 실제 HTTP 오류 status를 돌려줍니다.
              성공 응답은 실행되며 <code>window.DemoPay</code>를 정의하고, 페이지는 그 전역 객체를 직접 호출합니다. 결제 승인 같은 실제 PG 연동은 없습니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무 주의사항</h5>
            <ul className="list-inside list-disc space-y-1 pl-1">
              <li><strong>전역 객체는 콜백 안에서만 신뢰</strong>: 마운트 직후 <code>useEffect</code>에서 SDK를 부르면 첫 방문엔 실패하고, 재방문엔 우연히 성공합니다(로그의 1회차/2회차 비교). 초기화는 onReady에 둡니다.</li>
              <li><strong>onLoad에는 1회성 작업만</strong>: 전역 설정처럼 페이지 수명 동안 한 번이면 되는 일에 씁니다. 위젯 렌더링을 onLoad에 두면 재방문 시 위젯이 비어 있게 됩니다.</li>
              <li><strong>Client Component 전용</strong>: 세 콜백 모두 Server Component에서 쓸 수 없고, onLoad/onError는 <code>beforeInteractive</code>와 함께 쓸 수 없습니다.</li>
              <li><strong>같은 src 재시도는 재요청되지 않음</strong>: 실패한 src도 ScriptCache에 남습니다. 이 데모는 재시도마다 <code>attempt</code> 쿼리를 바꿔 매번 실제 요청을 보냅니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
