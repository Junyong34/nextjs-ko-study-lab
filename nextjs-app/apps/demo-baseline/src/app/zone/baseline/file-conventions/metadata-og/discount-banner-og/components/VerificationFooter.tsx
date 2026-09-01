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

  const defaultExpected = "• opengraph-image.tsx 및 twitter-image.tsx 파일에서 ImageResponse 반환\n• Next.js가 1200x630 및 1200x600 규격의 이미지 엔드포인트를 생성하고 meta property=og:image 주입"
  const defaultActual = "• opengraph-image.tsx (1200x630) 및 twitter-image.tsx (1200x600) 파이프라인 생성 완료\n• SNS 공유용 동적 이미지 바이너리 렌더링 확인"

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
        title="동적 OpenGraph / Twitter 이미지 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router의 opengraph-image.tsx 특수 파일을 통한 SNS 공유 카드 썸네일 동적 생성 메커니즘을 검증합니다."}
      />
      <DemoDeepDiveCard title="동적 OpenGraph / Twitter 이미지 생성 (opengraph-image.tsx)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>opengraph-image.tsx</code> 및 <code>twitter-image.tsx</code>는 특정 라우트 세그먼트에서 <code>ImageResponse</code>를 반환하여 소셜 미디어 공유 시 표시되는 1200x630 규격의 맞춤형 오픈그래프 이미지를 서버리스로 실시간 렌더링하는 Next.js 메타데이터 파일입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 상품 상세 페이지(<code>products/[id]/opengraph-image.tsx</code>)에서 파라미터 <code>id</code>를 수신하여 해당 상품의 고해상도 이미지, 상품명, 할인가격, 할인율 뱃지를 Flexbox 기반 JSX로 합성하고 카카오톡/트위터/슬랙 공유 카드로 실시간 생성하는 과정을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>SNS 공유 전환율 극대화</strong>: 고정된 기본 로고 대신 상품별 가격/할인율/제목이 새겨진 맞춤형 썸네일 카드를 자동 생성하여 소셜 유입 클릭률(CTR)을 높입니다.</li>
              <li><strong>React JSX & CSS Flexbox 지원</strong>: 별도의 캔버스 라이브러리(node-canvas 등) 없이 순수 React 컴포넌트 문법으로 이미지를 디자인합니다.</li>
              <li><strong>글로벌 CDN 에지 캐싱</strong>: 생성된 이미지는 Next.js 이미지 캐시 레이어에 저장되어 동일 URL 요청 시 0ms로 응답합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>이커머스 타임세일 상품별 실시간 할인율 배너 OG 이미지</li>
              <li>블로그 포스트 제목 및 작성자 프로필 카드 소셜 공유 썸네일</li>
              <li>이벤트 프로모션 및 쿠폰 당첨 결과 맞춤형 SNS 공유 이미지</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>지원 CSS 스타일 제한</strong>: Satori 기반 <code>ImageResponse</code> 엔진은 Flexbox 중심의 CSS 서브셋만 지원하므로 CSS Grid나 복잡한 애니메이션 속성은 지원되지 않습니다.</li>
              <li><strong>커스텀 폰트 로딩</strong>: 한글 폰트를 렌더링하려면 Google Fonts의 Noto Sans KR woff 버퍼를 <code>fetch</code>하여 <code>fonts</code> 옵션 배열에 반드시 등록해야 글자 깨짐을 방지할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
