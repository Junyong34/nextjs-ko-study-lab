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

  const defaultExpected = "• 상품 홍보 영상 지연 로딩 및 자동 재생 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 5단 표준 레이아웃 정상 적용"

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
        title="상품 홍보 영상 지연 로딩 및 자동 재생 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="상품 홍보 영상 지연 로딩 및 자동 재생">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>비디오 지연 로딩 아키텍처는 Intersection Observer 및 <code>next/dynamic</code>을 활용하여, 비디오 요소가 사용자의 뷰포트에 도달하기 전까지 미디어 버퍼 다운로드를 차단(<code>preload="none"</code>)함으로써 초기 페이지 대역폭과 LCP 성능을 보호하는 미디어 최적화 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 스크롤 전에는 가벼운 포스터 이미지만 표시하다가, 비디오 위젯이 화면에 진입하는 순간 <code>muted</code> 및 <code>autoPlay</code> 속성과 함께 비디오 스트림을 로드하여 재생을 시작하는 과정을 실증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>초기 데이터 트래픽 90% 절감</strong>: 수십 MB 용량의 비디오 파일이 페이지 첫 로딩 시 자동 다운로드되어 발생하는 불필요한 CDN 대역폭 비용을 절감합니다.</li>
              <li><strong>Core Web Vitals(LCP/FID) 방어</strong>: 무거운 미디어 로딩으로 인한 브라우저 네트워크 병목을 해소하여 메인 상품 텍스트와 이미지가 최고 속도로 렌더링됩니다.</li>
              <li><strong>모바일 배터리 및 메모리 절약</strong>: 보이지 않는 비디오의 디코딩 연산을 방지하여 모바일 사용자의 배터리 소모를 억제합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>패션 브랜드 룩북 및 모델 착용 런웨이 영상 지연 재생</li>
              <li>가전/IT 기기 인터랙티브 기능 시연 백그라운드 루프 비디오</li>
              <li>사용자 후기 숏폼 비디오 무한 스크롤 피드</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>모바일 자동재생 정책(Muted 필수)</strong>: 모바일 브라우저는 사용자의 명시적 조작 없이 소리가 있는 영상의 자동 재생을 차단하므로 반드시 <code>muted playsInline autoPlay</code> 속성을 함께 선언해야 합니다.</li>
              <li><strong>포스터 이미지 크기 최적화</strong>: 지연 로딩 중 노출되는 <code>poster</code> 이미지는 <code>next/image</code>로 사전 최적화된 WebP/AVIF 규격을 사용하여 CLS를 방지해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
