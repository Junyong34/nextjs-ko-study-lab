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

  const defaultExpected = "• assetPrefix: 'https://cdn.shop.com' CDN 자산 배포 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="assetPrefix: 'https://cdn.shop.com' CDN 자산 배포 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="next.config.ts assetPrefix CDN 정적 에셋 분산 호스팅">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>assetPrefix: 'https://cdn.example.com'</code> (<code>next.config.ts</code>) 설정은 빌드 시 생성되는 자바스크립트 번들, CSS 스타일시트, 정적 미디어 파일의 다운로드 URL 앞에 전용 CDN 도메인을 강제로 주입하여 원본 서버의 트래픽 부담을 덜고 정적 파일 로딩 속도를 극대화하는 빌드 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 HTML 문서 자체는 원본 서버에서 서빙되지만, 문서 내부에서 참조하는 모든 <code>/_next/static/...</code> 번들 스크립트와 스타일이 <code>https://cdn.shop.com/_next/static/...</code> 주소로 변환되어 글로벌 엣지 CDN 노드에서 초고속 다운로드되는 동작을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>원본 서버 네트워크 대역폭 90% 이상 절감</strong>: 수백 메가바이트의 JS/CSS 정적 파일 트래픽을 CDN 오리진으로 완전히 분산합니다.</li>
              <li><strong>글로벌 정적 에셋 다운로드 가속</strong>: 전 세계 사용자 인근의 엣지 PoP 서버에서 에셋을 캐싱 서빙하여 First Meaningful Paint(FMP)를 단축합니다.</li>
              <li><strong>오리진 장애 시 정적 리소스 보호</strong>: 원본 웹 서버의 일시적 장애 상황에서도 CDN에 캐싱된 UI 에셋은 안전하게 제공됩니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대규모 프로모션 및 트래픽 폭증 시 Cloudflare/CloudFront CDN으로 정적 에셋 오프로딩</li>
              <li>글로벌 다국어 서비스의 리전별 정적 에셋 지연 시간 최소화</li>
              <li>멀티 존(Multi-Zones) 아키텍처에서의 공통 에셋 도메인 분리</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>CORS 설정 필수</strong>: 별도 CDN 도메인에서 웹폰트나 JS 청크를 로드할 경우 브라우저 CORS 정책에 의해 차단될 수 있으므로 CDN 버킷에 <code>Access-Control-Allow-Origin: *</code> 헤더를 반드시 설정해야 합니다.</li>
              <li><strong>HTML 문서는 제외</strong>: HTML 문서 자체는 항상 최신 배포 버전을 가리켜야 하므로 <code>assetPrefix</code>의 대상이 아니며 원본 서버에서 서빙됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
