'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { ANALYTICS_EVENT_COUNT, type BatchMode, type BatchStatusResponse } from '../types'

export interface VerificationFooterProps {
  mode: BatchMode
  current: BatchStatusResponse | null
  history: BatchStatusResponse[]
  clientRoundTripMs: number | null
}

const MODE_LABEL: Record<BatchMode, string> = {
  sequential: '순차 처리',
  parallel: '병렬 처리',
}

export function VerificationFooter({ mode, current, history, clientRoundTripMs }: VerificationFooterProps) {
  const isComplete = current?.isComplete === true
  const allEventsDone = current?.events.every((e) => e.status === 'done') ?? false
  const respondedBeforeBatchDone =
    isComplete && current!.batchCompletedAt !== null ? current!.batchCompletedAt > current!.responseReturnedAt : undefined

  const isMatched = isComplete ? allEventsDone && respondedBeforeBatchDone === true : undefined

  const sumEventDurationMs = current?.events.reduce((sum, e) => sum + (e.durationMs ?? 0), 0) ?? 0
  const totalBatchDurationMs =
    isComplete && current!.batchStartedAt !== null ? current!.batchCompletedAt! - current!.batchStartedAt! : null

  const expected =
    `• Server Action은 배치(${ANALYTICS_EVENT_COUNT}건) 완료를 기다리지 않고 즉시 반환된다 (클라이언트 RTT가 짧게 유지됨)\n` +
    `• after() 콜백은 응답 반환 이후에도 계속 실행되어, batchCompletedAt이 responseReturnedAt보다 나중이어야 한다\n` +
    `• 병렬 처리 모드의 총 소요 시간은 이벤트별 소요 시간의 합보다 짧아야 한다 (실제 동시 실행 증거)`

  const actual = !current
    ? '• 배치 대기 중 (상단에서 모드를 선택하고 [배치 트리거]를 실행해 주세요.)'
    : !isComplete
    ? `• 배치 처리 중 (모드: ${MODE_LABEL[current.mode]}) — 응답은 이미 반환됨(RTT ${clientRoundTripMs ?? '-'}ms), after() 백그라운드 작업 진행 중`
    : `• 모드: ${MODE_LABEL[current.mode]} / 클라이언트 RTT: ${clientRoundTripMs}ms\n` +
      `• responseReturnedAt: ${current.responseReturnedAt} / batchCompletedAt: ${current.batchCompletedAt}\n` +
      `• 응답 반환 후 배치 완료까지: ${current.batchCompletedAt! - current.responseReturnedAt}ms (${
        respondedBeforeBatchDone ? '응답이 배치 완료보다 먼저 도착함 — 확인됨' : '이상: 응답이 배치 완료보다 늦게 도착함'
      })\n` +
      `• 이벤트 ${ANALYTICS_EVENT_COUNT}건 처리 상태: ${allEventsDone ? '전부 완료' : '일부 미완료'} / 총 소요 ${totalBatchDurationMs}ms (이벤트 소요 합계 ${sumEventDurationMs}ms)`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="after() 비동기 분석 배치 파이프라인 검증 결과"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="배치 트리거 직후 반환된 응답 시각과, 폴링으로 확인한 실제 배치 완료 시각을 비교해 after()가 응답 이후에도 백그라운드에서 계속 실행됨을 실측으로 검증합니다."
      />

      {history.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
          <div className="font-bold text-zinc-700 dark:text-zinc-300">실행 기록 (순차 vs 병렬 비교)</div>
          {history.map((run) => {
            const total = run.batchStartedAt !== null && run.batchCompletedAt !== null ? run.batchCompletedAt - run.batchStartedAt : null
            const sum = run.events.reduce((s, e) => s + (e.durationMs ?? 0), 0)
            return (
              <div key={run.batchId} className="flex flex-wrap items-center gap-2 rounded bg-zinc-50 px-2.5 py-1.5 font-mono text-[11px] dark:bg-zinc-900/50">
                <span className={run.mode === 'parallel' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-zinc-600 dark:text-zinc-400 font-bold'}>
                  {MODE_LABEL[run.mode]}
                </span>
                <span>총 소요 {total}ms</span>
                <span className="text-zinc-400">(이벤트 합계 {sum}ms)</span>
              </div>
            )
          })}
        </div>
      )}

      <DemoDeepDiveCard title="after() 비동기 분석 배치 파이프라인 및 응답 비차단 스케줄링">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>after()</code> (<code>next/server</code>)는 Server Actions, Route Handlers, Server Components에서
              호출할 수 있으며, 콜백을 클라이언트로 응답이 완전히 전달된 이후 실행되도록 예약합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              <code>actions.ts</code>의 <code>runAnalyticsBatch()</code>는 배치 작업(batchId)만 등록하고 즉시 반환합니다.
              실제 처리는 <code>after(async () =&gt; {'{'} await executeBatch(job.batchId) {'}'})</code> 안에서 이뤄지며,
              <code>batch-store.ts</code>의 <code>executeBatch()</code>가 순차 모드에서는 <code>for</code> 루프로,
              병렬 모드에서는 <code>Promise.all()</code>로 이벤트 {ANALYTICS_EVENT_COUNT}건에 대해 실제
              <code>node:crypto pbkdf2</code> 해시 연산을 수행합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>응답 지연(TTFB) 단축</strong>: 분석 배치 처리 완료를 기다리지 않고 사용자에게 즉시 응답합니다.</li>
              <li><strong>서버리스 런타임 안전 보장</strong>: 일반 Promise와 달리, 플랫폼이 응답 종료 후 인스턴스를 즉시
                프리징하지 않고 <code>after()</code> 태스크가 끝날 때까지 대기하도록 <code>waitUntil</code>로 연장됩니다.</li>
              <li><strong>실패 격리</strong>: 배치 이벤트 처리 중 에러가 발생해도 콘솔에 기록될 뿐, 이미 반환된 응답에는
                영향을 주지 않습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 순차 vs 병렬 처리 차이</h5>
            <p>
              동일한 이벤트 {ANALYTICS_EVENT_COUNT}건을 순차 처리하면 이벤트별 소요 시간의 합만큼 걸리지만,
              <code>Promise.all()</code>로 병렬 처리하면 가장 오래 걸리는 이벤트 하나의 시간에 근접합니다.
              위 검증 패널의 "총 소요"와 "이벤트 소요 합계"를 두 모드로 각각 실행해 비교하면 실측으로 확인할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>응답 수정 불가</strong>: 이미 응답이 전달된 후 실행되므로 쿠키를 쓰거나 응답 본문을 바꿀 수 없습니다.</li>
              <li><strong>실행 시간 제한</strong>: 플랫폼의 <code>maxDuration</code> 안에서 완료돼야 하므로, 대규모 배치는
                전용 큐(SQS/BullMQ)로 이관해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
