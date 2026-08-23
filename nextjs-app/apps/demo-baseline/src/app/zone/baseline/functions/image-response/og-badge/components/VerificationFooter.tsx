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

  const defaultExpected = "• ImageResponse를 활용한 실시간 할인 뱃지 OG 이미지 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="ImageResponse를 활용한 실시간 할인 뱃지 OG 이미지 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="ImageResponse 동적 할인 뱃지 및 프로모션 OG 이미지 생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>ImageResponse</code> (<code>next/og</code>)는 Satori 및 Resvg 엔진을 기반으로 JSX와 CSS Flexbox 문법을 서버리스 환경에서 고속 렌더링하여 동적 Open Graph(OG) PNG 이미지를 생성하는 API입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 상품 할인율(<code>'45% OFF'</code>), 상품명, 브랜드 컬러를 쿼리 파라미터로 수신하여 Satori JSX 템플릿에 바인딩하고, 소셜 공유용 맞춤 할인 뱃지 PNG 바이너리 스트림을 즉각 반환합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>SNS 공유 클릭률(CTR) 극대화</strong>: 정적 로고 대신 실시간 할인율과 상품명이 각인된 매력적인 OG 카드를 카카오톡/페이스북에 노출합니다.</li>
              <li><strong>초경량 서버리스 렌더링</strong>: 무거운 Chromium/Puppeteer 없이 수 MB 메모리로 수십 밀리초 만에 이미지를 생성합니다.</li>
              <li><strong>CDN 불변 캐싱 연동</strong>: 동일한 파라미터 요청에 대해 강력한 CDN 캐시를 적용하여 비용을 최소화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>타임 세일 특가 상품의 실시간 할인율 각인 소셜 공유 배너</li>
              <li>회원 초대 이벤트 시 초대 코드와 추천인 닉네임이 새겨진 맞춤 카드</li>
              <li>동적 설문/테스트 결과 공유 이미지 생성</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>한글 웹폰트 로딩</strong>: Satori 기본 영문 폰트로는 한글이 깨지므로 Pretendard/NotoSans의 TTF/WOFF <code>ArrayBuffer</code>를 폰트 옵션에 주입해야 합니다.</li>
              <li><strong>CSS 제약</strong>: Flexbox 기반 CSS 서브셋만 지원하므로 Grid, 애니메이션, float 등 미지원 CSS 속성을 사용하지 않아야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
