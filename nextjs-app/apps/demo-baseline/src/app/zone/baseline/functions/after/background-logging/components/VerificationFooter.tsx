'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { formatTimestamp } from '../format'
import type { AuditLogEntry, DemoPhase, SubmitOrderResult } from '../types'

export interface VerificationFooterProps {
  phase: DemoPhase
  result: SubmitOrderResult | null
  entry: AuditLogEntry | null
}

const EXPECTED_TEXT =
  '• after() 콜백 시작 시각(T2)은 항상 Server Action 반환 시각(T1) 이후여야 한다.\n• (T2 ≥ T1)'

export function VerificationFooter({ phase, result, entry }: VerificationFooterProps) {
  const isMatched =
    phase === 'completed' && entry?.afterStartedAt != null
      ? entry.afterStartedAt >= entry.responseReturnedAt
      : phase === 'timeout'
      ? false
      : undefined

  // ExpectedActualPanel은 expected/actual이 둘 다 순수 문자열일 때 내부적으로 자동 일치 비교를 시도한다.
  // 이 데모는 항상 위 isMatched 값으로 직접 상태를 통제하므로, actual을 문자열이 아닌 노드로 감싸
  // 의도치 않은 자동 비교(대기 중 상태가 '불일치'로 오판되는 것)를 막는다.
  const actualText = (() => {
    if (!result) {
      return '• 상호작용 대기 중 (상단 [최종 결제 승인 요청]을 눌러 실제 서버 타임스탬프를 기록해 주세요.)'
    }
    if (phase === 'submitting') {
      return '• Server Action 실행 중... T1이 기록되면 표시됩니다.'
    }
    const t1 = formatTimestamp(result.responseReturnedAt)
    if (phase === 'waiting-after' || entry?.afterStartedAt == null) {
      return `• T1 (응답 반환) = ${t1}\n• after() 콜백 실행 결과를 서버에서 조회하는 중...`
    }
    const t2 = formatTimestamp(entry.afterStartedAt)
    const delta = entry.afterStartedAt - entry.responseReturnedAt
    if (phase === 'timeout') {
      return `• T1 = ${t1}\n• 6초 내에 after() 콜백 완료를 확인하지 못했습니다 (실측 실패).`
    }
    const t3 = formatTimestamp(entry.afterCompletedAt)
    return `• T1 (응답 반환) = ${t1}\n• T2 (after 시작) = ${t2}\n• T3 (after 완료) = ${t3}\n• Δ(T2 − T1) = ${delta}ms → after()가 응답 반환 이후에 시작됨`
  })()
  const actualContent = <span>{actualText}</span>

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="after() 백그라운드 주문 로깅 검증 결과"
        expected={EXPECTED_TEXT}
        actual={actualContent}
        isMatched={isMatched}
        description="Server Action 반환 시각(T1)과 after() 콜백 실행 시각(T2, T3)을 같은 서버 시계 기준으로 실측 비교합니다."
      />
      <DemoDeepDiveCard title="after() 백그라운드 감사 로깅">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/server</code>의 <code>after(callback)</code>은 응답(또는 프리렌더)이 끝난
              뒤에 실행되도록 콜백을 예약합니다. Server Component, Server Function(Server Action),
              Route Handler, Proxy 안에서 호출할 수 있고, 응답을 블로킹하지 않습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              이 데모의 <code>submitOrder</code> Server Action은 <code>after()</code>를 호출한 직후
              바로 결과를 반환합니다(T1). <code>after()</code> 콜백은 그 이후 실제로 실행되며(T2),
              카드 결제 식별자를 PBKDF2로 해시 마스킹해 감사 로그에 기록하고 완료됩니다(T3). 이
              PBKDF2 연산은 <code>setTimeout</code>으로 흉내 낸 지연이 아니라, libuv 스레드풀에서
              실제로 계산 비용이 드는 비동기 작업입니다. T1·T2·T3는 모두 같은 서버 프로세스의
              시계로 기록되므로 클라이언트-서버 시계 오차 없이 순서를 그대로 비교할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>응답 지연 없음</strong>: 로깅 연산을 사용자 응답 경로에서 분리합니다.</li>
              <li>
                <strong>로그 유실 방지</strong>: self-hosting 환경에서 <code>SIGINT</code>/<code>SIGTERM</code>을
                받아도 서버는 대기 중인 <code>after()</code> 콜백을 마치고 종료합니다.
              </li>
              <li><strong>실행 순서 보장</strong>: 응답이 실패로 끝나거나 <code>notFound</code>/<code>redirect</code>가 호출돼도 콜백은 실행됩니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 이 데모의 범위</h5>
            <p>
              이 데모는 <strong>단일 감사 로그 콜백 1개</strong>가 실제로 응답 이후 실행됨을
              증명하는 데 집중합니다. 여러 목적지로 이벤트를 나눠 보내는 비동기 배치 파이프라인은
              같은 <code>functions/after</code> 아래의 다른 데모(분석 배치 파이프라인)에서 다룹니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 한계</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>에러 핸들링 필수</strong>: <code>after()</code> 내부 예외는 사용자에게 보이지 않으므로 직접 <code>try/catch</code>로 처리해야 합니다.</li>
              <li><strong>실행 시간 제한</strong>: <code>maxDuration</code> route segment config로 설정한 시간 내에 끝나야 합니다.</li>
              <li>
                <strong>관찰 범위의 한계</strong>: T1은 애플리케이션 코드에서 잡을 수 있는 가장 이른
                시점(Server Action 함수 반환 직전)이며, 브라우저가 실제로 TCP 응답을 전부 수신한
                시각과는 다를 수 있습니다. 그럼에도 T2가 T1보다 항상 같거나 늦다는 사실은 두
                시각이 동일한 서버 프로세스 시계로 기록되기 때문에 유효한 실측 증거입니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
