'use client'

import React from 'react'
import { DemoDeepDiveCard, ExpectedActualPanel } from '@study/demo-kit'
import { LATENCY_MAX_MS, LATENCY_SUM_MS } from '../constants'
import type { ScenarioResults } from '../types'

// setTimeout 해상도 오차만 허용한다 (Node 타이머는 조금 늦게 깨어날 수는 있어도 크게 일찍 깨지 않는다).
const TIMER_SLACK_MS = 5

const EXPECTED = [
  '• 클라이언트 직접 호출: 브라우저 요청 3건',
  '• BFF 호출(직렬·병렬 모두): 브라우저 요청 1건',
  `• BFF 직렬: 서버 소요 ≥ 지연 합계 ${LATENCY_SUM_MS}ms`,
  `• BFF Promise.all: 서버 소요 ≈ 가장 느린 레거시 ${LATENCY_MAX_MS}ms (합계보다 작음)`,
].join('\n')

function evaluate(results: ScenarioResults): { isMatched: boolean | undefined; actual: string } {
  const { direct, 'bff-serial': serial, 'bff-parallel': parallel } = results
  const lines: string[] = []
  const checks: boolean[] = []

  if (direct) {
    checks.push(direct.requestCount === 3)
    lines.push(`• 직접 호출: 요청 ${direct.requestCount}건, 브라우저 ${Math.round(direct.clientMs)}ms`)
  }
  if (serial?.server) {
    checks.push(serial.requestCount === 1, serial.server.serverMs >= LATENCY_SUM_MS - TIMER_SLACK_MS)
    lines.push(`• BFF 직렬: 요청 ${serial.requestCount}건, 서버 ${Math.round(serial.server.serverMs)}ms`)
  }
  if (parallel?.server) {
    const p = parallel.server.serverMs
    checks.push(parallel.requestCount === 1, p >= LATENCY_MAX_MS - TIMER_SLACK_MS, p < LATENCY_SUM_MS)
    lines.push(`• BFF 병렬: 요청 ${parallel.requestCount}건, 서버 ${Math.round(p)}ms`)
  }
  if (serial?.server && parallel?.server) {
    checks.push(parallel.server.serverMs < serial.server.serverMs)
    const saved = serial.server.serverMs - parallel.server.serverMs
    lines.push(`→ Promise.all로 서버 대기 ${Math.round(saved)}ms 단축`)
  }

  if (lines.length === 0) {
    return { isMatched: undefined, actual: '• 아직 실행하지 않았습니다. 표의 시나리오 버튼 3개를 모두 눌러 주세요.' }
  }
  if (checks.includes(false)) return { isMatched: false, actual: lines.join('\n') }
  const allRun = Boolean(direct && serial && parallel)
  if (!allRun) lines.push('• 나머지 시나리오를 실행하면 최종 판정합니다.')
  return { isMatched: allRun ? true : undefined, actual: lines.join('\n') }
}

export function VerificationFooter({ results }: { results: ScenarioResults }) {
  const { isMatched, actual } = evaluate(results)

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="레거시 API 취합: 요청 수와 서버 병렬화"
        expected={<span>{EXPECTED}</span>}
        actual={<span>{actual}</span>}
        isMatched={isMatched}
        description="요청 수는 브라우저 Resource Timing에 이번 실행(run=…)으로 기록된 항목 수, 서버 소요는 BFF Route Handler가 performance.now()로 재서 응답 meta와 Server-Timing 헤더에 담은 값입니다."
      />
      <DemoDeepDiveCard title="Route Handler로 여러 백엔드를 한 번에 취합하기 (BFF)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 개념</h5>
            <p>
              가이드의 &quot;데이터 조작&quot; 절: Route Handler는 하나 이상의 소스에서 데이터를 변환·필터링·<strong>집계</strong>해,
              로직을 프런트엔드 밖에 두고 내부 시스템을 노출하지 않는다. 브라우저는 <code>bff/route.ts</code> 하나만 알면 되고,
              주문·재고·배송 시스템의 주소와 호출 순서는 서버 안에 숨겨진다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 이 데모의 파일 구조</h5>
            <pre className="overflow-x-auto rounded bg-zinc-100 p-2.5 font-mono text-[11px] dark:bg-zinc-900">{`order-aggregation/
├─ _lib/legacy.ts             # 레거시 본체 함수 (서버 지연 포함, private folder)
├─ legacy/orders/route.ts     # 직접 호출용 HTTP 경로 (위 함수를 감쌈)
├─ legacy/inventory/route.ts  # 〃
├─ legacy/shipping/route.ts   # 〃
└─ bff/route.ts               # 위 함수를 직접 호출 + Promise.all → 1개 JSON`}</pre>
            <p className="mt-1.5">
              BFF는 자기 앱의 <code>legacy/*</code> URL을 다시 <code>fetch</code>하지 않는다. 가이드 Caveats대로 서버의 <code>fetch</code>는
              절대 URL이 필요하고(배포 도메인 의존) 추가 HTTP 왕복이 생기므로, 같은 앱 안의 데이터 소스는 함수로 직접 호출한다.
              실무에서 레거시가 다른 서버라면 이 함수 안의 대기 코드가 <code>fetch(내부 URL, {'{'} headers: 비밀 토큰 {'}'})</code>로 바뀌며,
              그 URL과 토큰은 서버 코드에만 존재한다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 측정값 읽는 법</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li><strong>요청 수</strong>는 3 → 1로 확실히 줄어든다. 요청마다 헤더·쿠키·TLS/연결 비용이 붙으므로 전송량(헤더 포함)도 함께 비교한다.</li>
              <li><strong>클라이언트 총 소요</strong>는 로컬에선 왕복 시간이 1ms 안팎이라 직접 병렬 호출과 BFF 병렬이 비슷하게 나온다. 모바일망처럼 왕복이 수십~수백 ms인 환경에서 요청 수 차이가 체감 시간 차이로 커진다.</li>
              <li><strong>BFF 내부 직렬 vs 병렬</strong>은 서로 의존하지 않는 호출을 <code>await</code> 세 번으로 쓰면 지연이 합산되고, <code>Promise.all</code>이면 가장 느린 호출만큼만 기다린다는 것을 서버 측정 구간으로 보여 준다.</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무 주의사항</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>하나라도 실패하면 <code>Promise.all</code>은 전체가 실패한다. 배송 추적처럼 없어도 되는 데이터는 <code>Promise.allSettled</code>로 부분 응답을 고려한다.</li>
              <li>오류 응답에 레거시 호스트·스택 같은 내부 정보를 담지 않는다(이 데모의 BFF는 502와 일반 메시지만 반환).</li>
              <li>Server Component 화면이라면 Route Handler를 거치지 말고 데이터 소스를 직접 호출한다. BFF Route Handler는 클라이언트 컴포넌트·모바일 앱·외부 클라이언트용 공개 엔드포인트다.</li>
              <li>일부 호스트는 Route Handler를 서버리스 함수로 배포하므로 긴 직렬 호출은 타임아웃 위험이 커진다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
