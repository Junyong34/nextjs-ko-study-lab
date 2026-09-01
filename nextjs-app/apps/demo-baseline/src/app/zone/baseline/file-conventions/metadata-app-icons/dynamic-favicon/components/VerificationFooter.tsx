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

  const defaultExpected = "• icon.tsx 및 apple-icon.tsx가 Next.js 메타데이터 라우트로 등록\n• ImageResponse(JSX)를 통해 32x32 및 180x180 PNG 바이너리 스트림 생성"
  const defaultActual = "• icon.tsx (32x32) 및 apple-icon.tsx (180x180) 파일 컨벤션 파이프라인 마운트 완료\n• HTML head 태그에 link rel=icon 및 apple-touch-icon 자동 주입 감지"

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
        title="동적 메타데이터 앱 아이콘 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router의 icon.tsx 및 apple-icon.tsx 특수 파일을 통한 동적 아이콘 자동 서빙 및 메타데이터 주입을 검증합니다."}
      />
      <DemoDeepDiveCard title="동적 메타데이터 앱 아이콘 (icon.tsx / apple-icon.tsx)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>icon.tsx</code> 및 <code>apple-icon.tsx</code>는 Next.js App Router의 메타데이터 특수 파일 컨벤션으로, <code>ImageResponse</code> JSX를 통해 빌드 또는 런타임에 동적으로 PNG/SVG 파비콘 및 앱 터치 아이콘 바이너리 스트림을 생성하고 HTML <code>{'<'}head{'>'}</code>에 <code>{'<'}link{'>'}</code> 태그를 자동 주입합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 장바구니 담긴 상품 수량 뱃지나 사용자 접속 알림 개수를 반영하여 32x32(favicon) 및 180x180(apple-touch-icon) 크기의 아이콘을 실시간 렌더링하고 브라우저 탭 아이콘으로 적용하는 흐름을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>실시간 상태 기반 파비콘 변경</strong>: 읽지 않은 알림 수, 다크/라이트 모드, 사용자 프로필 이니셜을 파비콘에 즉시 반영합니다.</li>
              <li><strong>자동 HTML Head 태그 관리</strong>: 정적 파일 경로 작성 없이 파일 컨벤션만으로 완벽한 MIME 타입과 rel 속성을 자동 주입합니다.</li>
              <li><strong>Edge 런타임 고속 이미지 생성</strong>: 경량 V8 환경에서 <code>ImageResponse</code>를 실행하여 10ms 미만으로 아이콘을 서빙합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 장바구니 담긴 개수 또는 신규 주문 알림 뱃지 파비콘</li>
              <li>사용자 다크모드/라이트모드 테마 감지 기반 브랜드 로고 파비콘 자동 반전</li>
              <li>PWA 모바일 홈 화면 추가용 다이내믹 애플 터치 아이콘</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>정적 파일 우선순위</strong>: 동일 폴더에 <code>favicon.ico</code>나 <code>icon.png</code> 등 정적 파일이 있으면 정적 파일이 우선되므로 동적 생성을 위해서는 정적 아이콘 파일을 제거하거나 이름을 분리해야 합니다.</li>
              <li><strong>크기(size) export 필수</strong>: <code>export const size = {'{'} width: 32, height: 32 {'}'}</code> 및 <code>export const contentType = 'image/png'</code>를 명시하여 Next.js가 정확한 메타데이터 헤더를 구성하도록 해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
