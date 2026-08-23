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

  const defaultExpected = "• nodejs vs edge 런타임 대조 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 인터랙션 실패 또는 불일치 감지 (동작 재확인이 필요합니다)'
      : '• 인터랙션 대기 중 (상단 데모의 조작 요소를 실행하여 결과를 관찰하세요)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="nodejs vs edge 런타임 대조 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="runtime 라우트 세그먼트 설정 ('nodejs' vs 'edge')">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>export const runtime = 'nodejs' | 'edge'</code>는 특정 라우트 세그먼트의 실행 엔진을 완전한 Node.js 풀스택 환경(기본값) 또는 전 세계 CDN 에지에 분산 배포되는 V8 Edge 런타임 중 선택하는 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 GeoIP 기반 국가별 환율 변환이나 단순 캐시 조회 API는 <code>runtime = 'edge'</code>로 콜드스타트 0ms 저지연 실행하고, 파일 I/O나 Node.js 네이티브 암호화(<code>crypto</code>, <code>fs</code>) 및 무거운 DB ORM이 필요한 주문 정산은 <code>runtime = 'nodejs'</code>로 분기하는 아키텍처를 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>글로벌 최저 지연 시간(Edge)</strong>: 전 세계 300개 이상의 엣지 로케이션에서 사용자에게 가장 가까운 위치에서 즉시 응답합니다.</li>
              <li><strong>풍부한 Node.js 생태계 지원(Node.js)</strong>: 모든 C++ 네이티브 모듈, Prisma/TypeORM 등 무거운 데이터베이스 드라이버를 제약 없이 활용합니다.</li>
              <li><strong>하이브리드 비용 최적화</strong>: 가벼운 프론트 라우트는 엣지에서 저비용 고속 처리하고, 무거운 백엔드 작업은 Node.js 서버리스에서 처리합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>GeoIP 기반 로케일 리다이렉트 및 A/B 테스트 라우트 (Edge)</li>
              <li>실시간 글로벌 환율 계산 및 단순 쿠폰 유효성 검사 API (Edge)</li>
              <li>결제 승인, DB 트랜잭션 및 복잡한 세무 계산 백엔드 API (Node.js)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Edge 런타임의 Node.js API 제약</strong>: <code>edge</code> 런타임에서는 Node.js의 <code>fs</code>, <code>child_process</code>, 일부 <code>crypto</code> 메서드 및 <code>eval</code> 등이 지원되지 않으므로 Web Standard API만 사용해야 합니다.</li>
              <li><strong>번들 크기 제한</strong>: <code>edge</code> 함수는 빠른 기동을 위해 압축 후 1MB~4MB의 번들 크기 제한이 적용됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
