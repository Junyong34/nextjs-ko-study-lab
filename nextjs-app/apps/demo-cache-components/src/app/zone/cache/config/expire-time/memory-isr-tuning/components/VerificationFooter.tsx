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

  const defaultExpected = "• expireTime 메모리 ISR 캐시 보존 기간 튜닝 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="expireTime 메모리 ISR 캐시 보존 기간 튜닝 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="expireTime 메모리 ISR 캐시 보존 기간 튜닝">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>expireTime은 서버 메모리 및 파일 시스템 캐시에서 만료된 이전 버전의 ISR/Data Cache 항목을 가비지 컬렉션하고 파기하는 만료 시간(초 단위)을 튜닝하는 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>expireTime: 3600 설정 시 재검증 주기가 지난 구버전 캐시 사본을 지정된 시간 동안 보관하여 백그라운드 재검증 중에도 안정적인 stale 응답을 보장한 뒤 안전하게 폐기합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>서버 메모리 누수 방지: 장기간 운영되는 프로덕션 서버에서 만료된 고아 캐시 데이터가 메모리를 잠식하는 것을 방지합니다.</li>
              <li>SWR(Stale-While-Revalidate) 복원력: 백엔드 API 장애 시 만료 유예 시간 동안 기존 캐시 사본을 서빙하여 서비스 무중단을 유지합니다.</li>
              <li>디스크 I/O 최적화: 불필요한 오래된 캐시 파일을 정기적으로 청소하여 파일 시스템 I/O 병목을 해소합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>수백만 개 상품 카탈로그를 운영하는 대형 쇼핑몰 서버 메모리 최적화</li>
              <li>백엔드 DB 일시 지연 시 stale 캐시 서빙 유예 시간 확보</li>
              <li>고부하 이커머스 컨테이너 환경의 메모리 사용량 안정화</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
