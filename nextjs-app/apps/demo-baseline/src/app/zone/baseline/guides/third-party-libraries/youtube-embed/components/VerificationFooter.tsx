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

  const defaultExpected = "• @next/third-parties YouTube 최적화 임베드의 동작과 기대 결과를 확인합니다."
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
        title="@next/third-parties YouTube 최적화 임베드 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="@next/third-parties YouTube 최적화 임베드">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>@next/third-parties/google</code>의 <code>{'<'}YouTubeEmbed{'>'}</code> 컴포넌트는 파사드(Facade) 패턴을 적용하여, 초기에는 500KB가 넘는 무거운 YouTube iframe 대신 가벼운 WebP 포스터 썸네일과 재생 버튼만 렌더링하고, 사용자가 클릭할 때 실제 비디오 플레이어를 지연 로드하는 표준 성능 최적화 컴포넌트입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 상품 홍보 영상 영역에 <code>{'<'}YouTubeEmbed videoid="ogfYd705cRs" /{'>'}</code>를 배치하여, 초기 로딩 시 JS 네트워크 페이로드를 0KB로 유지하다가 [동영상 재생] 클릭 시점에 iframe을 동적으로 마운트합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>초기 페이지 번들 용량 500KB+ 절감</strong>: YouTube iframe의 무거운 JS/CSS 및 불필요한 트래킹 스크립트가 초기 로딩에 다운로드되지 않아 모바일 데이터와 메모리를 절약합니다.</li>
              <li><strong>초기 로딩 속도(LCP) 극대화</strong>: 상품 상세 페이지에 영상이 포함되어 있어도 메인 히어로 이미지와 가격 정보가 지연 없이 즉시 렌더링됩니다.</li>
              <li><strong>반응형 가로세로 비율(16:9) 자동 유지</strong>: 별도의 복잡한 CSS 래퍼 없이도 모든 모바일/데스크톱 해상도에서 완벽한 비디오 비율을 유지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상품 상세 페이지의 언박싱 및 사용법 유튜브 홍보 영상</li>
              <li>브랜드 스토리, 런웨이 패션쇼 및 룩북 비디오 갤러리</li>
              <li>고객 인터뷰 및 실사용 리뷰 유튜브 쇼츠/동영상 임베드</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>params 옵션 자동재생 주의</strong>: <code>params="autoplay=1"</code>을 전달할 때는 브라우저 정책상 <code>mute=1</code>이 함께 지정되어야 소리 없는 자동 재생이 정상 동작합니다.</li>
              <li><strong>웹 접근성 라벨링</strong>: 스크린 리더 사용자가 동영상 목적을 인지할 수 있도록 적절한 <code>playlabel</code> 또는 접근성 텍스트를 제공하는 것이 좋습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
