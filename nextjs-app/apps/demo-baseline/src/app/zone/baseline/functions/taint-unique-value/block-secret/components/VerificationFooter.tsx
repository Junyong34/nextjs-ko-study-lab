'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { TaintDemoState } from '../types'

export function VerificationFooter({ state }: { state: TaintDemoState }) {
  const { tainted, untainted } = state

  const isMatched =
    !tainted || !untainted
      ? undefined
      : tainted.blocked === true && untainted.blocked === false

  const actualLines = [
    tainted
      ? `• taint 적용: ${tainted.blocked ? '차단됨' : '차단되지 않음(경고)'} — ${tainted.message}`
      : '• taint 적용 시도 대기 중',
    untainted
      ? `• taint 미적용: 원문 그대로 반환됨 — ${untainted.revealedSecret ?? untainted.message}`
      : '• taint 미적용 시도 대기 중',
  ]

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="experimental_taintUniqueValue 원시 시크릿 유출 차단 검증 결과"
        expected={
          '• taint 적용 pgSecretKey 전달 시도는 React 런타임 에러로 차단되어야 한다 (원문 미노출)\n' +
          '• taint 미적용 legacyWebhookSecret 전달 시도는 차단 없이 원문 그대로 반환되어야 한다'
        }
        actual={actualLines.join('\n')}
        isMatched={isMatched}
        description="위 실습 콘솔에서 두 버튼을 각각 눌러 실제 Server Action 호출 결과를 비교합니다. 아직 누르지 않은 쪽은 대기 상태로 표시됩니다."
      />
      <DemoDeepDiveCard title="experimental_taintUniqueValue와 next.config.ts experimental.taint">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>experimental_taintUniqueValue</code>(<code>react</code>)는 <code>next.config.ts</code>의{' '}
              <code>experimental.taint: true</code>를 켰을 때 사용할 수 있는 React 19 experimental API다. 문자열 같은 원시
              고유 값 하나에 taint를 걸면, 그 값이 <code>Server Component</code>와 <code>Client Component</code> 경계를
              넘어 직렬화되려는 순간(<code>Client Component</code> props 또는 Server Action 응답 모두 동일한 직렬화
              경계를 거친다) React가 실제 런타임 에러를 던진다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 실제 동작 원리</h5>
            <p>
              <code>payment-secret.ts</code>의 <code>getPaymentGatewaySecrets()</code>는 매 호출마다{' '}
              <code>secrets.pgSecretKey</code>에 <code>experimental_taintUniqueValue</code>를 적용한다.
              [taint 적용 PG 시크릿 키 전달 시도] 버튼은 이 값을 그대로 Server Action 응답에 담아 반환하려 시도하고,
              React가 응답을 직렬화하는 도중 실제 에러를 던지므로 <code>page.tsx</code>의 <code>try/catch</code>가 그
              에러 메시지를 그대로 화면에 표시한다. 반대로 <code>legacyWebhookSecret</code>은 taint를 걸지 않았기 때문에
              같은 방식으로 반환해도 아무 보호도 받지 못하고 원문이 그대로 클라이언트에 도달한다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 필수 설정: next.config.ts</h5>
            <p>
              이 zone(<code>apps/demo-baseline/next.config.ts</code>)은 <code>experimental.taint: true</code>가 이미
              켜져 있다. 이 플래그 없이는 <code>experimental_taintUniqueValue</code> import 자체는 되지만 taint 보호가
              동작하지 않는다 — 즉 [taint 적용] 버튼을 눌러도 차단되지 않고 원문이 그대로 반환된다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 주의사항 (Caveats)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>파생 값은 보호되지 않는다</strong>: <code>{'`token::${pgSecretKey}`'}</code>처럼 taint된 값에서
                새 문자열을 만들면 그 파생 값은 taint되지 않은 채로 클라이언트에 전달될 수 있다.
              </li>
              <li>
                <strong>taint API만으로는 부족하다</strong>: 공식 문서도 taint를 유일한 방어 수단으로 삼지 말라고
                경고한다 — 애초에 민감한 데이터를 필요하지 않은 컨텍스트로 반환하지 않도록 설계하는 편이 우선이다.
              </li>
              <li>
                <strong>taint된 값 자체는 재할당해도 보호된다</strong>: <code>pgSecretKey</code>를 다른 변수에 담아
                반환해도 여전히 차단된다 — 이 데모에서도 별도 변수로 옮기지 않고 그대로 반환해 이를 실증한다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
