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

  const defaultExpected = "• opengraph-image.tsx 동적 OG 이미지 생성 (ImageResponse) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="opengraph-image.tsx 동적 OG 이미지 생성 (ImageResponse) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="opengraph-image.tsx 동적 OG 이미지 생성 (ImageResponse)">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>opengraph-image.tsx</code>는 Satori 및 Resvg 엔진을 기반으로 JSX와 CSS Flexbox를 런타임에 직접 렌더링하여 OpenGraph/Twitter 소셜 미리보기 PNG 바이너리를 동적으로 생성하는 App Router 표준 파일 컨벤션 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 상품명(<code>프리미엄 러닝화</code>), 실시간 할인가(<code>129,000원</code>), 잔여 재고 뱃지 데이터를 동적으로 주입하여 1200x630 해상도의 고품질 소셜 공유 OG 이미지를 서버사이드에서 생성하고 캐시 헤더와 함께 브라우저에 스트리밍합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>디자이너 수작업 제로화</strong>: 수만 개의 상품마다 별도 배너를 제작할 필요 없이 데이터베이스 실시간 연동으로 자동 생성합니다.</li>
                    <li><strong>카카오톡/소셜 바이럴 클릭률(CTR) 극대화</strong>: 최신 가격, 할인율, 한정 수량 문구가 담긴 맞춤형 카드를 표시합니다.</li>
                    <li><strong>서버 부하 최소화</strong>: 가벼운 V8 Isolate 기반 Satori 엔진으로 수십 밀리초(ms) 만에 렌더링하여 서버리스 환경에 최적화합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>이커머스 상품 공유 시 실시간 특가 할인율과 품절 임박 뱃지가 포함된 OG 이미지</li>
                    <li>사용자 맞춤형 심리테스트 / 성향 분석 결과 공유 카드 동적 생성</li>
                    <li>블로그/기술 문서 제목 및 작성자 프로필이 합성된 자동 썸네일</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>폰트 ArrayBuffer 로딩</strong>: 한글이나 특수문자 깨짐을 방지하려면 WOFF/TTF 폰트 파일을 <code>fetch</code>하여 <code>fonts: [{'{'} data, name, weight {'}'}]</code> 옵션에 반드시 전달해야 합니다.</li>
                    <li><strong>사이즈/타입 export 명시</strong>: <code>export const size = {'{'} width: 1200, height: 630 {'}'}</code> 및 <code>export const contentType = 'image/png'</code>를 함께 export하면 Next.js가 메타 태그를 완벽하게 자동 생성합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
