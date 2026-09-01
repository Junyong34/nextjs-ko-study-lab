'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  isLoaded?: boolean
  logs?: string[]
  count?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    isMatched: propIsMatched,
    expected: propExpected,
    actual: propActual,
    status,
    description: propDescription,
    isLoaded,
    logs,
    count,
    ...rest
  } = props

  const isMatched =
    propIsMatched !== undefined
      ? propIsMatched
      : status !== undefined && status !== null
      ? typeof status === 'number'
        ? status >= 200 && status < 400
        : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
      : isLoaded !== undefined
      ? Boolean(isLoaded)
      : logs && Array.isArray(logs) && logs.length > 0
      ? true
      : count !== undefined && count > 0
      ? true
      : undefined

  const defaultExpected = "• 주문 정산 배치 maxDuration 타임아웃 제한의 동작과 기대 결과를 확인합니다."
  const defaultActual = "• 사용자 조작 후 실제 결과를 표시합니다."

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="주문 정산 배치 maxDuration 타임아웃 제한 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="maxDuration 타임아웃 제한 세그먼트 설정 (Route Handler / SSR)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>export const maxDuration = number</code>는 서버리스 함수 및 Route Handler의 최대 실행 시간(초 단위)을 명시하여 플랫폼 기본 타임아웃을 안전하게 연장하거나 상한선을 설정하는 Next.js 표준 라우트 세그먼트 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 대규모 주문 정산 집계나 AI 이미지 생성 배치 API에서 기본 타임아웃(10초~15초)을 <code>maxDuration = 60</code>으로 확장하여, 긴 비동기 트랜잭션이 도중에 504 Gateway Timeout으로 끊기지 않고 안전하게 완료되는 과정을 실증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>대용량 비동기 배치 안정성</strong>: 결제 대사, 세무 정산, 대량 엑셀 다운로드 등 무거운 작업의 타임아웃 중단을 방지합니다.</li>
              <li><strong>무한 루프 및 비용 낭비 방지</strong>: 버그로 인한 무한 대기 작업에 명확한 시간 상한을 두어 서버리스 실행 비용 폭증을 방어합니다.</li>
              <li><strong>라우트 단위 정밀 튜닝</strong>: 모든 엔드포인트를 일괄 변경하지 않고 특정 배치 라우트만 선별적으로 실행 시간을 조정합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>일일 주문 정산 데이터 집계 및 엑셀 다운로드 생성 API</li>
              <li>대용량 상품 이미지 AI 일괄 리사이징 및 워터마크 배치 처리</li>
              <li>외부 PG사 웹훅 처리 및 ERP 대량 재고 동기화 Route Handler</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>호스팅 플랫폼 요금제 한계</strong>: <code>maxDuration</code> 값은 배포 플랫폼(Vercel 등)의 플랜별 최대 허용치(Hobby: 60s, Pro: 300s)를 초과할 수 없습니다.</li>
              <li><strong>사용자 응답성 고려</strong>: 브라우저와 직접 통신하는 웹 페이지 SSR에 너무 긴 <code>maxDuration</code>을 설정하면 사용자 이탈이 발생하므로 백그라운드 작업이나 Route Handler에 주로 적용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
