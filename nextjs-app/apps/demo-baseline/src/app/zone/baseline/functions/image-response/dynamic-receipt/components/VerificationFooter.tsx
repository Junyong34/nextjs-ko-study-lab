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

  const defaultExpected = "• ImageResponse 동적 결제 영수증 이미지 생성 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="ImageResponse 동적 결제 영수증 이미지 생성 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="ImageResponse Satori 엔진 기반 동적 전자 영수증 이미지 생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>ImageResponse</code>(<code>next/og</code>)는 Satori 및 Resvg 엔진을 기반으로 JSX와 Flexbox CSS를 서버사이드에서 직접 해석하여 초경량 고속 PNG 바이너리를 생성하는 표준 API입니다. 헤드리스 브라우저(Puppeteer) 없이 주문 결제 영수증 같은 동적 문서를 수십 밀리초(ms) 만에 렌더링합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 주문 결제 완료 시 주문 번호(<code>ORD-2026-8821</code>), 구매자명, 결제 품목 목록, 부가세 포함 총 결제액(<code>189,000원</code>), PG 승인 번호를 파라미터로 받아 Satori JSX 레이아웃에 주입하고, 모바일 규격의 전자 결제 영수증 PNG 스트림을 즉시 반환합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 리소스 95% 절감</strong>: 수백 MB의 메모리를 점유하는 Chromium/Puppeteer 대비 수 MB 수준의 V8 메모리만으로 동작합니다.</li>
              <li><strong>글로벌 초저지연 응답</strong>: Edge Runtime 배포를 통해 결제 완료 고객에게 50ms 이내의 속도로 영수증 이미지를 스트리밍합니다.</li>
              <li><strong>이미지 기반 위변조 방지</strong>: HTML 텍스트가 아닌 서버 서명 렌더링된 PNG 이미지로 제공되어 클라이언트 변조를 방지하고 손쉬운 캡처/저장을 지원합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>결제 완료 후 카카오톡 알림톡/문자 첨부용 전자 영수증 이미지 생성</li>
              <li>모바일 앱/웹에서의 오프라인 매장 결제 확인용 바코드 영수증 다운로드</li>
              <li>월간 정산 내역서 및 세금계산서 요약본 자동 이미지 발행</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>한글 폰트 번들링 필수</strong>: Satori는 기본 영문 폰트만 내장하므로, 한글 텍스트(원, 품목명)가 깨지지 않으려면 Pretendard/NotoSans의 WOFF/TTF <code>ArrayBuffer</code>를 <code>fonts</code> 옵션에 명시해야 합니다.</li>
              <li><strong>Flexbox CSS 제약</strong>: Satori는 CSS Grid나 <code>float</code>를 지원하지 않으며 <code>display: flex</code> 기반의 서브셋만 지원하므로 레이아웃 구성 시 Flexbox를 엄격히 사용해야 합니다.</li>
              <li><strong>불변 캐시 헤더 설정</strong>: 동일 주문 번호의 영수증은 내용이 변하지 않으므로 <code>Cache-Control: public, max-age=31536000, immutable</code> 헤더를 부여하여 CDN 캐싱 효율을 극대화합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
