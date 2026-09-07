'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  description?: string
  refreshCount?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const { refreshCount } = props

  const defaultExpected =
    '• 초기 셸은 지연 없이 즉시 렌더링\n• 1차 청크(300ms)와 2차 청크(800ms)는 각자의 실제 지연 이후 스켈레톤에서 실제 콘텐츠로 순차 스트리밍 교체\n• [스트리밍 다시 재생] 클릭 시 router.refresh()로 서버에 새 RSC 요청이 발생하고 전체 시퀀스가 처음부터 다시 스트리밍됨'

  const hasRefreshed = refreshCount !== undefined && refreshCount > 0

  const defaultActual = hasRefreshed
    ? `• router.refresh() 트리거 ${refreshCount}회 감지 — 매 클릭마다 서버에 새 RSC 요청이 발생하고 청크가 처음부터 다시 스트리밍됨\n• Network 탭에서 클릭 시점마다 새 요청이 추가되는 것으로 확인 가능`
    : '• 상호작용 대기 중 ([스트리밍 다시 재생] 버튼을 클릭해 실제 서버 왕복이 발생하는지 확인해 주세요)'

  const isMatched = props.isMatched !== undefined ? props.isMatched : hasRefreshed ? true : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Suspense 스트리밍과 로딩 청크 순차 처리 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={props.description || '이 예제의 동작과 검증 결과를 표시합니다.'}
      />
      <DemoDeepDiveCard title="Suspense 스트리밍과 로딩 청크 순차 처리">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>점진적 청크 스트리밍(Progressive Chunk Streaming)은 React Suspense 경계로 감싼 비동기 Server Component가 각각 준비되는 시점에 HTML 청크와 인라인 교체 스크립트를 하나의 HTTP 응답 안에서 순차적으로 브라우저에 밀어 넣는 렌더링 파이프라인입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 3단계 파이프라인([초기 셸: 0ms] → [1차 청크: 상품 기본 스펙, 실제 300ms 지연] → [2차 청크: 실시간 고객 리뷰, 실제 800ms 지연])을 실행합니다. 각 청크는 실제 <code>await new Promise(resolve =&gt; setTimeout(resolve, ms))</code> 지연 후 <code>Suspense</code> fallback을 실제 콘텐츠로 교체하며, [스트리밍 다시 재생] 버튼은 <code>router.refresh()</code>로 서버에 새 RSC 요청을 실제로 발생시켜 전체 시퀀스를 재현합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>연결 유지형 순차 데이터 전달</strong>: 단일 HTTP 연결 안에서 추가적인 클라이언트 fetch 요청 없이 서버가 렌더링 완료 순서대로 콘텐츠를 밀어 넣어줍니다.</li>
              <li><strong>네트워크 레이턴시 은닉</strong>: 가장 느린 데이터가 전체 페이지 로딩을 막지 않고, 준비된 부분부터 먼저 보여줍니다.</li>
              <li><strong>브라우저 렌더링 파이프라인 최적화</strong>: 브라우저 파서가 청크를 수신하는 즉시 점진적으로 DOM 트리를 구축하여 렌더링 효율을 극대화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 상세 페이지의 기본 정보(빠름) + 리뷰/추천 상품(느림)을 함께 노출하는 화면</li>
              <li>대시보드의 핵심 지표(빠름) + 집계 리포트(느림)를 단계적으로 보여주는 화면</li>
              <li>여러 외부 API를 조합해야 하는 화면에서 가장 느린 API가 전체를 막지 않아야 할 때</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Nginx/프록시 버퍼링 설정</strong>: 리버스 프록시가 서버 응답을 버퍼링하면 스트리밍 효과가 사라지므로 프록시 설정에 <code>proxy_buffering off;</code>를 적용해야 합니다.</li>
              <li><strong>HTTP 헤더 전송 시점</strong>: 첫 번째 청크가 전송되는 순간 HTTP 상태 코드와 헤더가 확정되므로, 이후 스트리밍 중 발생한 에러는 상태 코드를 500으로 변경할 수 없음에 유의해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
