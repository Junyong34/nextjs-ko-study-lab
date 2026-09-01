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

  const defaultExpected = "• next/font/local 커스텀 로컬 폰트 매핑의 동작과 기대 결과를 확인합니다."
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
        title="next/font/local 커스텀 로컬 폰트 매핑 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="next/font/local 커스텀 로컬 폰트 매핑 및 멀티 웨이트 구성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/font/local</code>은 프로젝트 저장소 내의 커스텀 웹폰트 파일(<code>.woff2</code>, <code>.woff</code>, <code>.otf</code>, <code>.ttf</code>)을 로드하여 <code>@font-face</code> 규칙을 자동 생성하고, 폰트 파일 해싱 및 셀프 호스팅을 프레임워크 레벨에서 일원화하는 Next.js 폰트 컴포넌트입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 사내 전용 브랜드 폰트(Pretendard 등)의 Regular(400), Medium(500), Bold(700) woff2 파일들을 <code>localFont({'{'} src: [...] {'}'})</code> 배열로 매핑하여 단일 CSS 변수로 바인딩하고, 가변 웨이트에 맞춰 텍스트가 렌더링되는 과정을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>외부 CDN 의존성 탈피</strong>: 유료 라이선스 폰트나 기업 전용 커스텀 폰트를 안전하게 로컬 번들링하여 서빙합니다.</li>
              <li><strong>단일 font-family 멀티 웨이트 통합</strong>: 여러 폰트 파일을 단 하나의 CSS 패밀리명으로 묶어 <code>font-bold</code>, <code>font-medium</code> 클래스만으로 자동 매핑합니다.</li>
              <li><strong>자동 preload 링크 주입</strong>: 초기 렌더링에 필요한 폰트 파일에 대해 HTML head에 <code>{'<'}link rel="preload"{'>'}</code>를 자동 생성합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>기업 전용 CI/BI 커스텀 브랜드 폰트(Pretendard, Spoqa Han Sans 등) 서빙</li>
              <li>오프라인 인트라넷 또는 폐쇄망 엔터프라이즈 사내 시스템 웹앱</li>
              <li>영문/특수문자 전용 디스플레이 폰트와 본문 한글 폰트의 하이브리드 조합</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>WOFF2 포맷 우선 사용</strong>: 압축률이 가장 높은 <code>.woff2</code> 포맷을 사용해야 초기 번들 로딩 및 네트워크 대역폭을 최적화할 수 있습니다.</li>
              <li><strong>상대 경로 정확성</strong>: <code>src</code> 속성에 지정하는 파일 경로는 폰트를 선언하는 파일 위치 기준의 상대 경로(<code>../fonts/font.woff2</code>)로 명확히 작성해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
